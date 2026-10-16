import { requireAdmin, redirectTo } from "@/lib/admin-route";
import { setUserActive } from "@/lib/db";

export async function POST(request, { params }) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  const { id } = await params;
  await setUserActive(Number(id), true);
  return redirectTo(request, "/admin/users", { status: "activated" });
}
