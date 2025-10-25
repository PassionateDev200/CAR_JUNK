/** route: src/app/api/auth/me/route.js */
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import CustomerAuth from "@/models/CustomerAuth";

const SESSION_COOKIE = "cj_session";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export async function GET(request) {
  try {
    await connectToDatabase();
    const cookie = request.cookies.get(SESSION_COOKIE)?.value;
    console.log("Auth me - cookie exists:", !!cookie);
    
    if (!cookie) {
      console.log("Auth me - no cookie found");
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    let payload;
    try {
      payload = jwt.verify(cookie, JWT_SECRET);
      console.log("Auth me - JWT verified successfully");
    } catch (e) {
      console.log("Auth me - JWT verification failed:", e.message);
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const user = await CustomerAuth.findById(payload.sub).select("email");
    if (!user) {
      console.log("Auth me - user not found in database");
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    console.log("Auth me - authentication successful for:", user.email);
    return NextResponse.json({ authenticated: true, user: { email: user.email } });
  } catch (err) {
    console.error("Auth me - server error:", err);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}





