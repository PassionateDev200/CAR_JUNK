/** route: src/app/api/quote/manage/cancel/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { validateAccessToken } from "@/lib/quoteAccess";
import { handleCancelQuote } from "@/lib/customerActions";
import { sendAdminNotification } from "@/lib/notificationService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken, reason, note } = body;

    // Validate required fields
    if (!accessToken || !reason) {
      return NextResponse.json(
        { error: "Access token and cancellation reason are required" },
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

    // Check if cancellation is allowed
    if (!quote.canCustomerCancel()) {
      return NextResponse.json(
        { error: "Quote cannot be cancelled in current status" },
        { status: 400 }
      );
    }

    // Handle cancellation
    const result = await handleCancelQuote(quote._id, {
      reason,
      note: note || "",
      customerInitiated: true,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Send admin notification
    await sendAdminNotification({
      type: "quote_cancelled",
      quoteId: quote.quoteId,
      vehicleName: quote.vehicleName,
      customerName: quote.customer.name,
      reason,
      note,
    });

    return NextResponse.json({
      success: true,
      message: "Quote cancelled successfully",
      quote: result.quote,
    });
  } catch (error) {
    console.error("Error cancelling quote:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
