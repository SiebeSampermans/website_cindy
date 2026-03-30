import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getUserIdByResetToken, updateUserPassword } from "@/lib/db";

function redirectTo(url) {
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  const formData = await request.formData();
  const token = String(formData.get("token") || "");
  const password = String(formData.get("nieuw_wachtwoord") || "");

  const redirectUrl = new URL("/admin/reset-password", request.url);
  redirectUrl.searchParams.set("token", token);

  if (!token || !password) {
    redirectUrl.searchParams.set("status", "invalid");
    return redirectTo(redirectUrl);
  }

  const userId = await getUserIdByResetToken(token);

  if (!userId) {
    redirectUrl.searchParams.set("status", "invalid");
    return redirectTo(redirectUrl);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await updateUserPassword(userId, passwordHash);
  redirectUrl.searchParams.set("status", "success");
  return redirectTo(redirectUrl);
}
