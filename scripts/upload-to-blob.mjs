import { put } from "@vercel/blob";
import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { config } from "dotenv";

config({ path: ".env.local" });

function getAllFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...getAllFiles(full));
    } else if (/\.(jpg|jpeg|png|mp4|webp)$/i.test(entry)) {
      results.push(full);
    }
  }
  return results;
}

async function main() {
  const files = [
    ...getAllFiles("public/images"),
    ...getAllFiles("public/videos"),
  ];

  console.log(`Uploading ${files.length} files...\n`);

  const urlMap = {};
  let done = 0;

  for (const file of files) {
    const key = relative("public", file); // e.g. "images/branding/domolovi/domolovi-01.jpg"
    const content = readFileSync(file);

    const { url } = await put(key, content, {
      access: "public",
      addRandomSuffix: false,
    });

    urlMap["/" + key] = url;
    done++;
    console.log(`[${done}/${files.length}] ${key}`);
  }

  writeFileSync("lib/blob-urls.json", JSON.stringify(urlMap, null, 2));
  console.log(`\nDone! URL map saved to lib/blob-urls.json`);
}

main().catch(console.error);
