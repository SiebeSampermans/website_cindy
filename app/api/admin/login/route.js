import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { findActiveUserByEmail } from "@/lib/db";
import { setSessionCookie } from "@/lib/session";

const attempts = new Map();

function redirectTo(url) {
  return NextResponse.redirect(url, 303);
}

function getAttemptState(email) {
  const now = Date.now();
  const state = attempts.get(email);

  if (!state || state.blockedUntil < now) {
    return { count: 0, blockedUntil: 0 };
  }

  return state;
}

function registerFailedAttempt(email) {
  const now = Date.now();
  const current = getAttemptState(email);
  const count = current.count + 1;
  const blockedUntil = count >= 5 ? now + 60000 : 0;
  attempts.set(email, { count, blockedUntil });
  return blockedUntil > now;
}

function clearAttempts(email) {
  attempts.delete(email);
}

export async function POST(request) {
  const formData = await request.formData();
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  const loginUrl = new URL("/admin/login", request.url);

  if (!email || !password) {
    loginUrl.searchParams.set("error", "invalid");
    return redirectTo(loginUrl);
  }

  const state = getAttemptState(email);
  if (state.blockedUntil > Date.now()) {
    loginUrl.searchParams.set("error", "blocked");
    return redirectTo(loginUrl);
  }

  const user = await findActiveUserByEmail(email);
  const isValid = user ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!isValid) {
    const blocked = registerFailedAttempt(email);
    loginUrl.searchParams.set("error", blocked ? "blocked" : "invalid");
    return redirectTo(loginUrl);
  }

  clearAttempts(email);

  const response = redirectTo(new URL("/admin", request.url));
  await setSessionCookie(response.cookies, user);
  return response;
}
