/** route: src/lib/emailService.js */

const Nodemailer = require("nodemailer");
const { MailtrapTransport } = require("mailtrap");

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

// Generate HTML email template for quote confirmation
const generateQuoteEmailHTML = ({
  customerName,
  quoteId,
  vehicleName,
  vehicleDetails,
  vin,
  pricing,
  quoteUrl,
}) => {
  const expirationDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Cash Offer - ${quoteId}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .offer-box { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .offer-amount { font-size: 48px; font-weight: bold; color: #16a34a; margin: 0; }
        .vehicle-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .cta-button { background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .benefits { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .benefits ul { margin: 0; padding-left: 20px; }
        .benefits li { margin: 8px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚗 Your Cash Offer is Ready!</h1>
          <p>Hi ${customerName}, we've prepared your personalized offer</p>
        </div>
        
        <div class="content">
          <div class="offer-box">
            <div class="offer-amount">$${pricing.finalPrice.toLocaleString()}</div>
            <p style="margin: 10px 0 0 0; color: #16a34a; font-weight: bold;">
              Valid until ${expirationDate}
            </p>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
              Quote ID: ${quoteId}
            </p>
          </div>

          <div class="vehicle-details">
            <h3 style="margin-top: 0; color: #1f2937;">🚙 Vehicle Details</h3>
            <div class="detail-row">
              <strong>Year:</strong> <span>${vehicleDetails.year}</span>
            </div>
            <div class="detail-row">
              <strong>Make:</strong> <span>${vehicleDetails.make}</span>
            </div>
            <div class="detail-row">
              <strong>Model:</strong> <span>${vehicleDetails.model}</span>
            </div>
            <div class="detail-row">
              <strong>Trim:</strong> <span>${
                vehicleDetails.trim || "Standard"
              }</span>
            </div>
            ${
              vin
                ? `
            <div class="detail-row">
              <strong>VIN:</strong> <span>${vin}</span>
            </div>
            `
                : ""
            }
          </div>

          <div class="benefits">
            <h3 style="margin-top: 0; color: #1f2937;">✅ What's Included:</h3>
            <ul>
              <li><strong>Free vehicle pickup</strong> at your location</li>
              <li><strong>All paperwork handled</strong> by our team</li>
              <li><strong>Immediate payment</strong> upon pickup</li>
              <li><strong>No hidden fees</strong> or charges</li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="${quoteUrl}" class="cta-button">
              Accept Your Offer →
            </a>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>⏰ Time Sensitive:</strong> This offer expires in 7 days. 
              Click the button above to accept your offer and schedule pickup.
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>PNW Cash for Cars</strong></p>
          <p>Questions? Reply to this email or call us at (971) 398-7852</p>
          <p style="font-size: 12px; margin-top: 20px;">
            This offer is valid for 7 days from the date of this email. 
            Vehicle condition will be verified during pickup.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text version for fallback
const generateQuoteEmailText = ({
  customerName,
  quoteId,
  vehicleName,
  vehicleDetails,
  vin,
  pricing,
  quoteUrl,
}) => {
  const expirationDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
Your Cash Offer is Ready!

Hi ${customerName},

We've prepared your personalized offer for your ${vehicleName}.

OFFER AMOUNT: $${pricing.finalPrice.toLocaleString()}
Valid until: ${expirationDate}
Quote ID: ${quoteId}

VEHICLE DETAILS:
- Year: ${vehicleDetails.year}
- Make: ${vehicleDetails.make}
- Model: ${vehicleDetails.model}
- Trim: ${vehicleDetails.trim || "Standard"}
${vin ? `- VIN: ${vin}` : ""}

WHAT'S INCLUDED:
✓ Free vehicle pickup at your location
✓ All paperwork handled by our team
✓ Immediate payment upon pickup
✓ No hidden fees or charges

ACCEPT YOUR OFFER:
${quoteUrl}

This offer expires in 7 days. Click the link above to accept your offer and schedule pickup.

Questions? Reply to this email or call us at (971) 398-7852

Best regards,
PNW Cash for Cars Team
  `.trim();
};

// Main function to send quote email
export const sendQuoteEmail = async ({
  to,
  customerName,
  quoteId,
  vehicleName,
  vehicleDetails,
  vin,
  pricing,
  quoteUrl,
}) => {
  try {
    const mailOptions = {
      from: sender,
      to: [to],
      subject: `Your Cash Offer: $${pricing.finalPrice.toLocaleString()} for your ${vehicleName}`,
      text: generateQuoteEmailText({
        customerName,
        quoteId,
        vehicleName,
        vehicleDetails,
        vin,
        pricing,
        quoteUrl,
      }),
      html: generateQuoteEmailHTML({
        customerName,
        quoteId,
        vehicleName,
        vehicleDetails,
        vin,
        pricing,
        quoteUrl,
      }),
      category: "Quote Confirmation",
    };

    const info = await transport.sendMail(mailOptions);
    console.log("📧 Quote email sent successfully:", info);
    return info;
  } catch (error) {
    console.error("📧 Error sending quote email:", error);
    throw error;
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
    return info;
  } catch (error) {
    console.error("📧 Error sending test email:", error);
    throw error;
  }
};
