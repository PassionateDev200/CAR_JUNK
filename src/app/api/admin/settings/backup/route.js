/** route: src/app/api/admin/settings/backup/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await connectToDatabase();

    // Get backup statistics
    const stats = await Promise.all([
      Quote.countDocuments(),
      Quote.countDocuments({ status: "completed" }),
      Quote.countDocuments({ status: "pending" }),
      Quote.distinct("customer.email").then(emails => emails.length),
    ]);

    const [totalQuotes, completedQuotes, pendingQuotes, totalCustomers] = stats;

    // Calculate database size (approximate)
    const dbSize = await Quote.estimatedDocumentCount() * 0.001; // Rough estimate in MB

    return NextResponse.json({
      backupInfo: {
        totalQuotes,
        completedQuotes,
        pendingQuotes,
        totalCustomers,
        estimatedSize: `${dbSize.toFixed(2)} MB`,
        lastBackup: null, // Would be retrieved from backup log
        nextScheduledBackup: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
      },
    });
  } catch (error) {
    console.error("Backup info error:", error);
    return NextResponse.json(
      { error: "Failed to fetch backup information" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const { type } = await request.json();

    if (!type || !["full", "quotes", "customers"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid backup type. Must be 'full', 'quotes', or 'customers'" },
        { status: 400 }
      );
    }

    let backupData = {};
    let filename = "";

    switch (type) {
      case "full":
        // Export all data
        const quotes = await Quote.find({}).lean();
        backupData = {
          quotes,
          exportDate: new Date(),
          type: "full",
          version: "1.0",
        };
        filename = `full-backup-${new Date().toISOString().split('T')[0]}.json`;
        break;

      case "quotes":
        // Export only quotes
        const quotesOnly = await Quote.find({}).select("quoteId vehicleName customer pricing status createdAt").lean();
        backupData = {
          quotes: quotesOnly,
          exportDate: new Date(),
          type: "quotes",
          version: "1.0",
        };
        filename = `quotes-backup-${new Date().toISOString().split('T')[0]}.json`;
        break;

      case "customers":
        // Export customer data (aggregated from quotes)
        const customerData = await Quote.aggregate([
          {
            $group: {
              _id: "$customer.email",
              customer: { $first: "$customer" },
              quoteCount: { $sum: 1 },
              totalValue: { $sum: "$pricing.finalPrice" },
              latestQuote: { $max: "$createdAt" },
            },
          },
        ]);
        backupData = {
          customers: customerData,
          exportDate: new Date(),
          type: "customers",
          version: "1.0",
        };
        filename = `customers-backup-${new Date().toISOString().split('T')[0]}.json`;
        break;
    }

    // In a real application, you would:
    // 1. Save the backup file to a secure location
    // 2. Log the backup operation
    // 3. Send the file to the client or provide a download link

    return NextResponse.json({
      success: true,
      message: `${type} backup created successfully`,
      filename,
      dataSize: JSON.stringify(backupData).length,
      recordCount: type === "full" ? backupData.quotes.length : 
                   type === "quotes" ? backupData.quotes.length : 
                   backupData.customers.length,
      downloadUrl: `/api/admin/settings/backup/download/${filename}`, // Would be implemented
    });
  } catch (error) {
    console.error("Backup creation error:", error);
    return NextResponse.json(
      { error: "Failed to create backup" },
      { status: 500 }
    );
  }
}
