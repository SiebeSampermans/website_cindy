import { NextResponse } from "next/server";
import { deactivateUser } from "@/lib/db";
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
  await deactivateUser(Number(id));

  return redirectTo(new URL("/admin/users?status=deactivated", request.url));
}
