import { randomBytes } from "node:crypto";
import { mkdir, readdir, readFile, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, list, put } from "@vercel/blob";
import siteImages from "@/lib/site-images.json";

// Geüploade afbeeldingen worden op één van twee plaatsen bewaard:
//  - Vercel Blob, als BLOB_READ_WRITE_TOKEN ingesteld is (nodig op Vercel: daar is de schijf niet blijvend).
//  - Anders in UPLOAD_DIR (standaard ./uploads), geserveerd via /media/<bestandsnaam>.
// Op Vercel kan een request maximaal 4,5 MB zijn; de browser verkleint foto's daarom eerst
// (zie components/admin/upload-utils.js).
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const BLOB_PREFIX = "media/";

const types = {
  jpg: { mime: "image/jpeg", magic: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  png: { mime: "image/png", magic: (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  gif: { mime: "image/gif", magic: (b) => b.subarray(0, 4).toString("ascii") === "GIF8" },
  webp: { mime: "image/webp", magic: (b) => b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP" }
};

const NAME_PATTERN = /^[a-z0-9-]+\.(jpg|png|gif|webp)$/;

function useBlob() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

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

// Bewaart een geüpload bestand en geeft de URL terug. Het type wordt bepaald op basis van de inhoud.
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

  if (useBlob()) {
    const blob = await put(`${BLOB_PREFIX}${name}`, buffer, {
      access: "public",
      contentType: types[ext].mime,
      cacheControlMaxAge: 31536000
    });
    return blob.url;
  }

  const dir = getUploadDir();
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), buffer);
  return mediaUrl(name);
}

export async function listUploads() {
  if (useBlob()) {
    const items = [];
    let cursor;

    do {
      const result = await list({ prefix: BLOB_PREFIX, cursor, limit: 1000 });
      items.push(
        ...result.blobs.map((blob) => ({
          name: blob.pathname.slice(BLOB_PREFIX.length),
          url: blob.url,
          size: blob.size,
          modifiedAt: new Date(blob.uploadedAt).getTime()
        }))
      );
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    return items.sort((a, b) => b.modifiedAt - a.modifiedAt);
  }

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

// Verwijdert een upload op basis van zijn URL. Enkel URL's uit listUploads worden aanvaard.
export async function deleteUpload(url) {
  const upload = (await listUploads()).find((item) => item.url === url);

  if (!upload) {
    throw new Error("Onbekende afbeelding.");
  }

  if (useBlob()) {
    await del(upload.url);
  } else {
    await unlink(path.join(getUploadDir(), upload.name));
  }
}

// De afbeeldingen die al bij de website horen (public/images). De lijst wordt bij elke build
// opnieuw gemaakt door scripts/site-images.mjs, omdat public/ op Vercel niet leesbaar is vanuit de server.
export async function listSiteImages() {
  return siteImages;
}

// Alle kiesbare afbeeldingen: eerst de eigen uploads, dan de bestaande site-afbeeldingen.
export async function listImageOptions() {
  const [uploads, site] = await Promise.all([listUploads().catch(() => []), listSiteImages()]);
  return [
    ...uploads.map((item) => ({ url: item.url, label: item.name, group: "Uploads" })),
    ...site.map((item) => ({ url: item.url, label: item.name, group: "Website" }))
  ];
}
