import { randomBytes } from "node:crypto";
import { mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

// Geüploade afbeeldingen komen in UPLOAD_DIR (standaard ./uploads, buiten git) en worden
// geserveerd via /media/<bestandsnaam>. Zo blijven ze bestaan na een nieuwe build/deploy.
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const types = {
  jpg: { mime: "image/jpeg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  png: { mime: "image/png", magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  gif: { mime: "image/gif", magic: (b) => b.subarray(0, 4).toString("ascii") === "GIF8" },
  webp: { mime: "image/webp", magic: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" }
};

const NAME_PATTERN = /^[a-z0-9-]+\.(jpg|png|gif|webp)$/;

export function getUploadDir() {
  return path.resolve(process.env.UPLOAD_DIR || path.join(process.cwd(), "uploads"));
}

export function isValidMediaName(name) {
  return NAME_PATTERN.test(name);
}

export function mediaUrl(name) {
  return `/media/${name}`;
}

export function mimeForName(name) {
  return types[name.split(".").pop()]?.mime || "application/octet-stream";
}

function slugify(value) {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

// Bewaart een geüpload bestand. Het type wordt bepaald op basis van de inhoud, niet de naam.
export async function saveUpload(file) {
  if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
    throw new Error("Geen bestand gekozen.");
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(`${file.name} is groter dan 10 MB.`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = Object.keys(types).find((key) => types[key].magic(buffer));

  if (!ext) {
    throw new Error(`${file.name} is geen JPG, PNG, GIF of WEBP afbeelding.`);
  }

  const base = slugify(String(file.name || "").replace(/\.[^.]+$/, "")) || "afbeelding";
  const name = `${base}-${randomBytes(4).toString("hex")}.${ext}`;
  const dir = getUploadDir();

  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return mediaUrl(name);
}

export async function listUploads() {
  const dir = getUploadDir();
  let names = [];

  try {
    names = (await readdir(dir)).filter(isValidMediaName);
  } catch {
    return [];
  }

  const items = await Promise.all(
    names.map(async (name) => {
      const info = await stat(path.join(dir, name));
      return { name, url: mediaUrl(name), size: info.size, modifiedAt: info.mtimeMs };
    })
  );

  return items.sort((a, b) => b.modifiedAt - a.modifiedAt);
}

export async function readUpload(name) {
  if (!isValidMediaName(name)) return null;

  try {
    return await readFile(path.join(getUploadDir(), name));
  } catch {
    return null;
  }
}

export async function deleteUpload(name) {
  if (!isValidMediaName(name)) return;
  await unlink(path.join(getUploadDir(), name));
}

// De afbeeldingen die al bij de website horen (public/images), zodat je daar ook uit kan kiezen.
export async function listSiteImages() {
  const root = path.join(process.cwd(), "public", "images");
  const results = [];

  async function walk(dir) {
    let entries = [];

    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
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
  return results.sort((a, b) => a.name.localeCompare(b.name));
}

// Alle kiesbare afbeeldingen: eerst de eigen uploads, dan de bestaande site-afbeeldingen.
export async function listImageOptions() {
  const [uploads, siteImages] = await Promise.all([listUploads(), listSiteImages()]);
  return [
    ...uploads.map((item) => ({ url: item.url, label: item.name, group: "Uploads" })),
    ...siteImages.map((item) => ({ url: item.url, label: item.name, group: "Website" }))
  ];
}
