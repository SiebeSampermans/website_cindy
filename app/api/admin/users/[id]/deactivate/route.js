import { requireAdmin, redirectTo } from "@/lib/admin-route";
import { setUserActive } from "@/lib/db";

export async function POST(request, { params }) {
  const { session, response } = await requireAdmin(request);
  if (response) return response;

  const { id } = await params;

  if (Number(id) === Number(session.id)) {
    return redirectTo(request, "/admin/users", { status: "self" });
  }

  await setUserActive(Number(id), false);
  return redirectTo(request, "/admin/users", { status: "deactivated" });
}
