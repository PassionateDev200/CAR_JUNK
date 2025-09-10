/** route: src/app/api/admin/analytics/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const period = searchParams.get("period") || "month"; // day, week, month, year

    // Set date range based on period
    const now = new Date();
    let dateFilter = {};

    if (startDate && endDate) {
      dateFilter = {
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      };
    } else {
      // Default to last 30 days
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      dateFilter = {
        createdAt: {
          $gte: thirtyDaysAgo,
          $lte: now,
        },
      };
    }

    // Get comprehensive analytics data
    const analytics = await Promise.all([
      // Total quotes and revenue
      Quote.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalQuotes: { $sum: 1 },
            totalRevenue: { $sum: "$pricing.finalPrice" },
            avgQuoteValue: { $avg: "$pricing.finalPrice" },
            minQuoteValue: { $min: "$pricing.finalPrice" },
            maxQuoteValue: { $max: "$pricing.finalPrice" },
          },
        },
      ]),

      // Status breakdown
      Quote.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalValue: { $sum: "$pricing.finalPrice" },
          },
        },
      ]),

      // Daily/Weekly/Monthly trends
      Quote.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              $dateToString: {
                format: period === "day" ? "%Y-%m-%d" : period === "week" ? "%Y-%U" : "%Y-%m",
                date: "$createdAt",
              },
            },
            count: { $sum: 1 },
            revenue: { $sum: "$pricing.finalPrice" },
            avgValue: { $avg: "$pricing.finalPrice" },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Vehicle type analysis
      Quote.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$vehicleDetails.make",
            count: { $sum: 1 },
            totalValue: { $sum: "$pricing.finalPrice" },
            avgValue: { $avg: "$pricing.finalPrice" },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ]),

      // Customer analysis
      Quote.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$customer.email",
            quoteCount: { $sum: 1 },
            totalValue: { $sum: "$pricing.finalPrice" },
            latestQuote: { $max: "$createdAt" },
          },
        },
        {
          $group: {
            _id: null,
            totalCustomers: { $sum: 1 },
            repeatCustomers: {
              $sum: { $cond: [{ $gt: ["$quoteCount", 1] }, 1, 0] },
            },
            avgQuotesPerCustomer: { $avg: "$quoteCount" },
            avgValuePerCustomer: { $avg: "$totalValue" },
          },
        },
      ]),

      // Conversion funnel
      Quote.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]),

      // Pickup analysis
      Quote.aggregate([
        {
          $match: {
            ...dateFilter,
            "pickupDetails.scheduledDate": { $exists: true },
          },
        },
        {
          $group: {
            _id: null,
            totalScheduled: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
            pending: {
              $sum: { $cond: [{ $eq: ["$status", "pickup_scheduled"] }, 1, 0] },
            },
            cancelled: {
              $sum: { $cond: [{ $eq: ["$status", "customer_cancelled"] }, 1, 0] },
            },
          },
        },
      ]),

      // Time-based analysis (hour of day, day of week)
      Quote.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              hour: { $hour: "$createdAt" },
              dayOfWeek: { $dayOfWeek: "$createdAt" },
            },
            count: { $sum: 1 },
            revenue: { $sum: "$pricing.finalPrice" },
          },
        },
        { $sort: { "_id.hour": 1, "_id.dayOfWeek": 1 } },
      ]),
    ]);

    // Process the results
    const totalMetrics = analytics[0][0] || {
      totalQuotes: 0,
      totalRevenue: 0,
      avgQuoteValue: 0,
      minQuoteValue: 0,
      maxQuoteValue: 0,
    };

    const statusBreakdown = analytics[1].reduce((acc, item) => {
      acc[item._id] = {
        count: item.count,
        totalValue: item.totalValue,
        percentage: 0, // Will be calculated below
      };
      return acc;
    }, {});

    // Calculate percentages for status breakdown
    const totalQuotes = totalMetrics.totalQuotes;
    Object.keys(statusBreakdown).forEach(status => {
      statusBreakdown[status].percentage = totalQuotes > 0 
        ? Math.round((statusBreakdown[status].count / totalQuotes) * 100) 
        : 0;
    });

    const trends = analytics[2];
    const vehicleAnalysis = analytics[3];
    const customerMetrics = analytics[4][0] || {
      totalCustomers: 0,
      repeatCustomers: 0,
      avgQuotesPerCustomer: 0,
      avgValuePerCustomer: 0,
    };

    const conversionFunnel = analytics[5].reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const pickupMetrics = analytics[6][0] || {
      totalScheduled: 0,
      completed: 0,
      pending: 0,
      cancelled: 0,
    };

    const timeAnalysis = analytics[7];

    // Calculate conversion rate
    const conversionRate = totalQuotes > 0 
      ? Math.round(((conversionFunnel.completed || 0) / totalQuotes) * 100)
      : 0;

    // Calculate pickup completion rate
    const pickupCompletionRate = pickupMetrics.totalScheduled > 0
      ? Math.round((pickupMetrics.completed / pickupMetrics.totalScheduled) * 100)
      : 0;

    return NextResponse.json({
      totalMetrics,
      statusBreakdown,
      trends,
      vehicleAnalysis,
      customerMetrics,
      conversionFunnel,
      pickupMetrics,
      timeAnalysis,
      conversionRate,
      pickupCompletionRate,
      period,
      dateRange: {
        start: dateFilter.createdAt?.$gte || null,
        end: dateFilter.createdAt?.$lte || null,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
