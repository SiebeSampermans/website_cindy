import { requireAdmin, redirectTo, formString } from "@/lib/admin-route";
import { getSiteContent, resetContentValues, saveContentValues } from "@/lib/cms";
import { GALLERY_KEY, isSafeImage } from "@/lib/content-registry";
import { saveUpload } from "@/lib/media";

const PAGE = "/admin/gallerij";

export async function POST(request) {
  const { session, response } = await requireAdmin(request);
  if (response) return response;

  const formData = await request.formData();
  const action = formString(formData, "action", 50);

  if (action === "restore") {
    await resetContentValues([GALLERY_KEY]);
    return redirectTo(request, PAGE, { status: "restored" });
  }

  const content = await getSiteContent();
  let images = [...content[GALLERY_KEY]];
  let error;

  if (action === "save") {
    images = images.map((image, index) => ({
      ...image,
      alt: formString(formData, `alt-${index}`, 200) || image.alt
    }));
  } else if (action.startsWith("up:") || action.startsWith("down:") || action.startsWith("remove:")) {
    const [kind, rawIndex] = action.split(":");
    const index = Number(rawIndex);

    if (Number.isInteger(index) && images[index]) {
      if (kind === "remove") {
        images.splice(index, 1);
      } else {
        const target = kind === "up" ? index - 1 : index + 1;
        if (images[target]) [images[index], images[target]] = [images[target], images[index]];
      }
    }
  } else if (action === "add") {
    const urls = formData.getAll("urls").map(String).filter(isSafeImage);
    images.push(...urls.map((url) => ({ thumb: url, full: url, alt: "Foto t Snuffeltje" })));
  } else if (action === "upload") {
    const files = formData.getAll("files").filter((file) => typeof file === "object" && file.size > 0);

    for (const file of files) {
      try {
        const url = await saveUpload(file);
        images.push({ thumb: url, full: url, alt: "Foto t Snuffeltje" });
      } catch (uploadError) {
        error = uploadError.message;
      }
    }
  }

  await saveContentValues([[GALLERY_KEY, images]], session.id);
  return redirectTo(request, PAGE, { status: error ? undefined : "saved", error });
}
