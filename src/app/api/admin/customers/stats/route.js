/** route: src/app/api/admin/customers/stats/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await connectToDatabase();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    // Get customer statistics
    const stats = await Promise.all([
      // Total unique customers
      Quote.distinct("customer.email").then((emails) => emails.length),

      // Active customers (with non-expired quotes)
      Quote.distinct("customer.email", {
        status: { $nin: ["expired", "completed", "customer_cancelled"] },
      }).then((emails) => emails.length),

      // Completed deals this month
      Quote.aggregate([
        {
          $match: {
            status: "completed",
            createdAt: { $gte: startOfMonth },
          },
        },
        { $group: { _id: "$customer.email" } },
        { $count: "total" },
      ]),

      // Average deal value
      Quote.aggregate([
        {
          $match: {
            status: { $in: ["completed", "pickup_scheduled"] },
          },
        },
        {
          $group: {
            _id: null,
            avgValue: { $avg: "$pricing.finalPrice" },
            totalValue: { $sum: "$pricing.finalPrice" },
            count: { $sum: 1 },
          },
        },
      ]),

      // New customers this month
      Quote.aggregate([
        {
          $match: {
            createdAt: { $gte: startOfMonth },
          },
        },
        { $group: { _id: "$customer.email" } },
        { $count: "total" },
      ]),

      // New customers last month (for comparison)
      Quote.aggregate([
        {
          $match: {
            createdAt: { $gte: lastMonth, $lte: endOfLastMonth },
          },
        },
        { $group: { _id: "$customer.email" } },
        { $count: "total" },
      ]),

      // Customer status breakdown
      Quote.aggregate([
        {
          $group: {
            _id: "$customer.email",
            statuses: { $addToSet: "$status" },
            latestStatus: { $last: "$status" },
          },
        },
        {
          $group: {
            _id: "$latestStatus",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const totalCustomers = stats[0];
    const activeCustomers = stats[1];
    const completedDealsThisMonth = stats[2][0]?.total || 0;
    const avgDealData = stats[3][0] || { avgValue: 0, totalValue: 0, count: 0 };
    const newCustomersThisMonth = stats[4][0]?.total || 0;
    const newCustomersLastMonth = stats[5][0]?.total || 0;
    const statusBreakdown = stats[6];

    // Calculate growth percentage
    const customerGrowthPercent = newCustomersLastMonth > 0 
      ? Math.round(((newCustomersThisMonth - newCustomersLastMonth) / newCustomersLastMonth) * 100)
      : 0;

    return NextResponse.json({
      totalCustomers,
      activeCustomers,
      completedDeals: completedDealsThisMonth,
      avgDealValue: Math.round(avgDealData.avgValue || 0),
      totalRevenue: avgDealData.totalValue || 0,
      totalTransactions: avgDealData.count || 0,
      newCustomersThisMonth,
      customerGrowthPercent,
      statusBreakdown: statusBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error("Customer stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer statistics" },
      { status: 500 }
    );
  }
}
