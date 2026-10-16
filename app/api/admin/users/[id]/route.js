import { requireAdmin, redirectTo, formString } from "@/lib/admin-route";
import { findUserIdByEmail, getUserById, updateUser } from "@/lib/db";

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export async function POST(request, { params }) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  const { id } = await params;
  const userId = Number(id);
  const formData = await request.formData();
  const firstName = formString(formData, "vnaam", 100);
  const lastName = formString(formData, "naam", 100);
  const email = formString(formData, "email", 200).toLowerCase();

  if (!(await getUserById(userId))) {
    return redirectTo(request, "/admin/users");
  }

  if (!firstName || !lastName || !EMAIL.test(email)) {
    return redirectTo(request, "/admin/users", { status: "invalid" });
  }

  const existingId = await findUserIdByEmail(email);

  if (existingId && Number(existingId) !== userId) {
    return redirectTo(request, "/admin/users", { status: "duplicate" });
  }

  await updateUser(userId, { firstName, lastName, email });
  return redirectTo(request, "/admin/users", { status: "updated" });
}
