import sharp from "sharp";
import { readdir, mkdir, copyFile, writeFile } from "fs/promises";
import { join, extname } from "path";

const SOURCE = "SITE WEB";
const DEST = "public/images";
const VIDEO_DEST = "public/videos";
const MAX_WIDTH = 2400;
const JPEG_QUALITY = 85;

function slugify(name) {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const SKIP_EXT = new Set([".psd", ".pdf", ".ds_store"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png"]);
const VIDEO_EXT = new Set([".mp4", ".mov", ".webm"]);

async function walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkDir(full)));
    } else {
      files.push(full);
    }
  }
  return files;
}

async function processImages() {
  const manifest = [];

  // Process logo first
  const logoSrc = join(SOURCE, "LOGO PLAN", "P_ SANS FOND_NOIR.png");
  const logoDest = join(DEST, "logo.png");
  await mkdir(DEST, { recursive: true });

  try {
    const logoMeta = await sharp(logoSrc).metadata();
    if (logoMeta.width > MAX_WIDTH) {
      await sharp(logoSrc).resize({ width: MAX_WIDTH }).png({ quality: 90 }).toFile(logoDest);
    } else {
      await sharp(logoSrc).png({ quality: 90 }).toFile(logoDest);
    }
    const finalMeta = await sharp(logoDest).metadata();
    console.log(`✓ Logo: ${finalMeta.width}x${finalMeta.height}`);
    manifest.push({ path: "/images/logo.png", width: finalMeta.width, height: finalMeta.height, category: "logo" });
  } catch (e) {
    console.error(`✗ Logo error: ${e.message}`);
  }

  // Process category images
  const categories = [
    { src: "PRODUCTION VISUELLE", dest: "production-visuelle" },
    { src: "BRANDING", dest: "branding" },
  ];

  for (const cat of categories) {
    const catSrcDir = join(SOURCE, cat.src);
    const catDestDir = join(DEST, cat.dest);

    let subDirs;
    try {
      subDirs = await readdir(catSrcDir, { withFileTypes: true });
    } catch {
      console.warn(`Skipping ${cat.src}: not found`);
      continue;
    }

    for (const subDir of subDirs) {
      if (!subDir.isDirectory()) continue;
      const subSlug = slugify(subDir.name);
      const subSrcDir = join(catSrcDir, subDir.name);
      const subEntries = await readdir(subSrcDir, { withFileTypes: true });

      // Check if this has project subdirectories or is itself a project
      const hasProjectDirs = subEntries.some((e) => e.isDirectory() && !e.name.startsWith("."));

      if (hasProjectDirs) {
        // Sub-category with project folders (e.g., CORPORATE/LINKER)
        for (const projEntry of subEntries) {
          if (!projEntry.isDirectory() || projEntry.name.startsWith(".")) continue;
          const projSlug = slugify(projEntry.name);
          const projSrcDir = join(subSrcDir, projEntry.name);
          const projDestDir = join(catDestDir, subSlug, projSlug);
          await mkdir(projDestDir, { recursive: true });

          const projFiles = await readdir(projSrcDir);
          let idx = 0;
          for (const file of projFiles.sort()) {
            const ext = extname(file).toLowerCase();
            if (SKIP_EXT.has(ext) || !IMAGE_EXT.has(ext)) continue;

            idx++;
            const destName = `${projSlug}-${String(idx).padStart(2, "0")}.jpg`;
            const destPath = join(projDestDir, destName);
            try {
              const meta = await sharp(join(projSrcDir, file)).metadata();
              let pipeline = sharp(join(projSrcDir, file)).rotate();
              if (meta.width > MAX_WIDTH) {
                pipeline = pipeline.resize({ width: MAX_WIDTH });
              }
              await pipeline.jpeg({ quality: JPEG_QUALITY }).toFile(destPath);
              const finalMeta = await sharp(destPath).metadata();
              const imgPath = `/images/${cat.dest}/${subSlug}/${projSlug}/${destName}`;
              manifest.push({
                path: imgPath,
                width: finalMeta.width,
                height: finalMeta.height,
                category: cat.dest,
                subcategory: subSlug,
                project: projSlug,
              });
              console.log(`✓ ${imgPath}`);
            } catch (e) {
              console.error(`✗ ${file}: ${e.message}`);
            }
          }
        }
      } else {
        // Direct project folder (e.g., BRANDING/ENZA)
        const projSlug = subSlug;
        const projDestDir = join(catDestDir, projSlug);
        await mkdir(projDestDir, { recursive: true });

        let idx = 0;
        for (const entry of subEntries.sort((a, b) => a.name.localeCompare(b.name))) {
          if (entry.isDirectory()) continue;
          const ext = extname(entry.name).toLowerCase();

          if (VIDEO_EXT.has(ext)) {
            await mkdir(VIDEO_DEST, { recursive: true });
            const videoName = `${projSlug}.mp4`;
            const videoDestPath = join(VIDEO_DEST, videoName);
            await copyFile(join(subSrcDir, entry.name), videoDestPath);
            console.log(`✓ Video: /videos/${videoName}`);
            manifest.push({
              path: `/videos/${videoName}`,
              type: "video",
              category: cat.dest,
              project: projSlug,
            });
            continue;
          }

          if (SKIP_EXT.has(ext) || !IMAGE_EXT.has(ext)) continue;

          idx++;
          const destName = `${projSlug}-${String(idx).padStart(2, "0")}.jpg`;
          const destPath = join(projDestDir, destName);
          try {
            const meta = await sharp(join(subSrcDir, entry.name)).metadata();
            let pipeline = sharp(join(subSrcDir, entry.name)).rotate();
            if (meta.width > MAX_WIDTH) {
              pipeline = pipeline.resize({ width: MAX_WIDTH });
            }
            await pipeline.jpeg({ quality: JPEG_QUALITY }).toFile(destPath);
            const finalMeta = await sharp(destPath).metadata();
            const imgPath = `/images/${cat.dest}/${projSlug}/${destName}`;
            manifest.push({
              path: imgPath,
              width: finalMeta.width,
              height: finalMeta.height,
              category: cat.dest,
              project: projSlug,
            });
            console.log(`✓ ${imgPath}`);
          } catch (e) {
            console.error(`✗ ${entry.name}: ${e.message}`);
          }
        }
      }
    }
  }

  await writeFile("lib/image-manifest.json", JSON.stringify(manifest, null, 2));
  console.log(`\n✓ Manifest written with ${manifest.length} entries`);
}

processImages().catch(console.error);
