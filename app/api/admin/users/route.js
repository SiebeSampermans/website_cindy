import bcrypt from "bcryptjs";
import { requireAdmin, redirectTo, formString } from "@/lib/admin-route";
import { createUser, findUserIdByEmail } from "@/lib/db";

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

export async function POST(request) {
  const { response } = await requireAdmin(request);
  if (response) return response;

  const formData = await request.formData();
  const firstName = formString(formData, "vnaam", 100);
  const lastName = formString(formData, "naam", 100);
  const email = formString(formData, "email", 200).toLowerCase();
  const password = String(formData.get("wachtwoord") || "");

  if (!firstName || !lastName || !EMAIL.test(email)) {
    return redirectTo(request, "/admin/users", { status: "invalid" });
  }

  if (password.length < 8) {
    return redirectTo(request, "/admin/users", { status: "short-password" });
  }

  if (await findUserIdByEmail(email)) {
    return redirectTo(request, "/admin/users", { status: "duplicate" });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await createUser({ firstName, lastName, email, passwordHash });
  return redirectTo(request, "/admin/users", { status: "added" });
}
