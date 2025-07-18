/** Route: src/app/api/quote/lookup/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const { email, quoteId } = body;

    // Validate required fields
    if (!email || !quoteId) {
      return NextResponse.json(
        { error: "Email and Quote ID are required" },
        { status: 400 }
      );
    }

    // Normalize inputs
    const normalizedEmail = email.toLowerCase().trim();
    const normalizedQuoteId = quoteId.trim();

    // Find quote by email and quoteId
    const quote = await Quote.findOne({
      quoteId: normalizedQuoteId,
      "customer.email": normalizedEmail,
      status: { $nin: ["expired", "completed"] }, // Exclude expired/completed quotes
    }).select("accessToken quoteId vehicleName status expiresAt");

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found. Please check your email and quote ID." },
        { status: 404 }
      );
    }

    // Check if quote is expired
    if (quote.expiresAt && new Date() > quote.expiresAt) {
      // Update quote status to expired
      await Quote.findByIdAndUpdate(quote._id, { status: "expired" });

      return NextResponse.json(
        { error: "This quote has expired. Please get a new quote." },
        { status: 410 }
      );
    }

    // Return access token
    return NextResponse.json({
      success: true,
      accessToken: quote.accessToken,
      quoteId: quote.quoteId,
      vehicleName: quote.vehicleName,
      status: quote.status,
    });
  } catch (error) {
    console.error("Error in quote lookup:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again later." },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for testing
export async function GET(request) {
  return NextResponse.json(
    {
      error: "Method not allowed. Use POST to lookup quotes.",
      allowedMethods: ["POST"],
    },
    { status: 405 }
  );
}
