/** route: src/app/api/admin/pickups/stats/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    // Get pickup statistics
    const stats = await Promise.all([
      // Today's pickups
      Quote.countDocuments({
        status: "pickup_scheduled",
        "pickupDetails.scheduledDate": {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      }),

      // This week's pickups
      Quote.countDocuments({
        status: "pickup_scheduled",
        "pickupDetails.scheduledDate": {
          $gte: startOfWeek,
          $lte: endOfWeek,
        },
      }),

      // Completed pickups this month
      Quote.countDocuments({
        status: "completed",
        "pickupDetails.scheduledDate": {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      }),

      // Average pickup time (mock data for now)
      Promise.resolve(45), // This would be calculated from actual pickup completion times

      // Upcoming pickups (next 7 days)
      Quote.countDocuments({
        status: "pickup_scheduled",
        "pickupDetails.scheduledDate": {
          $gte: now,
          $lte: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
        },
      }),

      // Overdue pickups
      Quote.countDocuments({
        status: "pickup_scheduled",
        "pickupDetails.scheduledDate": {
          $lt: now,
        },
      }),

      // Pickup status breakdown
      Quote.aggregate([
        {
          $match: {
            "pickupDetails.scheduledDate": { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const todaysPickups = stats[0];
    const thisWeekPickups = stats[1];
    const completedThisMonth = stats[2];
    const avgPickupTime = stats[3];
    const upcomingPickups = stats[4];
    const overduePickups = stats[5];
    const statusBreakdown = stats[6];

    return NextResponse.json({
      todaysPickups,
      thisWeekPickups,
      completedThisMonth,
      avgPickupTime,
      upcomingPickups,
      overduePickups,
      statusBreakdown: statusBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Pickup stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch pickup statistics" },
      { status: 500 }
    );
  }
}
