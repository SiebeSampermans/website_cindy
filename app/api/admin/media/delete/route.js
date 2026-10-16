import { requireAdmin, redirectTo, formString } from "@/lib/admin-route";
import { getPopups, getStoredContent } from "@/lib/cms";
import { deleteUpload } from "@/lib/media";

export async function POST(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  const formData = await request.formData();
  const url = formString(formData, "url", 1000);

  if (!url) {
    return redirectTo(request, "/admin/afbeeldingen");
  }

  // Niet verwijderen als de afbeelding nog ergens op de site gebruikt wordt.
  const [content, popups] = await Promise.all([getStoredContent(), getPopups()]);
  const inUse =
    Object.values(content).some((value) => JSON.stringify(value).includes(url)) ||
    popups.some((popup) => popup.image === url);

  if (inUse) {
    return redirectTo(request, "/admin/afbeeldingen", { error: "Deze afbeelding wordt nog gebruikt op de site en is niet verwijderd." });
  }

  try {
    await deleteUpload(url);
  } catch {
    return redirectTo(request, "/admin/afbeeldingen", { error: "De afbeelding kon niet verwijderd worden." });
  }

  return redirectTo(request, "/admin/afbeeldingen", { deleted: 1 });
}
