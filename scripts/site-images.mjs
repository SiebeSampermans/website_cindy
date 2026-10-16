// Maakt lib/site-images.json: de lijst van afbeeldingen in public/images die in het
// beheergedeelte gekozen kunnen worden. Draait automatisch voor `npm run dev` en `npm run build`.
import { readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = path.join(process.cwd(), "public", "images");
const results = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (entry.name === "favicon" || entry.name === "resized-images") continue;
      await walk(path.join(dir, entry.name));
    } else if (/\.(jpe?g|png|gif|webp)$/i.test(entry.name)) {
      const relative = path.relative(root, path.join(dir, entry.name)).split(path.sep).join("/");
      results.push({ name: relative, url: `/images/${encodeURI(relative)}` });
    }
  }
}

await walk(root);
results.sort((a, b) => a.name.localeCompare(b.name));
await writeFile(path.join(process.cwd(), "lib", "site-images.json"), `${JSON.stringify(results, null, 2)}\n`);
console.log(`site-images.json: ${results.length} afbeeldingen`);
