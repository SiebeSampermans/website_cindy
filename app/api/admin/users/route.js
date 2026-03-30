import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createUser } from "@/lib/db";
import { getSession } from "@/lib/session";

function redirectTo(url) {
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  const session = await getSession();

  if (!session) {
    return redirectTo(new URL("/admin/login", request.url));
  }

  const formData = await request.formData();
  const firstName = String(formData.get("vnaam") || "").trim();
  const lastName = String(formData.get("naam") || "").trim();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("wachtwoord") || "");

  if (firstName && lastName && email && password) {
    const passwordHash = await bcrypt.hash(password, 10);
    await createUser({ firstName, lastName, email, passwordHash });
  }

  return redirectTo(new URL("/admin/users?status=added", request.url));
}
