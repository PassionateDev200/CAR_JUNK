/**route: src/app/api/admin/recent-actions/route.js */

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await connectToDatabase();

    // Get recent customer actions from all quotes
    const quotes = await Quote.find({
      "customerActions.actionHistory.0": { $exists: true },
    })
      .select("customerActions.actionHistory customer vehicleName")
      .sort({ "customerActions.actionHistory.timestamp": -1 })
      .limit(20);

    // Flatten and sort all actions
    const allActions = [];

    quotes.forEach((quote) => {
      quote.customerActions.actionHistory.forEach((action) => {
        if (action.customerInitiated) {
          allActions.push({
            customerName: quote.customer.name,
            vehicleName: quote.vehicleName,
            action: action.action,
            reason: action.reason,
            timestamp: action.timestamp,
            quoteId: quote.quoteId,
          });
        }
      });
    });

    // Sort by timestamp descending
    allActions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return NextResponse.json({
      actions: allActions.slice(0, 10),
    });
  } catch (error) {
    console.error("Recent actions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch actions" },
      { status: 500 }
    );
  }
}
