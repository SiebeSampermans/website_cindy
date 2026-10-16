import { createHash, timingSafeEqual } from "node:crypto";
import bcrypt from "bcryptjs";
import { redirectTo, formString } from "@/lib/admin-route";
import { countUsers, createUser } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";

const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function codeMatches(input) {
  const expected = process.env.ADMIN_SETUP_CODE;
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

// Maakt het allereerste admin-account aan. Werkt enkel zolang er nog geen enkele gebruiker bestaat.
export async function POST(request) {
  if ((await countUsers()) > 0) {
    return redirectTo(request, "/admin/login");
  }

  const formData = await request.formData();

  if (!codeMatches(String(formData.get("code") || ""))) {
    return redirectTo(request, "/admin/login", { error: "setup-code" });
  }

  const firstName = formString(formData, "vnaam", 100);
  const lastName = formString(formData, "naam", 100);
  const email = formString(formData, "email", 200).toLowerCase();
  const password = String(formData.get("wachtwoord") || "");

  if (!firstName || !lastName || !EMAIL.test(email) || password.length < 8) {
    return redirectTo(request, "/admin/login", { error: "setup-invalid" });
  }

  const id = await createUser({ firstName, lastName, email, passwordHash: await bcrypt.hash(password, 10) });
  const response = redirectTo(request, "/admin");
  await setSessionCookie(response.cookies, { id, email, firstName, lastName });
  return response;
}
