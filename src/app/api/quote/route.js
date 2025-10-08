/** route: src/app/api/quote/route.js */

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { sendQuoteConfirmationEmail } from "@/lib/emailService";

// ✅ Generate exactly 6 alphanumeric characters for Access Token
function generateAccessToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ✅ Generate exactly 6 alphanumeric characters for Quote ID
function generateQuoteId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ✅ Generate unique Quote ID with collision checking
async function generateUniqueQuoteId(maxAttempts = 10) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const quoteId = generateQuoteId();
    const existingQuote = await Quote.findOne({ quoteId });
    if (!existingQuote) {
      return quoteId;
    }
  }
  throw new Error("Failed to generate unique quote ID after multiple attempts");
}

// ✅ Generate unique Access Token with collision checking
async function generateUniqueAccessToken(maxAttempts = 10) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const accessToken = generateAccessToken();
    const existingToken = await Quote.findOne({ accessToken });
    if (!existingToken) {
      return accessToken;
    }
  }
  throw new Error(
    "Failed to generate unique access token after multiple attempts"
  );
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

    // ✅ Validate required fields
    if (!vehicleDetails || !customer || !pricing) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // ✅ Validate customer information
    if (!customer.name || !customer.email || !customer.phone) {
      return NextResponse.json(
        { error: "Customer name, email, and phone are required" },
        { status: 400 }
      );
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // ✅ Validate vehicle details
    if (!vehicleDetails.year || !vehicleDetails.make || !vehicleDetails.model) {
      return NextResponse.json(
        { error: "Vehicle year, make, and model are required" },
        { status: 400 }
      );
    }

    // ✅ Validate pricing
    if (!pricing.currentPrice || pricing.currentPrice <= 0) {
      return NextResponse.json(
        { error: "Valid pricing information is required" },
        { status: 400 }
      );
    }

    // ✅ Generate unique identifiers
    let quoteId, accessToken;

    try {
      [quoteId, accessToken] = await Promise.all([
        generateUniqueQuoteId(),
        generateUniqueAccessToken(),
      ]);
    } catch (generationError) {
      console.error("ID generation error:", generationError);
      return NextResponse.json(
        { error: "Failed to generate unique identifiers. Please try again." },
        { status: 500 }
      );
    }

    // ✅ Create quote document
    const quote = new Quote({
      quoteId,
      vehicleDetails: {
        year: parseInt(vehicleDetails.year),
        make: vehicleDetails.make.trim(),
        model: vehicleDetails.model.trim(),
        trim: vehicleDetails.trim ? vehicleDetails.trim.trim() : "",
      },
      vin: vin ? vin.trim().toUpperCase() : "",
      customer: {
        name: customer.name.trim(),
        email: customer.email.toLowerCase().trim(),
        phone: customer.phone.trim(),
        address: customer.address ? customer.address.trim() : "",
        zipCode: zipCode || customer.zipCode || "",
      },
      locationData,
      pricing: {
        basePrice: Number(pricing.basePrice) || 0,
        currentPrice: Number(pricing.currentPrice) || 0,
        finalPrice:
          Number(pricing.finalPrice) || Number(pricing.currentPrice) || 0,
      },
      conditionAnswers: conditionAnswers || {},
      questionPricing: questionPricing || {},
      vehicleName:
        `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`.trim(),
      accessToken,
      status: "pending",
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      // ✅ Set customer action permissions
      customerActions: {
        canCancel: true,
        canReschedule: false, // Will be enabled when quote is accepted
        actionHistory: [
          {
            action: "created", // ✅ Changed from "modified" to "created"
            reason: "quote_submitted",
            note: "Quote submitted by customer",
            timestamp: new Date(),
            customerInitiated: true,
          },
        ],
        cancellationReason: null,
        cancellationNote: "",
        cancelledAt: null,
        originalPickupDate: null,
        originalPickupTime: null,
        rescheduledDate: null,
        rescheduledTime: null,
        rescheduleReason: null,
        rescheduleNote: "",
        rescheduledAt: null,
      },
      pickupDetails: {
        scheduledDate: null,
        scheduledTime: null,
        timeSlot: "flexible",
        address: customer.address || "",
        specialInstructions: "",
        contactPhone: customer.phone,
        confirmedAt: null,
        completedAt: null,
      },
      communications: [],
    });

    // ✅ Save quote to database
    await quote.save();

    // ✅ Send confirmation email
    try {
      await sendQuoteConfirmationEmail({
        to: customer.email,
        customerName: customer.name,
        quoteId,
        vehicleName: quote.vehicleName,
        vehicleDetails: quote.vehicleDetails,
        vin: quote.vin,
        pricing: {
          finalPrice: quote.pricing.finalPrice,
        },
        accessToken,
      });

      console.log(`📧 Quote confirmation email sent to ${customer.email}`);

      // Log communication
      await Quote.findByIdAndUpdate(quote._id, {
        $push: {
          communications: {
            type: "email",
            content: "Quote confirmation email sent",
            sentAt: new Date(),
            successful: true,
          },
        },
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);

      // Log failed communication
      await Quote.findByIdAndUpdate(quote._id, {
        $push: {
          communications: {
            type: "email",
            content: "Quote confirmation email failed",
            sentAt: new Date(),
            successful: false,
          },
        },
      });

      // Don't fail the entire request if email fails
    }

    // ✅ Send admin notification
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
          vehicleDetails: quote.vehicleDetails,
          pricing: quote.pricing.finalPrice,
          customerEmail: customer.email,
          customerPhone: customer.phone,
        },
      });

      console.log(`📨 Admin notification sent for quote ${quoteId}`);
    } catch (adminError) {
      console.error("Failed to send admin notification:", adminError);
      // Don't fail the entire request if admin notification fails
    }

    // ✅ Return success response
    return NextResponse.json({
      success: true,
      quoteId,
      accessToken,
      message: "Quote submitted successfully",
      quote: {
        quoteId,
        vehicleName: quote.vehicleName,
        pricing: quote.pricing,
        status: quote.status,
        expiresAt: quote.expiresAt,
        createdAt: quote.createdAt,
      },
    });
  } catch (error) {
    console.error("Error creating quote:", error);

    // ✅ Handle specific error types
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { error: "Quote validation failed: " + error.message },
        { status: 400 }
      );
    }

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate quote detected. Please try again." },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create quote. Please try again." },
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
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 10;

    // ✅ Validate required parameters
    if (!email && !quoteId) {
      return NextResponse.json(
        { error: "Email or Quote ID is required" },
        { status: 400 }
      );
    }

    // ✅ Build query
    let query = {};
    if (email) {
      query["customer.email"] = email.toLowerCase().trim();
    }
    if (quoteId) {
      query.quoteId = quoteId.toUpperCase().trim();
    }
    if (status) {
      query.status = status;
    }

    // ✅ Find quotes with proper selection and sorting
    const quotes = await Quote.find(query)
      .select(
        "quoteId vehicleName vehicleDetails pricing status createdAt expiresAt accessToken customer.name customer.email"
      )
      .sort({ createdAt: -1 })
      .limit(Math.min(limit, 50)); // Cap at 50 quotes

    // ✅ Return formatted response
    return NextResponse.json({
      success: true,
      count: quotes.length,
      quotes: quotes.map((quote) => ({
        quoteId: quote.quoteId,
        vehicleName: quote.vehicleName,
        vehicleDetails: quote.vehicleDetails,
        pricing: quote.pricing,
        status: quote.status,
        createdAt: quote.createdAt,
        expiresAt: quote.expiresAt,
        accessToken: quote.accessToken,
        customerName: quote.customer.name,
        customerEmail: quote.customer.email,
        expired: new Date() > new Date(quote.expiresAt),
      })),
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes. Please try again." },
      { status: 500 }
    );
  }
}

        contactPhone: customer.phone,

        confirmedAt: null,

        completedAt: null,

      },

      communications: [],

    });



    // ✅ Save quote to database

    await quote.save();



    // ✅ Send confirmation email

    try {

      await sendQuoteConfirmationEmail({

        to: customer.email,

        customerName: customer.name,

        quoteId,

        vehicleName: quote.vehicleName,

        vehicleDetails: quote.vehicleDetails,

        vin: quote.vin,

        pricing: {

          finalPrice: quote.pricing.finalPrice,

        },

        accessToken,

      });



      console.log(`📧 Quote confirmation email sent to ${customer.email}`);



      // Log communication

      await Quote.findByIdAndUpdate(quote._id, {

        $push: {

          communications: {

            type: "email",

            content: "Quote confirmation email sent",

            sentAt: new Date(),

            successful: true,

          },

        },

      });

    } catch (emailError) {

      console.error("Failed to send confirmation email:", emailError);



      // Log failed communication

      await Quote.findByIdAndUpdate(quote._id, {

        $push: {

          communications: {

            type: "email",

            content: "Quote confirmation email failed",

            sentAt: new Date(),

            successful: false,

          },

        },

      });



      // Don't fail the entire request if email fails

    }



    // ✅ Send admin notification

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

          vehicleDetails: quote.vehicleDetails,

          pricing: quote.pricing.finalPrice,

          customerEmail: customer.email,

          customerPhone: customer.phone,

        },

      });



      console.log(`📨 Admin notification sent for quote ${quoteId}`);

    } catch (adminError) {

      console.error("Failed to send admin notification:", adminError);

      // Don't fail the entire request if admin notification fails

    }



    // ✅ Return success response

    return NextResponse.json({

      success: true,

      quoteId,

      accessToken,

      message: "Quote submitted successfully",

      quote: {

        quoteId,

        vehicleName: quote.vehicleName,

        pricing: quote.pricing,

        status: quote.status,

        expiresAt: quote.expiresAt,

        createdAt: quote.createdAt,

      },

    });

  } catch (error) {

    console.error("Error creating quote:", error);



    // ✅ Handle specific error types

    if (error.name === "ValidationError") {

      return NextResponse.json(

        { error: "Quote validation failed: " + error.message },

        { status: 400 }

      );

    }



    if (error.code === 11000) {

      return NextResponse.json(

        { error: "Duplicate quote detected. Please try again." },

        { status: 409 }

      );

    }



    return NextResponse.json(

      { error: "Failed to create quote. Please try again." },

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

    const status = searchParams.get("status");

    const limit = parseInt(searchParams.get("limit")) || 10;



    // ✅ Validate required parameters

    if (!email && !quoteId) {

      return NextResponse.json(

        { error: "Email or Quote ID is required" },

        { status: 400 }

      );

    }



    // ✅ Build query

    let query = {};

    if (email) {

      query["customer.email"] = email.toLowerCase().trim();

    }

    if (quoteId) {

      query.quoteId = quoteId.toUpperCase().trim();

    }

    if (status) {

      query.status = status;

    }



    // ✅ Find quotes with proper selection and sorting

    const quotes = await Quote.find(query)

      .select(

        "quoteId vehicleName vehicleDetails pricing status createdAt expiresAt accessToken customer.name customer.email"

      )

      .sort({ createdAt: -1 })

      .limit(Math.min(limit, 50)); // Cap at 50 quotes



    // ✅ Return formatted response

    return NextResponse.json({

      success: true,

      count: quotes.length,

      quotes: quotes.map((quote) => ({

        quoteId: quote.quoteId,

        vehicleName: quote.vehicleName,

        vehicleDetails: quote.vehicleDetails,

        pricing: quote.pricing,

        status: quote.status,

        createdAt: quote.createdAt,

        expiresAt: quote.expiresAt,

        accessToken: quote.accessToken,

        customerName: quote.customer.name,

        customerEmail: quote.customer.email,

        expired: new Date() > new Date(quote.expiresAt),

      })),

    });

  } catch (error) {

    console.error("Error fetching quotes:", error);

    return NextResponse.json(

      { error: "Failed to fetch quotes. Please try again." },

      { status: 500 }

    );

  }

}


