import { NextResponse } from "next/server";
import { updateHomepageNotice } from "@/lib/db";
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
  const title = String(formData.get("titel") || "").trim();
  const text = String(formData.get("tekst") || "").trim();

  if (title && text) {
    await updateHomepageNotice(title, text);
  }

  return redirectTo(new URL("/admin?updated=1", request.url));
}
