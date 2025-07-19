/**route: src/app/api/admin/dashboard/route.js */

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await connectToDatabase();

    // Get current date for filtering
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Aggregate statistics
    const stats = await Promise.all([
      // Total quotes
      Quote.countDocuments(),

      // Active customers (unique emails from non-expired quotes)
      Quote.distinct("customer.email", {
        status: { $nin: ["expired", "completed"] },
      }).then((emails) => emails.length),

      // Scheduled pickups
      Quote.countDocuments({
        status: { $in: ["pickup_scheduled", "accepted"] },
        "pickupDetails.scheduledDate": { $gte: now },
      }),

      // Monthly revenue (estimated from accepted quotes)
      Quote.aggregate([
        {
          $match: {
            status: { $in: ["accepted", "pickup_scheduled", "completed"] },
            createdAt: { $gte: startOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$pricing.finalPrice" },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      totalQuotes: stats[0],
      activeCustomers: stats[1],
      scheduledPickups: stats[2],
      monthlyRevenue: stats[3][0]?.total || 0,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
