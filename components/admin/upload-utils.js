// Verkleint foto's in de browser voor ze geüpload worden: sneller voor bezoekers en
// nodig op Vercel, waar een upload maximaal 4,5 MB mag zijn.
const MAX_SIDE = 2400;
const TARGET_BYTES = 3.5 * 1024 * 1024;

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`${file.name} kon niet gelezen worden.`));
    };
    image.src = url;
  });
}

export async function prepareImage(file) {
  // GIF's (mogelijk geanimeerd) laten we ongemoeid.
  if (file.type === "image/gif") {
    if (file.size > TARGET_BYTES) throw new Error(`${file.name} is te groot (max. 3,5 MB voor GIF).`);
    return file;
  }

  const image = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(image.naturalWidth, image.naturalHeight));

  if (scale === 1 && file.size <= TARGET_BYTES) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(image.naturalWidth * scale);
  canvas.height = Math.round(image.naturalHeight * scale);
  canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);

  // PNG kan transparant zijn: dan WEBP (houdt transparantie), anders JPEG.
  const type = file.type === "image/png" ? "image/webp" : "image/jpeg";
  const ext = type === "image/webp" ? "webp" : "jpg";

  for (const quality of [0.85, 0.75, 0.6]) {
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, type, quality));
    if (blob && blob.size <= TARGET_BYTES) {
      return new File([blob], file.name.replace(/\.[^.]+$/, "") + `.${ext}`, { type });
    }
  }

  throw new Error(`${file.name} is te groot, ook na verkleinen.`);
}

// Uploadt bestanden één per één naar /api/admin/media en geeft de URL's terug.
export async function uploadImages(files) {
  const urls = [];
  const errors = [];

  for (const file of files) {
    try {
      const body = new FormData();
      body.append("files", await prepareImage(file));
      const response = await fetch("/api/admin/media", {
        method: "POST",
        body,
        headers: { Accept: "application/json" }
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(result.error || `${file.name}: upload mislukt.`);
      urls.push(...result.urls);
    } catch (error) {
      errors.push(error.message);
    }
  }

  return { urls, errors };
}
