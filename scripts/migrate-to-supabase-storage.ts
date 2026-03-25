import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";

config({ path: ".env.local" });

const BLOB_BASE = "https://bvo9cxhu4qde9fk6.public.blob.vercel-storage.com";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const DRY_RUN = process.argv.includes("--dry-run");

async function downloadFile(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function mimeType(path: string): string {
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".mp4")) return "video/mp4";
  return "application/octet-stream";
}

/** Extract all Vercel Blob URLs from the database */
async function collectBlobUrls(): Promise<string[]> {
  const urls = new Set<string>();

  const { data: images } = await supabase.from("project_images").select("src");
  images?.forEach((i) => { if (i.src.includes(BLOB_BASE)) urls.add(i.src); });

  const { data: cats } = await supabase.from("categories").select("cover_image");
  cats?.forEach((c) => { if (c.cover_image.includes(BLOB_BASE)) urls.add(c.cover_image); });

  const { data: projects } = await supabase.from("projects").select("video");
  projects?.forEach((p) => { if (p.video?.includes(BLOB_BASE)) urls.add(p.video); });

  return Array.from(urls);
}

/** Convert a full Blob URL to a Supabase Storage path */
function toStoragePath(blobUrl: string): string {
  // e.g. "https://bvo9…/images/branding/domolovi/domolovi-01.jpg" → "images/branding/domolovi/domolovi-01.jpg"
  return blobUrl.replace(BLOB_BASE + "/", "");
}

async function main() {
  console.log("Collecting Blob URLs from database...");
  const blobUrls = await collectBlobUrls();
  console.log(`Found ${blobUrls.length} unique files to migrate`);
  if (DRY_RUN) console.log("DRY RUN — no uploads will be performed\n");

  let uploaded = 0;
  let failed = 0;

  for (const blobUrl of blobUrls) {
    const storagePath = toStoragePath(blobUrl);

    if (DRY_RUN) {
      console.log(`[DRY] ${storagePath}`);
      uploaded++;
      continue;
    }

    try {
      const data = await downloadFile(blobUrl);

      const { error } = await supabase.storage.from("media").upload(storagePath, data, {
        contentType: mimeType(storagePath),
        upsert: true,
      });

      if (error) {
        console.error(`[FAIL] ${storagePath}: ${error.message}`);
        failed++;
      } else {
        uploaded++;
        console.log(`[${uploaded}/${blobUrls.length}] ${storagePath}`);
      }
    } catch (err) {
      console.error(`[FAIL] ${storagePath}: ${err}`);
      failed++;
    }
  }

  console.log(`\nStorage upload done: ${uploaded} uploaded, ${failed} failed`);

  if (DRY_RUN) {
    console.log("\nSkipping DB updates (dry run)");
    return;
  }

  // Update database URLs: replace Blob base with Supabase Storage base
  const storageBase = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media`;

  console.log("\nUpdating project_images.src...");
  const { data: images } = await supabase.from("project_images").select("id, src");
  let imgCount = 0;
  if (images) {
    for (const img of images) {
      if (img.src.includes(BLOB_BASE)) {
        await supabase.from("project_images").update({ src: img.src.replace(BLOB_BASE, storageBase) }).eq("id", img.id);
        imgCount++;
      }
    }
    console.log(`  Updated ${imgCount} image URLs`);
  }

  console.log("Updating categories.cover_image...");
  const { data: cats } = await supabase.from("categories").select("id, cover_image");
  let catCount = 0;
  if (cats) {
    for (const cat of cats) {
      if (cat.cover_image.includes(BLOB_BASE)) {
        await supabase.from("categories").update({ cover_image: cat.cover_image.replace(BLOB_BASE, storageBase) }).eq("id", cat.id);
        catCount++;
      }
    }
    console.log(`  Updated ${catCount} cover URLs`);
  }

  console.log("Updating projects.video...");
  const { data: projects } = await supabase.from("projects").select("id, video");
  let vidCount = 0;
  if (projects) {
    for (const proj of projects) {
      if (proj.video?.includes(BLOB_BASE)) {
        await supabase.from("projects").update({ video: proj.video.replace(BLOB_BASE, storageBase) }).eq("id", proj.id);
        vidCount++;
      }
    }
    console.log(`  Updated ${vidCount} video URLs`);
  }

  console.log("\nMigration complete!");
}

main().catch(console.error);
