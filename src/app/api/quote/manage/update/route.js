/** route: src/app/api/quote/manage/update/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { validateAccessToken } from "@/lib/quoteAccess";
import { handleUpdateContactInfo } from "@/lib/customerActions";

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken, updates } = body;

    // Validate required fields
    if (!accessToken || !updates) {
      return NextResponse.json(
        { error: "Access token and updates are required" },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (
      updates.email &&
      !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(updates.email)
    ) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format if provided
    if (updates.phone && !/^\+?[\d\s\-\(\)]+$/.test(updates.phone)) {
      return NextResponse.json(
        { error: "Invalid phone format" },
        { status: 400 }
      );
    }

    // Validate access token format
    if (!validateAccessToken(accessToken)) {
      return NextResponse.json(
        { error: "Invalid access token format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find and validate quote
    const quote = await Quote.findOne({ accessToken });

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Check if quote allows updates
    if (!["pending", "accepted", "pickup_scheduled"].includes(quote.status)) {
      return NextResponse.json(
        { error: "Quote cannot be updated in current status" },
        { status: 400 }
      );
    }

    // Handle contact info update
    const result = await handleUpdateContactInfo(quote._id, updates);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Contact information updated successfully",
      quote: result.quote,
    });
  } catch (error) {
    console.error("Error updating contact info:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
