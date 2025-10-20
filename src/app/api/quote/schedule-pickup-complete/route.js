/** route: src/app/api/quote/schedule-pickup-complete/route.js */

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
      titleSpecifics,
      pickupAddress,
      addressType,
      specialInstructions,
      contactName,
      contactPhone,
      structuredAddress,
      scheduledDate,
      pickupWindow,
      paymentDetails,
    } = body;

    // Validate required fields
    if (
      !accessToken ||
      !titleSpecifics ||
      !scheduledDate ||
      !pickupWindow ||
      !contactName ||
      !contactPhone ||
      !pickupAddress ||
      !paymentDetails
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

    // Map pickup window to time ranges for display
    const windowTimeRanges = {
      morning: "8:00 AM - 12:00 PM",
      afternoon: "12:00 PM - 4:00 PM",
      evening: "4:00 PM - 9:00 PM"
    };

    // Update quote with title specifics
    quote.titleSpecifics = {
      nameOnTitle: titleSpecifics.nameOnTitle || "",
      titleVin: titleSpecifics.titleVin || quote.vin || "",
      titleIssueState: titleSpecifics.titleIssueState || "",
      vehicleColor: titleSpecifics.vehicleColor || "",
    };

    // Update quote with pickup details
    quote.pickupDetails = {
      scheduledDate: new Date(scheduledDate),
      pickupWindow: pickupWindow,
      pickupTimeRange: windowTimeRanges[pickupWindow],
      address: pickupAddress,
      addressType: addressType || "residence",
      structuredAddress: structuredAddress || {},
      specialInstructions: specialInstructions || "",
      contactName,
      contactPhone,
      confirmedAt: new Date(),
      completedAt: null,
    };

    // Update quote with payment details
    quote.paymentDetails = {
      payeeName: paymentDetails.payeeName || "",
      paymentMethod: "not_specified",
    };
    
    // Update quote status
    quote.status = "pickup_scheduled";
    
    // Add action to history
    quote.customerActions.actionHistory.push({
      action: "pickup_scheduled",
      reason: "customer_scheduled_pickup",
      note: `Complete pickup scheduled for ${scheduledDate} (${pickupWindow}: ${windowTimeRanges[pickupWindow]}) at ${addressType}. Payee: ${paymentDetails.payeeName}`,
      timestamp: new Date(),
      customerInitiated: true,
      details: {
        scheduledDate,
        pickupWindow,
        pickupTimeRange: windowTimeRanges[pickupWindow],
        contactName,
        addressType,
        pickupAddress,
        specialInstructions,
        titleSpecifics,
        paymentDetails,
      },
    });

    // Save the updated quote
    await quote.save();
    
    // Send confirmation email to seller
    try {
      await sendPickupScheduledConfirmation({
        to: quote.customer.email,
        customerName: contactName || quote.customer.name,
        quoteId: quote.quoteId,
        vehicleName: quote.vehicleName,
        offerAmount: quote.pricing.finalPrice,
        scheduledDate,
        pickupWindow,
        pickupTimeRange: windowTimeRanges[pickupWindow],
        pickupAddress,
        addressType,
        contactName,
        contactPhone,
        specialInstructions: specialInstructions || "",
        accessToken: quote.accessToken,
      });
      console.log(
        `📧 Pickup confirmation email sent to seller ${quote.customer.email} for quote ${quote.quoteId}`
      );
    } catch (emailError) {
      console.error("Failed to send pickup confirmation email to seller:", emailError);
    }
    
    // Send admin notification email
    try {
      await sendPickupNotificationEmail({
        quote,
        scheduledDate,
        pickupWindow,
        pickupTimeRange: windowTimeRanges[pickupWindow],
        specialInstructions,
        contactName,
        contactPhone,
        pickupAddress,
        addressType,
        adminEmail: process.env.ADMIN_EMAIL,
        isReschedule: false,
        titleSpecifics,
        paymentDetails,
      });
      console.log(
        `📧 Pickup notification sent to admin for quote ${quote.quoteId}`
      );
    } catch (emailError) {
      console.error("Failed to send pickup notification email:", emailError);
    }

    // Fetch the updated quote to return complete data
    const updatedQuote = await Quote.findOne({ accessToken });
    
    return NextResponse.json({
      success: true,
      message: "Pickup scheduled successfully with complete details",
      quote: updatedQuote,
      pickupDetails: {
        scheduledDate,
        pickupWindow,
        pickupTimeRange: windowTimeRanges[pickupWindow],
        address: pickupAddress,
        addressType,
        contactName,
        contactPhone,
        specialInstructions,
      },
      titleSpecifics,
      paymentDetails,
    });
  } catch (error) {
    console.error("Complete pickup scheduling error:", error);
    return NextResponse.json(
      { error: "Failed to schedule pickup. Please try again." },
      { status: 500 }
    );
  }
}

