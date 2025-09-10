/** route: src/app/api/admin/pickups/complete/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function POST(request) {
  try {
    await connectToDatabase();
    const { quoteId, completionNotes, actualPickupTime } = await request.json();

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

    // Check if quote is in pickup_scheduled status
    if (quote.status !== "pickup_scheduled") {
      return NextResponse.json(
        { error: "Quote is not in pickup_scheduled status" },
        { status: 400 }
      );
    }

    // Update quote status to completed
    quote.status = "completed";
    
    // Add completion details to pickup details
    if (!quote.pickupDetails) {
      quote.pickupDetails = {};
    }
    
    quote.pickupDetails.completedAt = new Date();
    quote.pickupDetails.completionNotes = completionNotes || "";
    quote.pickupDetails.actualPickupTime = actualPickupTime || new Date();

    // Add completion action to history
    quote.customerActions.actionHistory.push({
      action: "completed",
      reason: "pickup_completed",
      note: `Pickup completed successfully${completionNotes ? ` - ${completionNotes}` : ""}`,
      timestamp: new Date(),
      customerInitiated: false,
      details: {
        completedAt: new Date(),
        completionNotes,
        actualPickupTime: actualPickupTime || new Date(),
        scheduledDate: quote.pickupDetails.scheduledDate,
        scheduledTime: quote.pickupDetails.scheduledTime,
      },
    });

    await quote.save();

    return NextResponse.json({
      success: true,
      message: "Pickup marked as completed successfully",
      quote: {
        _id: quote._id,
        quoteId: quote.quoteId,
        status: quote.status,
        pickupDetails: quote.pickupDetails,
      },
    });
  } catch (error) {
    console.error("Error completing pickup:", error);
    return NextResponse.json(
      { error: "Failed to complete pickup" },
      { status: 500 }
    );
  }
}
