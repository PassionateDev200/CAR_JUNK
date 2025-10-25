/** route: src/app/api/auth/login/route.js */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import CustomerAuth from "@/models/CustomerAuth";
import { rateLimit, getClientIP } from "@/lib/rateLimit";

const SESSION_COOKIE = "cj_session";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const COOKIE_MAX_AGE = 60 * 60 * 3; // 3 hours

export async function POST(request) {
  try {
    // Rate limiting
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`login_${clientIP}`, 5, 15 * 60 * 1000); // 5 attempts per 15 min
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: "Too many login attempts. Please try again later.",
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

    const normalizedEmail = String(email).toLowerCase().trim();
    const user = await CustomerAuth.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ sub: user._id.toString(), email: user.email }, JWT_SECRET, {
      expiresIn: "3h",
    });

    const res = NextResponse.json({ success: true, user: { email: user.email } });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: false, // Set to false for development to allow HTTP
      sameSite: "lax",
      path: "/",
      maxAge: COOKIE_MAX_AGE,
      // Don't set domain to allow any host
    });
    
    // Add rate limit headers
    res.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    return res;
  } catch (err) {
    console.error("Login error", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}


