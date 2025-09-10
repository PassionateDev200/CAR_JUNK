/** route: src/app/api/admin/customers/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit")) || 50;
    const page = parseInt(searchParams.get("page")) || 1;

    // Build aggregation pipeline to get unique customers with their quote data
    let matchStage = {};
    
    if (search) {
      matchStage = {
        $or: [
          { "customer.name": { $regex: search, $options: "i" } },
          { "customer.email": { $regex: search, $options: "i" } },
          { "customer.phone": { $regex: search, $options: "i" } },
        ],
      };
    }

    if (status && status !== "all") {
      matchStage.status = status;
    }

    // Aggregate to get customer data with their quotes
    const customers = await Quote.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$customer.email",
          customer: { $first: "$customer" },
          quotes: {
            $push: {
              quoteId: "$quoteId",
              vehicleName: "$vehicleName",
              status: "$status",
              finalPrice: "$pricing.finalPrice",
              createdAt: "$createdAt",
              expiresAt: "$expiresAt",
              pickupDetails: "$pickupDetails",
            },
          },
          totalQuotes: { $sum: 1 },
          totalValue: { $sum: "$pricing.finalPrice" },
          latestQuoteDate: { $max: "$createdAt" },
          hasActiveQuote: {
            $max: {
              $cond: [
                { $in: ["$status", ["pending", "accepted", "pickup_scheduled"]] },
                true,
                false,
              ],
            },
          },
        },
      },
      {
        $project: {
          _id: 1,
          customer: 1,
          quotes: 1,
          totalQuotes: 1,
          totalValue: 1,
          latestQuoteDate: 1,
          hasActiveQuote: 1,
          avgQuoteValue: { $divide: ["$totalValue", "$totalQuotes"] },
        },
      },
      { $sort: { latestQuoteDate: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: limit },
    ]);

    // Get total count for pagination
    const totalCustomers = await Quote.aggregate([
      { $match: matchStage },
      { $group: { _id: "$customer.email" } },
      { $count: "total" },
    ]);

    return NextResponse.json({
      customers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil((totalCustomers[0]?.total || 0) / limit),
        totalCustomers: totalCustomers[0]?.total || 0,
        hasNext: page * limit < (totalCustomers[0]?.total || 0),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Admin customers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
