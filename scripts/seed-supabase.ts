import { config } from "dotenv";
config({ path: ".env.local" });

import { createClient } from "@supabase/supabase-js";
import { categories } from "../lib/portfolio-data";
import type { Database } from "../lib/supabase/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error(
    "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or NEXT_PUBLIC_SUPABASE_ANON_KEY) in .env.local"
  );
  process.exit(1);
}

const supabase = createClient<Database>(url, key);

async function seed() {
  console.log("Seeding categories…");

  for (let catIdx = 0; catIdx < categories.length; catIdx++) {
    const cat = categories[catIdx];

    const { data: catRow, error: catErr } = await supabase
      .from("categories")
      .upsert(
        {
          slug: cat.slug,
          title: cat.title,
          description: cat.description,
          cover_image: cat.coverImage,
          sort_order: catIdx,
        },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (catErr) throw catErr;
    const categoryId = catRow.id;
    console.log(`  ✓ ${cat.title} (${categoryId})`);

    // Subcategories + their projects
    if (cat.subcategories) {
      for (let subIdx = 0; subIdx < cat.subcategories.length; subIdx++) {
        const sub = cat.subcategories[subIdx];

        const { data: subRow, error: subErr } = await supabase
          .from("subcategories")
          .upsert(
            {
              slug: sub.slug,
              title: sub.title,
              category_id: categoryId,
              sort_order: subIdx,
            },
            { onConflict: "category_id,slug" }
          )
          .select("id")
          .single();

        if (subErr) throw subErr;
        const subcategoryId = subRow.id;
        console.log(`    ✓ ${sub.title} (${subcategoryId})`);

        await seedProjects(sub.projects, categoryId, subcategoryId);
      }
    }

    // Direct projects (no subcategory)
    if (cat.projects) {
      await seedProjects(cat.projects, categoryId, null);
    }
  }

  console.log("\nDone!");
}

async function seedProjects(
  projects: typeof categories[0]["projects"],
  categoryId: string,
  subcategoryId: string | null
) {
  if (!projects) return;

  for (let projIdx = 0; projIdx < projects.length; projIdx++) {
    const proj = projects[projIdx];

    const { data: projRow, error: projErr } = await supabase
      .from("projects")
      .upsert(
        {
          slug: proj.slug,
          title: proj.title,
          category_id: categoryId,
          subcategory_id: subcategoryId,
          video: proj.video ?? null,
          sort_order: projIdx,
        },
        { onConflict: "category_id,slug" }
      )
      .select("id")
      .single();

    if (projErr) throw projErr;
    const projectId = projRow.id;
    console.log(`      ✓ ${proj.title} (${projectId})`);

    // Delete existing images for this project before re-inserting
    await supabase
      .from("project_images")
      .delete()
      .eq("project_id", projectId);

    const images = proj.images.map((img, imgIdx) => ({
      project_id: projectId,
      src: img.src,
      width: img.width,
      height: img.height,
      alt: img.alt,
      sort_order: imgIdx,
    }));

    const { error: imgErr } = await supabase
      .from("project_images")
      .insert(images);

    if (imgErr) throw imgErr;
    console.log(`        → ${images.length} images`);
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
