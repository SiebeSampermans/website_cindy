import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

// Kleine hulpfuncties voor de /api/admin routes (formulieren posten en worden teruggestuurd).

export function redirectTo(request, pathname, params = {}) {
  const url = new URL(pathname, request.url);

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) url.searchParams.set(key, value);
  }

  return NextResponse.redirect(url, 303);
}

export async function requireAdmin(request) {
  const session = await getSession();
  return session ? { session } : { response: redirectTo(request, "/admin/login") };
}

export function formString(formData, name, maxLength = 5000) {
  return String(formData.get(name) ?? "").replace(/\r\n/g, "\n").trim().slice(0, maxLength);
}
