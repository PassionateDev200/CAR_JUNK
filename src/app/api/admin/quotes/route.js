/**route: src/app/api/admin/quotes/route.js */

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 50;
    const page = parseInt(searchParams.get("page")) || 1;

    // Build query
    let query = {};
    if (status && status !== "all") {
      query.status = status;
    }

    // Get quotes with pagination
    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select(
        "quoteId vehicleName customer pricing status createdAt expiresAt pickupDetails customerActions accessToken vehicleDetails vin"
      );

    const totalQuotes = await Quote.countDocuments(query);

    return NextResponse.json({
      quotes,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalQuotes / limit),
        totalQuotes,
        hasNext: page * limit < totalQuotes,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Admin quotes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes" },
      { status: 500 }
    );
  }
}
