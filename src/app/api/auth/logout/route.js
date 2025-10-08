/** route: src/app/api/auth/logout/route.js */
import { NextResponse } from "next/server";

const SESSION_COOKIE = "cj_session";

export async function POST() {
  const res = NextResponse.json({ success: true });
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}





