/** route: src/lib/emailService.js */
const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");
import {
  generateQuoteConfirmationHTML,
  generateQuoteConfirmationText,
} from "./email-templates/quoteConfirmation";
import {
  generateCancellationConfirmationHTML,
  generateCancellationConfirmationText,
} from "./email-templates/cancellationConfirmation";
import {
  generateRescheduleConfirmationHTML,
  generateRescheduleConfirmationText,
} from "./email-templates/rescheduleConfirmation";
import {
  generateAdminNotificationHTML,
  generateAdminNotificationText,
} from "./email-templates/adminNotifications";

// Mailtrap configuration
const TOKEN = "c7a4970c872948b1afadf1dad1b03379";

// Create transport using Mailtrap
const transport = Nodemailer.createTransport(
  MailtrapTransport({
    token: TOKEN,
  })
);

// Email sender configuration
const sender = {
  address: "support@pnwcashforcars.com",
  name: "PNW Cash for Cars",
};

// Main function to send quote confirmation email
export const sendQuoteConfirmationEmail = async ({
  to,
  customerName,
  quoteId,
  vehicleName,
  vehicleDetails,
  vin,
  pricing,
  accessToken,
}) => {
  try {
    const mailOptions = {
      from: sender,
      to: [to],
      subject: `Your Cash Offer: $${pricing.finalPrice.toLocaleString()} for your ${vehicleName}`,
      text: generateQuoteConfirmationText({
        customerName,
        quoteId,
        vehicleName,
        vehicleDetails,
        vin,
        pricing,
        accessToken,
      }),
      html: generateQuoteConfirmationHTML({
        customerName,
        quoteId,
        vehicleName,
        vehicleDetails,
        vin,
        pricing,
        accessToken,
      }),
      category: "Quote Confirmation",
    };

    const info = await transport.sendMail(mailOptions);
    console.log("📧 Quote confirmation email sent successfully:", info);
    return { success: true, info };
  } catch (error) {
    console.error("📧 Error sending quote confirmation email:", error);
    return { success: false, error: error.message };
  }
};

// Function to send cancellation confirmation email
export const sendCancellationEmail = async ({
  to,
  customerName,
  quoteId,
  vehicleName,
  reason,
}) => {
  try {
    const mailOptions = {
      from: sender,
      to: [to],
      subject: `Quote Cancellation Confirmed - ${quoteId}`,
      text: generateCancellationConfirmationText({
        customerName,
        quoteId,
        vehicleName,
        reason,
        cancelledAt: new Date(),
      }),
      html: generateCancellationConfirmationHTML({
        customerName,
        quoteId,
        vehicleName,
        reason,
        cancelledAt: new Date(),
      }),
      category: "Cancellation Confirmation",
    };

    const info = await transport.sendMail(mailOptions);
    console.log("📧 Cancellation confirmation email sent successfully:", info);
    return { success: true, info };
  } catch (error) {
    console.error("📧 Error sending cancellation confirmation email:", error);
    return { success: false, error: error.message };
  }
};

// Function to send reschedule confirmation email
export const sendRescheduleEmail = async ({
  to,
  customerName,
  quoteId,
  vehicleName,
  originalDate,
  originalTime,
  newDate,
  newTime,
  reason,
}) => {
  try {
    const mailOptions = {
      from: sender,
      to: [to],
      subject: `Pickup Rescheduled - ${quoteId}`,
      text: generateRescheduleConfirmationText({
        customerName,
        quoteId,
        vehicleName,
        originalDate,
        originalTime,
        newDate,
        newTime,
        reason,
        rescheduledAt: new Date(),
      }),
      html: generateRescheduleConfirmationHTML({
        customerName,
        quoteId,
        vehicleName,
        originalDate,
        originalTime,
        newDate,
        newTime,
        reason,
        rescheduledAt: new Date(),
      }),
      category: "Reschedule Confirmation",
    };

    const info = await transport.sendMail(mailOptions);
    console.log("📧 Reschedule confirmation email sent successfully:", info);
    return { success: true, info };
  } catch (error) {
    console.error("📧 Error sending reschedule confirmation email:", error);
    return { success: false, error: error.message };
  }
};

// Function to send admin notification email
export const sendAdminNotificationEmail = async ({
  subject,
  message,
  quoteId,
  customerName,
  vehicleName,
  actionType,
  details,
}) => {
  try {
    const adminEmails = [
      "admin@pnwcashforcars.com",
      "service@regaltowing.net", // Your test email
    ];

    const mailOptions = {
      from: sender,
      to: adminEmails,
      subject: `Admin Alert: ${subject}`,
      text: generateAdminNotificationText({
        type: actionType,
        quoteId,
        customerName,
        vehicleName,
        actionType,
        details,
      }),
      html: generateAdminNotificationHTML({
        type: actionType,
        quoteId,
        customerName,
        vehicleName,
        actionType,
        details,
      }),
      category: "Admin Notification",
    };

    const info = await transport.sendMail(mailOptions);
    console.log("📧 Admin notification email sent successfully:", info);
    return { success: true, info };
  } catch (error) {
    console.error("📧 Error sending admin notification email:", error);
    return { success: false, error: error.message };
  }
};

// Test function to send a sample email
export const sendTestEmail = async (recipientEmail) => {
  try {
    const mailOptions = {
      from: sender,
      to: [recipientEmail],
      subject: "PNW Cash for Cars - Email Service Test",
      text: "This is a test email to verify the email service is working correctly.",
      html: `
        <h1>Email Service Test</h1>
        <p style="color: green;">Your email service is working correctly!</p>
        <p>This confirms that Mailtrap integration is successful.</p>
      `,
      category: "Test Email",
    };

    const info = await transport.sendMail(mailOptions);
    console.log("📧 Test email sent successfully:", info);
    return { success: true, info };
  } catch (error) {
    console.error("📧 Error sending test email:", error);
    return { success: false, error: error.message };
  }
};
