/** route:  src/app/api/admin/notifications/route.js*/
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await connectToDatabase();

    // Get recent customer actions from quotes (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const quotes = await Quote.find({
      "customerActions.actionHistory.customerInitiated": true,
      "customerActions.actionHistory.timestamp": { $gte: weekAgo },
    })
      .select("customerActions.actionHistory customer vehicleName quoteId")
      .sort({ "customerActions.actionHistory.timestamp": -1 })
      .limit(30);

    // Extract and format notifications
    const notifications = [];

    quotes.forEach((quote) => {
      quote.customerActions.actionHistory.forEach((action) => {
        if (action.customerInitiated && new Date(action.timestamp) >= weekAgo) {
          notifications.push({
            type: action.action,
            customerName: quote.customer.name,
            vehicleName: quote.vehicleName,
            quoteId: quote.quoteId,
            timestamp: action.timestamp,
          });
        }
      });
    });

    // Sort by timestamp (newest first)
    notifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return NextResponse.json({
      notifications: notifications.slice(0, 20), // Return latest 20
    });
  } catch (error) {
    console.error("Notifications fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
