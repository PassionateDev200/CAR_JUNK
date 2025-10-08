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
    if (!cookie) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    let payload;
    try {
      payload = jwt.verify(cookie, JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const user = await CustomerAuth.findById(payload.sub).select("email");
    if (!user) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    return NextResponse.json({ authenticated: true, user: { email: user.email } });
  } catch (err) {
    console.error("Me error", err);
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}





