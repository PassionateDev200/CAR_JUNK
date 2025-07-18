/** route: src/lib/notificationService.js */
import { sendAdminNotificationEmail } from "@/lib/emailService";

// Send admin notification for customer actions
export async function sendAdminNotification(data) {
  try {
    const { type, quoteId, vehicleName, customerName, ...details } = data;

    // Format notification based on type
    let subject, message;

    switch (type) {
      case "quote_cancelled":
        subject = `Quote Cancelled - ${quoteId}`;
        message = `Customer ${customerName} has cancelled their quote for ${vehicleName}.\n\nReason: ${
          details.reason
        }\nNote: ${details.note || "None"}`;
        break;

      case "pickup_rescheduled":
        subject = `Pickup Rescheduled - ${quoteId}`;
        message = `Customer ${customerName} has rescheduled pickup for ${vehicleName}.\n\nOriginal: ${
          details.originalDate
        } at ${details.originalTime}\nNew: ${details.newDate} at ${
          details.newTime
        }\nReason: ${details.reason}\nNote: ${details.note || "None"}`;
        break;

      case "contact_updated":
        subject = `Contact Info Updated - ${quoteId}`;
        message = `Customer ${customerName} has updated their contact information for ${vehicleName}.\n\nUpdated fields: ${Object.keys(
          details
        ).join(", ")}`;
        break;

      default:
        subject = `Customer Action - ${quoteId}`;
        message = `Customer ${customerName} performed an action on quote ${quoteId} for ${vehicleName}`;
    }

    // Send email notification to admin
    await sendAdminNotificationEmail({
      subject,
      message,
      quoteId,
      customerName,
      vehicleName,
      actionType: type,
      details,
    });

    console.log(`Admin notification sent for ${type} - ${quoteId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return { success: false, error: error.message };
  }
}

// Log customer action for analytics
export async function logCustomerAction(quoteId, action, details = {}) {
  try {
    // This would typically log to an analytics service
    console.log(`Customer Action Log:`, {
      quoteId,
      action,
      details,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error logging customer action:", error);
    return { success: false, error: error.message };
  }
}

// Get customer action statistics
export async function getCustomerActionStats(timeframe = "30d") {
  try {
    // This would typically query your analytics database
    const mockStats = {
      totalActions: 150,
      cancellations: 45,
      reschedules: 30,
      updates: 75,
      topCancellationReasons: {
        changed_mind: 15,
        found_better_offer: 12,
        family_decision: 8,
        timing_issues: 6,
        other: 4,
      },
    };

    return { success: true, stats: mockStats };
  } catch (error) {
    console.error("Error getting customer action stats:", error);
    return { success: false, error: error.message };
  }
}
