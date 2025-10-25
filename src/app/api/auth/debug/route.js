/** route: src/app/api/auth/debug/route.js */
import { NextResponse } from "next/server";

const SESSION_COOKIE = "cj_session";

export async function GET(request) {
  try {
    const cookies = request.cookies.getAll();
    const sessionCookie = request.cookies.get(SESSION_COOKIE);
    
    console.log("=== COOKIE DEBUG ===");
    console.log("All cookies:", cookies.map(c => ({ name: c.name, hasValue: !!c.value })));
    console.log("Session cookie exists:", !!sessionCookie);
    console.log("Session cookie value length:", sessionCookie?.value?.length || 0);
    console.log("===================");
    
    return NextResponse.json({
      allCookies: cookies.map(c => ({ name: c.name, hasValue: !!c.value })),
      sessionCookieExists: !!sessionCookie,
      sessionCookieLength: sessionCookie?.value?.length || 0,
    });
  } catch (error) {
    console.error("Cookie debug error:", error);
    return NextResponse.json({ error: "Debug failed" }, { status: 500 });
  }
}
