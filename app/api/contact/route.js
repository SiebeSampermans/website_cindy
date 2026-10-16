import { NextResponse } from "next/server";
import { sendTemplateMail } from "@/lib/mail-templates";

const SUBJECTS = ["Trimsalon", "Bodywork"];
const EMAIL = /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/;

function redirectTo(url) {
  return NextResponse.redirect(url, 303);
}

export async function POST(request) {
  const formData = await request.formData();
  const naam = String(formData.get("naam") || "").trim().slice(0, 100);
  const emailadres = String(formData.get("emailadres") || "").trim().slice(0, 200);
  const onderwerp = String(formData.get("onderwerp") || "").trim();
  const bericht = String(formData.get("bericht") || "").trim().slice(0, 5000);

  const baseUrl = new URL("/contact", request.url);

  if (!naam || !EMAIL.test(emailadres) || !SUBJECTS.includes(onderwerp) || !bericht) {
    baseUrl.searchParams.set("status", "error");
    return redirectTo(baseUrl);
  }

  try {
    await sendTemplateMail("contact_notification", {
      to: process.env.CONTACT_TO_EMAIL || "tsnuffeltje@gmail.com",
      replyTo: emailadres,
      values: { naam, email: emailadres, onderwerp, bericht }
    });
  } catch {
    baseUrl.searchParams.set("status", "error");
    return redirectTo(baseUrl);
  }

  try {
    await sendTemplateMail("contact_confirmation", {
      to: emailadres,
      values: { naam, onderwerp }
    });
  } catch {
    // De melding naar het salon is wel vertrokken; een mislukte bevestiging is geen fout voor de bezoeker.
  }

  baseUrl.searchParams.set("status", "success");
  return redirectTo(baseUrl);
}
