/** route: src/app/api/quote/schedule-pickup/route.js */

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { 
  sendPickupNotificationEmail,
  sendPickupScheduledConfirmation 
} from "@/lib/emailService";
export async function POST(request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const {
      accessToken,
      scheduledDate,
      pickupWindow, // Changed from scheduledTime/timeSlot to pickupWindow
      specialInstructions,
      contactPhone,
      pickupAddress,
    } = body;
    // Validate required fields
    if (
      !accessToken ||
      !scheduledDate ||
      !pickupWindow ||
      !contactPhone ||
      !pickupAddress
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Validate pickup window value
    const validWindows = ["morning", "afternoon", "evening"];
    if (!validWindows.includes(pickupWindow)) {
      return NextResponse.json(
        { error: "Invalid pickup window. Must be morning, afternoon, or evening" },
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
    // Validate scheduled date is not in the past
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
    // Check if there's already a scheduled pickup
    const hasExistingSchedule = quote.pickupDetails && quote.pickupDetails.scheduledDate;
    const isUpdatingSchedule = hasExistingSchedule && quote.status === "pickup_scheduled";
    
    // Store original schedule details if updating
    let originalScheduleDetails = null;
    if (isUpdatingSchedule) {
      originalScheduleDetails = {
        originalDate: quote.pickupDetails.scheduledDate,
        originalWindow: quote.pickupDetails.pickupWindow || quote.pickupDetails.timeSlot,
      };
    }
    
    // Map pickup window to time ranges for display
    const windowTimeRanges = {
      morning: "8:00 AM - 12:00 PM",
      afternoon: "12:00 PM - 4:00 PM",
      evening: "4:00 PM - 9:00 PM"
    };

    // Update quote with pickup details
    quote.pickupDetails = {
      scheduledDate: new Date(scheduledDate),
      pickupWindow: pickupWindow, // Store the window value
      pickupTimeRange: windowTimeRanges[pickupWindow], // Store readable time range
      address: pickupAddress,
      specialInstructions: specialInstructions || "",
      contactPhone,
      confirmedAt: new Date(),
      completedAt: null,
    };
    
    // Update quote status
    quote.status = "pickup_scheduled";
    
    // Add appropriate action to history
    if (isUpdatingSchedule) {
      // Update existing schedule - add reschedule entry
      quote.customerActions.actionHistory.push({
        action: "rescheduled",
        reason: "customer_rescheduled_pickup",
        note: `Pickup rescheduled from ${originalScheduleDetails.originalDate.toISOString().split('T')[0]} (${originalScheduleDetails.originalWindow}) to ${scheduledDate} (${pickupWindow})`,
        timestamp: new Date(),
        customerInitiated: true,
        details: {
          originalDate: originalScheduleDetails.originalDate,
          originalWindow: originalScheduleDetails.originalWindow,
          newDate: scheduledDate,
          newWindow: pickupWindow,
          newTimeRange: windowTimeRanges[pickupWindow],
          specialInstructions,
        },
      });
    } else {
      // First time scheduling - add initial schedule entry
      quote.customerActions.actionHistory.push({
        action: "pickup_scheduled",
        reason: "customer_scheduled_pickup",
        note: `Pickup scheduled for ${scheduledDate} (${pickupWindow}: ${windowTimeRanges[pickupWindow]})`,
        timestamp: new Date(),
        customerInitiated: true,
        details: {
          scheduledDate,
          pickupWindow,
          pickupTimeRange: windowTimeRanges[pickupWindow],
          specialInstructions,
        },
      });
    }
    // Save the updated quote
    await quote.save();
    
    // Send confirmation email to seller
    try {
      await sendPickupScheduledConfirmation({
        to: quote.customer.email,
        customerName: quote.customer.name,
        quoteId: quote.quoteId,
        vehicleName: quote.vehicleName,
        offerAmount: quote.pricing.finalPrice,
        scheduledDate,
        pickupWindow,
        pickupTimeRange: windowTimeRanges[pickupWindow],
        pickupAddress,
        contactPhone,
        specialInstructions: specialInstructions || "",
        accessToken: quote.accessToken,
      });
      console.log(
        `📧 Pickup confirmation email sent to seller ${quote.customer.email} for quote ${quote.quoteId}`
      );
    } catch (emailError) {
      console.error("Failed to send pickup confirmation email to seller:", emailError);
      // Don't fail the request if email fails, but log it
    }
    
    // Send admin notification email
    try {
      await sendPickupNotificationEmail({
        quote,
        scheduledDate,
        pickupWindow,
        pickupTimeRange: windowTimeRanges[pickupWindow],
        specialInstructions,
        contactPhone,
        pickupAddress,
        adminEmail: process.env.ADMIN_EMAIL,
        isReschedule: isUpdatingSchedule,
        originalSchedule: originalScheduleDetails
      });
      console.log(
        `📧 ${isUpdatingSchedule ? 'Reschedule' : 'Pickup'} notification sent to admin for quote ${quote.quoteId}`
      );
    } catch (emailError) {
      console.error("Failed to send pickup notification email:", emailError);
      // Don't fail the request if email fails, but log it
    }
    // Fetch the updated quote to return complete data
    const updatedQuote = await Quote.findOne({ accessToken });
    
    return NextResponse.json({
      success: true,
      message: isUpdatingSchedule ? "Pickup rescheduled successfully" : "Pickup scheduled successfully",
      quote: updatedQuote, // Return the complete updated quote
      pickupDetails: {
        scheduledDate,
        pickupWindow,
        pickupTimeRange: windowTimeRanges[pickupWindow],
        address: pickupAddress,
        contactPhone,
      },
      isReschedule: isUpdatingSchedule,
    });
  } catch (error) {
    console.error("Pickup scheduling error:", error);
    return NextResponse.json(
      { error: "Failed to schedule pickup. Please try again." },
      { status: 500 }
    );
  }
}
