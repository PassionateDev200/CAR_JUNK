/** route: src/app/api/quote/manage/[accessToken]/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { validateAccessToken } from "@/lib/quoteAccess";

export async function GET(request, { params }) {
  try {
    const { accessToken } = await params;
    console.log("accessToken ====> ", accessToken);
    // Validate access token format
    if (!validateAccessToken(accessToken)) {
      return NextResponse.json(
        { error: "Invalid access token format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find quote by access token
    const quote = await Quote.findOne({
      accessToken,
      status: { $nin: ["expired", "completed"] },
    });

    if (!quote) {
      return NextResponse.json(
        { error: "Quote not found or expired" },
        { status: 404 }
      );
    }

    // Check if quote is expired
    if (quote.expiresAt && new Date() > quote.expiresAt) {
      await Quote.findByIdAndUpdate(quote._id, { status: "expired" });
      return NextResponse.json({ error: "Quote has expired" }, { status: 410 });
    }

    // Return quote data with customer actions
    return NextResponse.json({
      quote: {
        quoteId: quote.quoteId,
        vehicleDetails: quote.vehicleDetails,
        vehicleName: quote.vehicleName,
        vin: quote.vin,
        pricing: quote.pricing,
        status: quote.status,
        customer: quote.customer,
        pickupDetails: quote.pickupDetails,
        customerActions: quote.customerActions,
        createdAt: quote.createdAt,
        expiresAt: quote.expiresAt,
        canCancel: quote.canCustomerCancel(),
        canReschedule: quote.canCustomerReschedule(),
        accessToken: accessToken,
      },
    });
  } catch (error) {
    console.error("Error fetching quote by access token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
