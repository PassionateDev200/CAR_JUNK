/** route: src/app/api/auth/register/route.js */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import CustomerAuth from "@/models/CustomerAuth";
import { rateLimit, getClientIP } from "@/lib/rateLimit";

const SESSION_COOKIE = "cj_session";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function POST(request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`register_${clientIP}`, 3, 15 * 60 * 1000); // 3 attempts per 15 min
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: "Too many registration attempts. Please try again later.",
          retryAfter: rateLimitResult.retryAfter 
        }, 
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
          }
        }
      );
    }

    await connectToDatabase();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Enhanced email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 });
    }
    
    // Password strength validation
    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await CustomerAuth.findOne({ email: normalizedEmail });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await CustomerAuth.create({ email: normalizedEmail, passwordHash });

    const token = jwt.sign({ sub: user._id.toString(), email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const res = NextResponse.json({ success: true, user: { email: user.email } });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
    });
    
    // Add rate limit headers
    res.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    return res;
  } catch (err) {
    console.error("Register error", err);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}


