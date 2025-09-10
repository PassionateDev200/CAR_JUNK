/** route: src/app/api/admin/pickups/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 50;
    const page = parseInt(searchParams.get("page")) || 1;

    // Build match criteria for scheduled pickups
    let matchStage = {
      status: "pickup_scheduled",
      "pickupDetails.scheduledDate": { $exists: true, $ne: null },
    };

    // Filter by specific date
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      matchStage["pickupDetails.scheduledDate"] = {
        $gte: startOfDay,
        $lte: endOfDay,
      };
    }

    // Get scheduled pickups with customer and vehicle details
    const pickups = await Quote.find(matchStage)
      .select(
        "quoteId vehicleName customer pricing status createdAt pickupDetails vehicleDetails vin"
      )
      .sort({ "pickupDetails.scheduledDate": 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count for pagination
    const totalPickups = await Quote.countDocuments(matchStage);

    // Format pickup data
    const formattedPickups = pickups.map((quote) => ({
      _id: quote._id,
      quoteId: quote.quoteId,
      vehicleName: quote.vehicleName,
      customer: quote.customer,
      pricing: quote.pricing,
      status: quote.status,
      createdAt: quote.createdAt,
      pickupDetails: quote.pickupDetails,
      vehicleDetails: quote.vehicleDetails,
      vin: quote.vin,
    }));

    return NextResponse.json({
      pickups: formattedPickups,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalPickups / limit),
        totalPickups,
        hasNext: page * limit < totalPickups,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Admin pickups error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pickups" },
      { status: 500 }
    );
  }
}
