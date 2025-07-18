/**route: src/lib/email-templates/quoteConfirmation.js */
// Generate HTML email template for quote confirmation with management link
export const generateQuoteConfirmationHTML = ({
  customerName,
  quoteId,
  vehicleName,
  vehicleDetails,
  vin,
  pricing,
  accessToken,
}) => {
  const expirationDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const manageUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }/manage/${accessToken}`;

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
        .cta-button { background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 5px; font-weight: bold; text-decoration: none; }
        .cta-secondary { background: #6B7280; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 5px; font-weight: bold; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .benefits { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .benefits ul { margin: 0; padding-left: 20px; }
        .benefits li { margin: 8px 0; }
        .manage-section { background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6; }
        .access-token { background: #1f2937; color: #f9fafb; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 10px 0; word-break: break-all; }
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
            <a href="${manageUrl}" class="cta-button">
              Accept Your Offer →
            </a>
          </div>

          <div class="manage-section">
            <h3 style="margin-top: 0; color: #1f2937;">🔧 Manage Your Quote</h3>
            <p style="margin: 10px 0; color: #374151;">
              Use the link above or visit our quote management page with your access token:
            </p>
            <div class="access-token">${accessToken}</div>
            <p style="margin: 10px 0; color: #6b7280; font-size: 14px;">
              With this token, you can cancel your quote, reschedule pickup, or update your contact information anytime.
            </p>
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
export const generateQuoteConfirmationText = ({
  customerName,
  quoteId,
  vehicleName,
  vehicleDetails,
  vin,
  pricing,
  accessToken,
}) => {
  const expirationDate = new Date(
    Date.now() + 7 * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const manageUrl = `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }/manage/${accessToken}`;

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

MANAGE YOUR QUOTE:
Visit: ${manageUrl}
Access Token: ${accessToken}

With your access token, you can:
- Cancel your quote anytime
- Reschedule pickup if needed
- Update your contact information

ACCEPT YOUR OFFER:
Click the link above to accept your offer and schedule pickup.

This offer expires in 7 days.

Questions? Reply to this email or call us at (971) 398-7852

Best regards,
PNW Cash for Cars Team
  `.trim();
};
