/** route: src/app/api/admin/quotes/approve/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { quoteId } = await request.json();

    if (!quoteId) {
      return NextResponse.json(
        { error: "Quote ID is required" },
        { status: 400 }
      );
    }

    // Find the quote
    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found" },
        { status: 404 }
      );
    }

    // Check if quote can be approved
    if (quote.status !== "pending") {
      return NextResponse.json(
        { error: "Quote cannot be approved in current status" },
        { status: 400 }
      );
    }

    // Update quote status to accepted
    quote.status = "accepted";
    
    // Add action to history
    quote.customerActions.actionHistory.push({
      action: "accepted",
      reason: "admin_approved_quote",
      note: "Quote approved by admin",
      timestamp: new Date(),
      customerInitiated: false,
    });

    // Save the updated quote
    await quote.save();

    return NextResponse.json({
      success: true,
      message: "Quote approved successfully",
      quote: quote,
    });
  } catch (error) {
    console.error("Quote approval error:", error);
    return NextResponse.json(
      { error: "Failed to approve quote. Please try again." },
      { status: 500 }
    );
  }
}
