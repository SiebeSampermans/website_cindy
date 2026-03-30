import { NextResponse } from "next/server";
import { clearSessionCookie } from "@/lib/session";

export async function POST(request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  await clearSessionCookie(response.cookies);
  return response;
}
