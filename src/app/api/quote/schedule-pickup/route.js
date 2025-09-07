/** route: src/app/api/quote/schedule-pickup/route.js */

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { sendPickupNotificationEmail } from "@/lib/emailService";
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const {
      accessToken,
      scheduledDate,
      scheduledTime,
      timeSlot,
      specialInstructions,
      contactPhone,
      pickupAddress,
    } = body;
    // Validate required fields
    if (
      !accessToken ||
      !scheduledDate ||
      !scheduledTime ||
      !contactPhone ||
      !pickupAddress
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Find the quote by access token
    const quote = await Quote.findOne({ accessToken });
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Check if quote is in valid state for scheduling
    const validStatuses = ["pending", "accepted"];
    // if (!validStatuses.includes(quote.status)) {
    //   return NextResponse.json(
    //     { error: "Quote cannot be scheduled in current status" },
    //     { status: 400 }
    //   );
    // }
  
    const selectedDate = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      return NextResponse.json(
        { error: "Pickup date cannot be in the past" },
        { status: 400 }
      );
    }
    // Validate date is within 30 days
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (selectedDate > maxDate) {
      return NextResponse.json(
        { error: "Pickup date cannot be more than 30 days in the future" },
        { status: 400 }
      );
    }
    // Update quote with pickup details
    quote.pickupDetails = {
      scheduledDate: new Date(scheduledDate),
      scheduledTime,
      timeSlot: timeSlot || "flexible",
      address: pickupAddress,
      specialInstructions: specialInstructions || "",
      contactPhone,
      confirmedAt: new Date(),
      completedAt: null,
    };
    // Update quote status
    quote.status = "pickup_scheduled";
    // Add action to history
    quote.customerActions.actionHistory.push({
      action: "pickup_scheduled",
      reason: "customer_scheduled_pickup",
      note: `Pickup scheduled for ${scheduledDate} at ${scheduledTime}`,
      timestamp: new Date(),
      customerInitiated: true,
      details: {
        scheduledDate,
        scheduledTime,
        timeSlot,
        specialInstructions,
      },
    });
    // Save the updated quote
    await quote.save();
    // Send admin notification email
    try {
      await sendPickupNotificationEmail({
        quote,
        scheduledDate,
        scheduledTime,
        timeSlot,
        specialInstructions,
        contactPhone,
        pickupAddress,
        adminEmail: "service@regaltowing.net",
      });
      console.log(
        `📧 Pickup notification sent to admin for quote ${quote.quoteId}`
      );
    } catch (emailError) {
      console.error("Failed to send pickup notification email:", emailError);
    }
    return NextResponse.json({
      success: true,
      message: "Pickup scheduled successfully",
      pickupDetails: {
        scheduledDate,
        scheduledTime,
        timeSlot,
        address: pickupAddress,
        contactPhone,
      },
    });
  } catch (error) {
    console.error("Pickup scheduling error:", error);
    return NextResponse.json(
      { error: "Failed to schedule pickup. Please try again." },
      { status: 500 }
    );
  }
}
