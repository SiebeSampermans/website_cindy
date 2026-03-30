import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getUserEmailById, storePasswordResetToken } from "@/lib/db";
import { sendMail } from "@/lib/mailer";
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
  const email = await getUserEmailById(userId);

  if (!email) {
    return redirectTo(new URL("/admin/users?status=mail-error", request.url));
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
  await storePasswordResetToken({ id: userId, token, expiresAt });

  const appUrl = process.env.APP_URL || new URL("/", request.url).origin;
  const resetLink = `${appUrl}/admin/reset-password?token=${token}`;

  try {
    await sendMail({
      to: email,
      subject: "Wachtwoord resetten",
      text: `Je hebt een verzoek ingediend om je wachtwoord te resetten. Gebruik deze link binnen het uur: ${resetLink}`,
      html: `
        <p>Je hebt een verzoek ingediend om je wachtwoord te resetten.</p>
        <p><a href="${resetLink}">Klik hier om je wachtwoord opnieuw in te stellen</a></p>
        <p>Deze link is 1 uur geldig.</p>
      `
    });

    return redirectTo(new URL("/admin/users?status=mail-sent", request.url));
  } catch {
    return redirectTo(new URL("/admin/users?status=mail-error", request.url));
  }
}
