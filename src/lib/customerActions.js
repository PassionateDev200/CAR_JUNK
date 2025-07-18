/** route: src/lib/customerActions.js */
import connectToDatabase from "@/lib/mongodb";
import Quote from "@/models/Quote";
import { sendCancellationEmail, sendRescheduleEmail } from "@/lib/emailService";

// Handle quote cancellation
export async function handleCancelQuote(quoteId, details) {
  try {
    await connectToDatabase();

    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return { success: false, error: "Quote not found" };
    }

    // Check if cancellation is allowed
    if (!quote.canCustomerCancel()) {
      return {
        success: false,
        error: "Quote cannot be cancelled in current status",
      };
    }

    // Update quote status and add action history
    const updates = {
      status: "customer_cancelled",
      "customerActions.cancellationReason": details.reason,
      "customerActions.cancellationNote": details.note || "",
      "customerActions.cancelledAt": new Date(),
      "customerActions.canCancel": false,
      "customerActions.canReschedule": false,
    };

    const updatedQuote = await Quote.findByIdAndUpdate(
      quoteId,
      {
        $set: updates,
        $push: {
          "customerActions.actionHistory": {
            action: "cancelled",
            reason: details.reason,
            note: details.note || "",
            customerInitiated: details.customerInitiated || false,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    // Send cancellation confirmation email
    if (updatedQuote.customer.email) {
      await sendCancellationEmail({
        to: updatedQuote.customer.email,
        customerName: updatedQuote.customer.name,
        quoteId: updatedQuote.quoteId,
        vehicleName: updatedQuote.vehicleName,
        reason: details.reason,
      });
    }

    return { success: true, quote: updatedQuote };
  } catch (error) {
    console.error("Error cancelling quote:", error);
    return { success: false, error: "Failed to cancel quote" };
  }
}

// Handle pickup rescheduling
export async function handleReschedulePickup(quoteId, details) {
  try {
    await connectToDatabase();

    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return { success: false, error: "Quote not found" };
    }

    // Check if rescheduling is allowed
    if (!quote.canCustomerReschedule()) {
      return {
        success: false,
        error: "Quote cannot be rescheduled in current status",
      };
    }

    // Store original pickup details
    const originalDate = quote.pickupDetails.scheduledDate;
    const originalTime = quote.pickupDetails.scheduledTime;

    // Update quote with new pickup details
    const updates = {
      status: "rescheduled",
      "customerActions.originalPickupDate": originalDate,
      "customerActions.originalPickupTime": originalTime,
      "customerActions.rescheduledDate": details.newDate,
      "customerActions.rescheduledTime": details.newTime,
      "customerActions.rescheduleReason": details.reason,
      "customerActions.rescheduleNote": details.note || "",
      "customerActions.rescheduledAt": new Date(),
      "pickupDetails.scheduledDate": details.newDate,
      "pickupDetails.scheduledTime": details.newTime,
    };

    const updatedQuote = await Quote.findByIdAndUpdate(
      quoteId,
      {
        $set: updates,
        $push: {
          "customerActions.actionHistory": {
            action: "rescheduled",
            reason: details.reason,
            note: details.note || "",
            customerInitiated: details.customerInitiated || false,
            timestamp: new Date(),
            details: {
              originalDate,
              originalTime,
              newDate: details.newDate,
              newTime: details.newTime,
            },
          },
        },
      },
      { new: true }
    );

    // Send reschedule confirmation email
    if (updatedQuote.customer.email) {
      await sendRescheduleEmail({
        to: updatedQuote.customer.email,
        customerName: updatedQuote.customer.name,
        quoteId: updatedQuote.quoteId,
        vehicleName: updatedQuote.vehicleName,
        originalDate,
        originalTime,
        newDate: details.newDate,
        newTime: details.newTime,
        reason: details.reason,
      });
    }

    return { success: true, quote: updatedQuote };
  } catch (error) {
    console.error("Error rescheduling pickup:", error);
    return { success: false, error: "Failed to reschedule pickup" };
  }
}

// Handle contact info updates
export async function handleUpdateContactInfo(quoteId, updates) {
  try {
    await connectToDatabase();

    const quote = await Quote.findById(quoteId);
    if (!quote) {
      return { success: false, error: "Quote not found" };
    }

    // Prepare update object
    const updateObj = {};
    if (updates.name) updateObj["customer.name"] = updates.name;
    if (updates.email) updateObj["customer.email"] = updates.email;
    if (updates.phone) updateObj["customer.phone"] = updates.phone;
    if (updates.address) updateObj["customer.address"] = updates.address;

    const updatedQuote = await Quote.findByIdAndUpdate(
      quoteId,
      {
        $set: {
          ...updateObj,
          // ✅ ENSURE cancellation permissions remain unchanged
          "customerActions.canCancel": quote.customerActions.canCancel || true,
        },
        $push: {
          "customerActions.actionHistory": {
            action: "modified",
            reason: "contact_info_updated",
            note: "Customer updated contact information",
            customerInitiated: true,
            timestamp: new Date(),
            details: updates,
          },
        },
      },
      { new: true }
    );

    return { success: true, quote: updatedQuote };
  } catch (error) {
    console.error("Error updating contact info:", error);
    return { success: false, error: "Failed to update contact information" };
  }
}

// Get quote by access token
export async function getQuoteByAccessToken(accessToken) {
  try {
    await connectToDatabase();

    const quote = await Quote.findOne({
      accessToken,
      status: { $nin: ["expired", "completed"] },
    });

    if (!quote) {
      return { success: false, error: "Quote not found or expired" };
    }

    // Check if quote is expired
    if (quote.expiresAt && new Date() > quote.expiresAt) {
      await Quote.findByIdAndUpdate(quote._id, { status: "expired" });
      return { success: false, error: "Quote has expired" };
    }

    return { success: true, quote };
  } catch (error) {
    console.error("Error fetching quote by access token:", error);
    return { success: false, error: "Failed to fetch quote" };
  }
}
