/** route: src/app/api/auth/logout/route.js */
import { NextResponse } from "next/server";

const SESSION_COOKIE = "cj_session";

export async function POST() {
  const res = NextResponse.json({ success: true });
  
  // Clear the authentication cookie by setting it to expire immediately
  res.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // Expire immediately
    expires: new Date(0), // Set to past date to ensure deletion
  });
  
  return res;
}





