import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

function redirectTo(url) {
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  const formData = await request.formData();
  const naam = String(formData.get("naam") || "").trim();
  const emailadres = String(formData.get("emailadres") || "").trim();
  const onderwerp = String(formData.get("onderwerp") || "").trim();
  const bericht = String(formData.get("bericht") || "").trim();

  const baseUrl = new URL("/contact", request.url);

  if (!naam || !emailadres || !onderwerp || !bericht) {
    baseUrl.searchParams.set("status", "error");
    return redirectTo(baseUrl);
  }

  try {
    await sendMail({
      to: process.env.CONTACT_TO_EMAIL || "tsnuffeltje@gmail.com",
      subject: "Mail via formulier",
      text: `Iemand heeft het contactformulier ingevuld.\n\nNaam: ${naam}\nE-mail: ${emailadres}\nOnderwerp: ${onderwerp}\nBericht: ${bericht}`,
      html: `
        <p>Iemand heeft het contactformulier ingevuld.</p>
        <p><strong>Naam:</strong> ${naam}</p>
        <p><strong>E-mail:</strong> ${emailadres}</p>
        <p><strong>Onderwerp:</strong> ${onderwerp}</p>
        <p><strong>Bericht:</strong><br>${bericht.replace(/\n/g, "<br>")}</p>
      `
    });

    baseUrl.searchParams.set("status", "success");
    return redirectTo(baseUrl);
  } catch {
    baseUrl.searchParams.set("status", "error");
    return redirectTo(baseUrl);
  }
}
