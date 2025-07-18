/** route: src/app/api/quote/manage/reschedule/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { validateAccessToken } from "@/lib/quoteAccess";
import { handleReschedulePickup } from "@/lib/customerActions";
import { sendAdminNotification } from "@/lib/notificationService";

export async function POST(request) {
  try {
    const body = await request.json();
    const { accessToken, newDate, newTime, reason, note } = body;

    // Validate required fields
    if (!accessToken || !newDate || !newTime || !reason) {
      return NextResponse.json(
        { error: "Access token, new date, time, and reason are required" },
        { status: 400 }
      );
    }

    // Validate date format
    const scheduledDate = new Date(newDate);
    if (isNaN(scheduledDate.getTime()) || scheduledDate <= new Date()) {
      return NextResponse.json(
        { error: "Invalid or past date provided" },
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

    // Check if rescheduling is allowed
    if (!quote.canCustomerReschedule()) {
      return NextResponse.json(
        { error: "Quote cannot be rescheduled in current status" },
        { status: 400 }
      );
    }

    // Handle rescheduling
    const result = await handleReschedulePickup(quote._id, {
      newDate: scheduledDate,
      newTime,
      reason,
      note: note || "",
      customerInitiated: true,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Send admin notification
    await sendAdminNotification({
      type: "pickup_rescheduled",
      quoteId: quote.quoteId,
      vehicleName: quote.vehicleName,
      customerName: quote.customer.name,
      originalDate: quote.pickupDetails.scheduledDate,
      newDate: scheduledDate,
      newTime,
      reason,
      note,
    });

    return NextResponse.json({
      success: true,
      message: "Pickup rescheduled successfully",
      quote: result.quote,
    });
  } catch (error) {
    console.error("Error rescheduling pickup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
