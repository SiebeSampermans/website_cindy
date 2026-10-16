import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getUserById, storePasswordResetToken } from "@/lib/db";
import { sendTemplateMail } from "@/lib/mail-templates";
import { getSession } from "@/lib/session";

function redirectTo(url) {
  return NextResponse.redirect(url, 303);
}

export async function POST(request, { params }) {
  const session = await getSession();

  if (!session) {
    return redirectTo(new URL("/admin/login", request.url));
  }

  const { id } = await params;
  const userId = Number(id);
  const user = await getUserById(userId);

  if (!user) {
    return redirectTo(new URL("/admin/users?status=mail-error", request.url));
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await storePasswordResetToken({ id: userId, token, expiresAt });

  const appUrl = process.env.APP_URL || new URL("/", request.url).origin;
  const resetLink = `${appUrl}/admin/reset-password?token=${token}`;

  try {
    await sendTemplateMail("password_reset", {
      to: user.email,
      values: { voornaam: user.firstName, link: resetLink }
    });

    return redirectTo(new URL("/admin/users?status=mail-sent", request.url));
  } catch {
    return redirectTo(new URL("/admin/users?status=mail-error", request.url));
  }
}
