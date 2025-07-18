/** route: src/app/api/quote/route.js */

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { sendQuoteConfirmationEmail } from "@/lib/emailService";
import { randomBytes } from "crypto";

function generateAccessToken() {
  return randomBytes(8).toString("hex"); // Generates exactly 16 hex characters
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const body = await request.json();
    const {
      vehicleDetails,
      vin,
      pricing,
      questionPricing,
      conditionAnswers,
      customer,
      zipCode,
      locationData,
    } = body;

    // Validate required fields
    if (!vehicleDetails || !customer || !pricing) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate customer information
    if (!customer.name || !customer.email || !customer.phone) {
      return NextResponse.json(
        { error: "Customer name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Generate unique quote ID
    const quoteId = `Q-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 4)
      .toUpperCase()}`;

    // Generate access token for quote management
    const accessToken = generateAccessToken();

    // Create quote document
    const quote = new Quote({
      quoteId,
      vehicleDetails,
      vin: vin || "",
      customer,
      locationData,
      pricing: {
        basePrice: pricing.basePrice || 0,
        currentPrice: pricing.currentPrice || 0,
        finalPrice: pricing.finalPrice || pricing.currentPrice || 0,
      },
      conditionAnswers: conditionAnswers || {},
      questionPricing: questionPricing || {},
      vehicleName: `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`,
      accessToken,
      // Set customer action permissions
      customerActions: {
        canCancel: true,
        canReschedule: false, // Will be enabled when quote is accepted
        actionHistory: [
          {
            action: "modified",
            reason: "quote_submitted",
            note: "Quote submitted by customer",
            timestamp: new Date(),
            customerInitiated: true,
          },
        ],
      },
    });

    // Save quote to database
    await quote.save();

    // Send confirmation email
    try {
      await sendQuoteConfirmationEmail({
        to: customer.email,
        customerName: customer.name,
        quoteId,
        vehicleName: quote.vehicleName,
        vehicleDetails,
        vin,
        pricing: {
          finalPrice: pricing.finalPrice || pricing.currentPrice || 0,
        },
        accessToken,
      });

      console.log(`📧 Quote confirmation email sent to ${customer.email}`);
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the entire request if email fails
    }

    // Send admin notification
    try {
      const { sendAdminNotification } = await import(
        "@/lib/notificationService"
      );
      await sendAdminNotification({
        type: "new_quote",
        quoteId,
        vehicleName: quote.vehicleName,
        customerName: customer.name,
        actionType: "quote_submitted",
        details: {
          vehicleDetails,
          pricing: pricing.finalPrice || pricing.currentPrice || 0,
        },
      });
    } catch (adminError) {
      console.error("Failed to send admin notification:", adminError);
      // Don't fail the entire request if admin notification fails
    }

    return NextResponse.json({
      success: true,
      quoteId,
      accessToken,
      message: "Quote submitted successfully",
    });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to create quote" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const quoteId = searchParams.get("quoteId");

    if (!email && !quoteId) {
      return NextResponse.json(
        { error: "Email or Quote ID is required" },
        { status: 400 }
      );
    }

    let query = {};
    if (email) query["customer.email"] = email;
    if (quoteId) query.quoteId = quoteId;

    const quotes = await Quote.find(query).sort({ createdAt: -1 }).limit(10);

    return NextResponse.json({
      success: true,
      quotes: quotes.map((quote) => ({
        quoteId: quote.quoteId,
        vehicleName: quote.vehicleName,
        vehicleDetails: quote.vehicleDetails,
        pricing: quote.pricing,
        status: quote.status,
        createdAt: quote.createdAt,
        expiresAt: quote.expiresAt,
        accessToken: quote.accessToken,
      })),
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
