import { requireAdmin, redirectTo } from "@/lib/admin-route";
import { deletePopup } from "@/lib/cms";

export async function POST(request, { params }) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  const { id } = await params;
  await deletePopup(Number(id));
  return redirectTo(request, "/admin/popups", { status: "deleted" });
}
