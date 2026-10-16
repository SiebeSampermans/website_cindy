import { requireAdmin, redirectTo } from "@/lib/admin-route";
import { createPopup, getPopup, updatePopup } from "@/lib/cms";
import { parsePopupForm } from "@/lib/popups";

export async function POST(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  const formData = await request.formData();
  const id = Number(formData.get("id")) || null;
  const { popup, error } = parsePopupForm(formData);

  if (error) {
    return redirectTo(request, `/admin/popups/${id || "nieuw"}`, { error });
  }

  if (id) {
    if (!(await getPopup(id))) return redirectTo(request, "/admin/popups");
    await updatePopup(id, popup);
    return redirectTo(request, `/admin/popups/${id}`, { status: "saved" });
  }

  const newId = await createPopup(popup);
  return redirectTo(request, `/admin/popups/${newId}`, { status: "created" });
}
