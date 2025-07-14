/** route: src/app/api/quote/route.js */

import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Quote from "@/models/Quote";
import Customer from "@/models/Customer";
import { sendQuoteEmail } from "@/lib/emailService";

export async function POST(request) {
  try {
    await connectToDatabase();

    const quoteData = await request.json();
    console.log("📝 Received quote data:", quoteData);

    // Validate required fields
    if (
      !quoteData.vehicleDetails ||
      !quoteData.sellerInfo ||
      !quoteData.pricing
    ) {
      return NextResponse.json(
        { error: "Missing required quote data" },
        { status: 400 }
      );
    }

    // Extract zipCode from conditionAnswers if main zipCode is empty
    const extractedZipCode =
      quoteData.zipCode || quoteData.conditionAnswers?.zipcode?.zipCode || "";
    const extractedLocationData =
      quoteData.locationData ||
      quoteData.conditionAnswers?.zipcode?.locationData ||
      null;

    // Map sellerInfo to customer for database storage
    const customerData = {
      name: quoteData.sellerInfo.name,
      email: quoteData.sellerInfo.email,
      phone: quoteData.sellerInfo.phone,
      address: quoteData.sellerInfo.address || "",
      zipCode: extractedZipCode,
    };

    // Process mileage data properly
    const processedConditionAnswers = {
      ...quoteData.conditionAnswers,
      // Handle mileage object vs string
      mileage:
        typeof quoteData.conditionAnswers.mileage === "object"
          ? quoteData.conditionAnswers.mileage
          : quoteData.conditionAnswers.mileage,
    };

    // Create new quote in database
    const newQuote = new Quote({
      vehicleDetails: quoteData.vehicleDetails,
      vin: quoteData.vin || "",
      customer: customerData,
      locationData: extractedLocationData,
      pricing: {
        basePrice: quoteData.pricing.basePrice,
        currentPrice: quoteData.pricing.currentPrice,
        finalPrice:
          quoteData.pricing.finalPrice || quoteData.pricing.currentPrice,
      },
      conditionAnswers: processedConditionAnswers,
      status: "pending",
    });

    // Save quote to database
    const savedQuote = await newQuote.save();
    console.log("💾 Quote saved to database:", savedQuote.quoteId);

    // Create or update customer
    let customer = await Customer.findOne({ email: customerData.email });

    if (customer) {
      customer.totalQuotes += 1;
      customer.lastActivity = new Date();
      await customer.save();
      console.log("👤 Updated existing customer");
    } else {
      const newCustomer = new Customer({
        ...customerData,
        zipCode: extractedZipCode,
      });
      customer = await newCustomer.save();
      console.log("🆕 Created new customer");
    }

    // Send email notification
    try {
      await sendQuoteEmail({
        to: customerData.email, // ✅ Email recipient
        customerName: customerData.name, // ✅ FIXED: Changed from sellerInfo to customerName
        quoteId: savedQuote.quoteId,
        vehicleName: savedQuote.vehicleName,
        vehicleDetails: savedQuote.vehicleDetails,
        vin: savedQuote.vin,
        pricing: {
          basePrice: savedQuote.pricing.basePrice,
          currentPrice: savedQuote.pricing.currentPrice,
          finalPrice: savedQuote.pricing.finalPrice,
        },
        quoteUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/offer/${savedQuote.quoteId}`,
      });

      savedQuote.communications.push({
        type: "email",
        content: "Quote confirmation email sent",
        sentAt: new Date(),
        successful: true,
      });
      await savedQuote.save();
      console.log("📧 Quote email sent successfully");
    } catch (emailError) {
      console.error("📧 Email sending failed:", emailError);
      savedQuote.communications.push({
        type: "email",
        content: "Quote confirmation email failed",
        sentAt: new Date(),
        successful: false,
      });
      await savedQuote.save();
    }

    return NextResponse.json({
      success: true,
      quote: {
        id: savedQuote.quoteId,
        vehicleName: savedQuote.vehicleName,
        offerAmount: savedQuote.pricing.finalPrice,
        status: savedQuote.status,
        expiresAt: savedQuote.expiresAt,
      },
      message: "Quote saved successfully",
    });
  } catch (error) {
    console.error("❌ Quote creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create quote",
      },
      { status: 500 }
    );
  }
}

// GET endpoint for retrieving quotes
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get("id");
    const email = searchParams.get("email");

    if (quoteId) {
      const quote = await Quote.findOne({ quoteId });
      if (!quote) {
        return NextResponse.json({ error: "Quote not found" }, { status: 404 });
      }
      return NextResponse.json({ success: true, quote });
    }

    if (email) {
      const quotes = await Quote.find({ "customer.email": email })
        .sort({ createdAt: -1 })
        .limit(10);
      return NextResponse.json({ success: true, quotes });
    }

    return NextResponse.json(
      { error: "Missing required parameters" },
      { status: 400 }
    );
  } catch (error) {
    console.error("❌ Quote retrieval error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve quote" },
      { status: 500 }
    );
  }
}
