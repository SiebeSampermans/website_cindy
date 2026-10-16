import { requireAdmin, redirectTo, formString } from "@/lib/admin-route";
import { getPopups, getStoredContent } from "@/lib/cms";
import { deleteUpload, isValidMediaName, mediaUrl } from "@/lib/media";

export async function POST(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  const formData = await request.formData();
  const name = formString(formData, "name", 200);

  if (!isValidMediaName(name)) {
    return redirectTo(request, "/admin/afbeeldingen");
  }

  // Niet verwijderen als de afbeelding nog ergens op de site gebruikt wordt.
  const url = mediaUrl(name);
  const [content, popups] = await Promise.all([getStoredContent(), getPopups()]);
  const inUse =
    Object.values(content).some((value) => JSON.stringify(value).includes(url)) ||
    popups.some((popup) => popup.image === url);

  if (inUse) {
    return redirectTo(request, "/admin/afbeeldingen", { error: "Deze afbeelding wordt nog gebruikt op de site en is niet verwijderd." });
  }

  try {
    await deleteUpload(name);
  } catch {
    return redirectTo(request, "/admin/afbeeldingen", { error: "De afbeelding kon niet verwijderd worden." });
  }

  return redirectTo(request, "/admin/afbeeldingen", { deleted: 1 });
}
