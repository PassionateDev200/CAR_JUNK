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
      "pandaos240822@gmail.com", // Your test email
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

// Add this function to your existing emailService.js file

export const sendPickupNotificationEmail = async ({
  quote,
  scheduledDate,
  scheduledTime,
  timeSlot,
  contactPhone,
  pickupAddress,
  specialInstructions,
  adminEmail,
}) => {
  try {
    // Format the scheduled date nicely
    const formattedDate = new Date(scheduledDate).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Format time to 12-hour format
    const formattedTime = new Date(
      `1970-01-01T${scheduledTime}`
    ).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    const mailOptions = {
      from: sender, // Using your existing sender configuration
      to: [adminEmail],
      subject: `🚙 Pickup Scheduled: ${quote.vehicleName} - Quote ${quote.quoteId}`,
      text: generatePickupNotificationText({
        quote,
        formattedDate,
        formattedTime,
        timeSlot,
        contactPhone,
        pickupAddress,
        specialInstructions,
      }),
      html: generatePickupNotificationHTML({
        quote,
        formattedDate,
        formattedTime,
        timeSlot,
        contactPhone,
        pickupAddress,
        specialInstructions,
      }),
      category: "Pickup Notification",
    };

    const info = await transport.sendMail(mailOptions); // Using your existing transport
    console.log("📧 Pickup notification email sent successfully:", info);
    return { success: true, info };
  } catch (error) {
    console.error("📧 Error sending pickup notification email:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to generate plain text version
const generatePickupNotificationText = ({
  quote,
  formattedDate,
  formattedTime,
  timeSlot,
  contactPhone,
  pickupAddress,
  specialInstructions,
}) => {
  return `
🚙 NEW PICKUP SCHEDULED

A customer has scheduled a pickup for their vehicle.

📅 PICKUP DETAILS
Date: ${formattedDate}
Time: ${formattedTime}
Time Preference: ${timeSlot || "Flexible"}

👤 CUSTOMER INFORMATION  
Name: ${quote.customer.name}
Email: ${quote.customer.email}
Phone: ${contactPhone}

🚙 VEHICLE INFORMATION
Vehicle: ${quote.vehicleName}
Quote ID: ${quote.quoteId}
Offer Amount: $${quote.pricing.finalPrice.toLocaleString()}
${quote.vin ? `VIN: ${quote.vin}` : ""}

📍 PICKUP ADDRESS
${pickupAddress}

📝 SPECIAL INSTRUCTIONS
${specialInstructions || "None provided"}

⚡ ACTION REQUIRED
Please coordinate with the customer and update the pickup status in the admin dashboard.

---
PNW Cash for Cars
Support Team
  `.trim();
};

// Helper function to generate HTML version
const generatePickupNotificationHTML = ({
  quote,
  formattedDate,
  formattedTime,
  timeSlot,
  contactPhone,
  pickupAddress,
  specialInstructions,
}) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pickup Scheduled - ${quote.quoteId}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .section { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3b82f6; }
        .urgent { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #374151; }
        .value { color: #1f2937; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; }
        .highlight { background: #dbeafe; padding: 12px; border-radius: 6px; font-size: 18px; font-weight: bold; color: #1e40af; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚙 Pickup Scheduled</h1>
          <p>A customer has scheduled a vehicle pickup</p>
        </div>
        
        <div class="content">
          <div class="urgent">
            <strong>⚡ Action Required:</strong> Please coordinate with the customer and update the pickup status in the admin dashboard.
          </div>

          <div class="section">
            <h3>📅 Pickup Details</h3>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time:</span>
              <span class="value">${formattedTime}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time Preference:</span>
              <span class="value">${timeSlot || "Flexible"}</span>
            </div>
          </div>

          <div class="section">
            <h3>👤 Customer Information</h3>
            <div class="detail-row">
              <span class="label">Name:</span>
              <span class="value">${quote.customer.name}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span>
              <span class="value">${quote.customer.email}</span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span class="value">${contactPhone}</span>
            </div>
          </div>

          <div class="section">
            <h3>🚙 Vehicle Information</h3>
            <div class="detail-row">
              <span class="label">Vehicle:</span>
              <span class="value">${quote.vehicleName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Quote ID:</span>
              <span class="value">${quote.quoteId}</span>
            </div>
            <div class="detail-row">
              <span class="label">Offer Amount:</span>
              <span class="value">$${quote.pricing.finalPrice.toLocaleString()}</span>
            </div>
            ${
              quote.vin
                ? `
            <div class="detail-row">
              <span class="label">VIN:</span>
              <span class="value">${quote.vin}</span>
            </div>
            `
                : ""
            }
          </div>

          <div class="section">
            <h3>📍 Pickup Address</h3>
            <p style="margin: 0; padding: 10px; background: white; border-radius: 4px; border: 1px solid #e5e7eb;">
              ${pickupAddress}
            </p>
          </div>

          <div class="section">
            <h3>📝 Special Instructions</h3>
            <p style="margin: 0; padding: 10px; background: white; border-radius: 4px; border: 1px solid #e5e7eb; font-style: ${
              specialInstructions ? "normal" : "italic"
            };">
              ${specialInstructions || "None provided"}
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>PNW Cash for Cars</strong></p>
          <p>Admin Notification System</p>
          <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">
            This is an automated notification. Please do not reply to this email.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};
