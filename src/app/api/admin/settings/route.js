/** route: src/app/api/admin/settings/route.js */
import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";

export async function GET() {
  try {
    await connectToDatabase();

    // Get system statistics for settings overview
    const stats = await Promise.all([
      Quote.countDocuments(),
      Quote.countDocuments({ status: "completed" }),
      Quote.countDocuments({ status: "pending" }),
      Quote.distinct("customer.email").then(emails => emails.length),
    ]);

    const [totalQuotes, completedQuotes, pendingQuotes, totalCustomers] = stats;

    // Default settings structure
    const defaultSettings = {
      general: {
        siteName: "PNW Car Junk",
        siteDescription: "Professional car junk removal service",
        contactEmail: "admin@pnwcarjunk.com",
        contactPhone: "(555) 123-4567",
        businessAddress: "123 Main St, Seattle, WA 98101",
        businessHours: "Mon-Fri: 8AM-6PM, Sat: 9AM-4PM",
        timezone: "America/Los_Angeles",
        currency: "USD",
        dateFormat: "MM/DD/YYYY",
      },
      email: {
        smtpHost: "",
        smtpPort: 587,
        smtpUser: "",
        smtpPassword: "",
        fromEmail: "noreply@pnwcarjunk.com",
        fromName: "PNW Car Junk",
        adminNotifications: true,
        customerNotifications: true,
        quoteExpiryReminder: true,
        pickupReminder: true,
      },
      notifications: {
        newQuoteAlert: true,
        quoteApprovalAlert: true,
        pickupScheduledAlert: true,
        pickupCompletedAlert: true,
        customerCancellationAlert: true,
        emailNotifications: true,
        smsNotifications: false,
        webhookUrl: "",
      },
      pricing: {
        basePricePerPound: 0.50,
        minimumQuoteValue: 100,
        maximumQuoteValue: 10000,
        adjustmentFactors: {
          condition: {
            excellent: 1.2,
            good: 1.0,
            fair: 0.8,
            poor: 0.6,
          },
          make: {
            luxury: 1.3,
            standard: 1.0,
            economy: 0.8,
          },
        },
        quoteExpiryDays: 7,
        autoApprovalThreshold: 500,
      },
      security: {
        sessionTimeout: 30, // minutes
        maxLoginAttempts: 5,
        lockoutDuration: 15, // minutes
        requireTwoFactor: false,
        allowedIPs: [],
        passwordPolicy: {
          minLength: 8,
          requireUppercase: true,
          requireLowercase: true,
          requireNumbers: true,
          requireSpecialChars: true,
        },
      },
      backup: {
        autoBackup: true,
        backupFrequency: "daily", // daily, weekly, monthly
        backupRetention: 30, // days
        lastBackup: null,
        backupLocation: "local", // local, cloud
      },
    };

    return NextResponse.json({
      settings: defaultSettings,
      systemStats: {
        totalQuotes,
        completedQuotes,
        pendingQuotes,
        totalCustomers,
        completionRate: totalQuotes > 0 ? Math.round((completedQuotes / totalQuotes) * 100) : 0,
      },
    });
  } catch (error) {
    console.error("Settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();
    const { section, settings } = await request.json();

    if (!section || !settings) {
      return NextResponse.json(
        { error: "Section and settings are required" },
        { status: 400 }
      );
    }

    // In a real application, you would save these to a settings collection
    // For now, we'll just validate and return success
    const validSections = ["general", "email", "notifications", "pricing", "security", "backup"];
    
    if (!validSections.includes(section)) {
      return NextResponse.json(
        { error: "Invalid settings section" },
        { status: 400 }
      );
    }

    // Validate settings based on section
    let validationErrors = [];
    
    switch (section) {
      case "general":
        if (!settings.siteName || settings.siteName.trim().length < 2) {
          validationErrors.push("Site name must be at least 2 characters");
        }
        if (!settings.contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.contactEmail)) {
          validationErrors.push("Valid contact email is required");
        }
        break;
        
      case "email":
        if (settings.smtpHost && !settings.smtpUser) {
          validationErrors.push("SMTP user is required when SMTP host is provided");
        }
        if (settings.smtpPort && (settings.smtpPort < 1 || settings.smtpPort > 65535)) {
          validationErrors.push("SMTP port must be between 1 and 65535");
        }
        break;
        
      case "pricing":
        if (settings.basePricePerPound < 0) {
          validationErrors.push("Base price per pound cannot be negative");
        }
        if (settings.minimumQuoteValue >= settings.maximumQuoteValue) {
          validationErrors.push("Minimum quote value must be less than maximum");
        }
        if (settings.quoteExpiryDays < 1 || settings.quoteExpiryDays > 30) {
          validationErrors.push("Quote expiry days must be between 1 and 30");
        }
        break;
        
      case "security":
        if (settings.sessionTimeout < 5 || settings.sessionTimeout > 480) {
          validationErrors.push("Session timeout must be between 5 and 480 minutes");
        }
        if (settings.maxLoginAttempts < 3 || settings.maxLoginAttempts > 10) {
          validationErrors.push("Max login attempts must be between 3 and 10");
        }
        break;
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    // In a real application, save to database here
    // await Settings.findOneAndUpdate(
    //   { section },
    //   { section, settings, updatedAt: new Date() },
    //   { upsert: true }
    // );

    return NextResponse.json({
      success: true,
      message: `${section} settings updated successfully`,
      section,
      settings,
    });
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
