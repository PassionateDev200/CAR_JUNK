/** route: src/lib/email-templates/pickupScheduledConfirmation.js */

// Generate HTML email template for pickup scheduled confirmation (seller receives this)
export const generatePickupScheduledConfirmationHTML = ({
  customerName,
  quoteId,
  vehicleName,
  offerAmount,
  scheduledDate,
  pickupWindow,
  pickupTimeRange,
  pickupAddress,
  contactPhone,
  specialInstructions,
  accessToken,
}) => {
  // Format the scheduled date nicely
  const formattedDate = new Date(scheduledDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const manageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/manage/${accessToken}`;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pickup Confirmed - ${quoteId}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0 0 10px 0; font-size: 28px; }
        .header p { margin: 0; font-size: 16px; opacity: 0.95; }
        .content { padding: 30px; }
        .success-banner { background: #f0fdf4; border: 2px solid #22c55e; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .success-banner h2 { margin: 0 0 10px 0; color: #16a34a; font-size: 24px; }
        .success-banner p { margin: 0; color: #15803d; font-size: 16px; }
        .offer-highlight { background: #dbeafe; border-left: 4px solid #3b82f6; padding: 15px 20px; border-radius: 6px; margin: 20px 0; }
        .offer-amount { font-size: 32px; font-weight: bold; color: #1e40af; margin: 5px 0; }
        .section { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .section h3 { margin: 0 0 15px 0; color: #1f2937; font-size: 18px; }
        .detail-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .detail-row .label { font-weight: bold; color: #374151; }
        .detail-row .value { color: #1f2937; }
        .important-box { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .important-box p { margin: 0; color: #92400e; }
        .cta-button { background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 0; font-weight: bold; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
        .next-steps { background: #ecfdf5; border: 1px solid #10b981; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .next-steps h3 { margin: 0 0 15px 0; color: #065f46; }
        .next-steps ul { margin: 0; padding-left: 20px; }
        .next-steps li { margin: 10px 0; color: #047857; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ Pickup Confirmed!</h1>
          <p>Your offer has been accepted and pickup is scheduled</p>
        </div>
        
        <div class="content">
          <div class="success-banner">
            <h2>🎉 Congratulations, ${customerName}!</h2>
            <p>Your vehicle pickup has been successfully scheduled</p>
          </div>

          <div class="offer-highlight">
            <p style="margin: 0; font-size: 14px; color: #1e40af;">You accepted our offer:</p>
            <div class="offer-amount">$${offerAmount.toLocaleString()}</div>
            <p style="margin: 5px 0 0 0; font-size: 14px; color: #1e40af;">Quote ID: ${quoteId}</p>
          </div>

          <div class="section">
            <h3>📅 Pickup Details</h3>
            <div class="detail-row">
              <span class="label">Date:</span>
              <span class="value">${formattedDate}</span>
            </div>
            <div class="detail-row">
              <span class="label">Time Window:</span>
              <span class="value">${pickupWindow.charAt(0).toUpperCase() + pickupWindow.slice(1)} (${pickupTimeRange})</span>
            </div>
            <div class="detail-row">
              <span class="label">Contact Phone:</span>
              <span class="value">${contactPhone}</span>
            </div>
          </div>

          <div class="section">
            <h3>📍 Pickup Location</h3>
            <p style="margin: 0; padding: 10px; background: white; border-radius: 4px; border: 1px solid #e5e7eb;">
              ${pickupAddress}
            </p>
          </div>

          ${specialInstructions ? `
          <div class="section">
            <h3>📝 Special Instructions</h3>
            <p style="margin: 0; padding: 10px; background: white; border-radius: 4px; border: 1px solid #e5e7eb;">
              ${specialInstructions}
            </p>
          </div>
          ` : ''}

          <div class="section">
            <h3>🚙 Vehicle Information</h3>
            <div class="detail-row">
              <span class="label">Vehicle:</span>
              <span class="value">${vehicleName}</span>
            </div>
            <div class="detail-row">
              <span class="label">Offer Amount:</span>
              <span class="value">$${offerAmount.toLocaleString()}</span>
            </div>
          </div>

          <div class="next-steps">
            <h3>✨ What Happens Next?</h3>
            <ul>
              <li><strong>We'll arrive during your scheduled time window</strong> - Our team will call 30 minutes before arrival</li>
              <li><strong>Vehicle inspection</strong> - Quick verification of the condition as described</li>
              <li><strong>Complete paperwork</strong> - We'll handle all the documents on-site</li>
              <li><strong>Get paid immediately</strong> - You'll receive $${offerAmount.toLocaleString()} via your preferred payment method</li>
            </ul>
          </div>

          <div class="important-box">
            <p><strong>⚡ Important:</strong> Please have your title and photo ID ready. If you need to reschedule or cancel, you can do so anytime using your access token.</p>
          </div>

          <div style="text-align: center; margin: 25px 0;">
            <a href="${manageUrl}" class="cta-button">
              Manage Your Pickup →
            </a>
          </div>

          <div style="background: #f3f4f6; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px; color: #374151;">
              <strong>Need to make changes?</strong> Use your access token: <strong style="font-family: 'Courier New', monospace; color: #1e40af;">${accessToken}</strong> to reschedule or cancel anytime.
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>PNW Cash for Cars</strong></p>
          <p>Questions? Call us at (971) 398-7852 or reply to this email</p>
          <p style="margin-top: 15px; font-size: 12px;">
            Quote ID: ${quoteId} | Access Token: ${accessToken}
          </p>
          <p style="margin-top: 10px; font-size: 12px; color: #9ca3af;">
            This is a confirmation of your accepted offer and scheduled pickup. 
            We look forward to serving you!
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text version for fallback
export const generatePickupScheduledConfirmationText = ({
  customerName,
  quoteId,
  vehicleName,
  offerAmount,
  scheduledDate,
  pickupWindow,
  pickupTimeRange,
  pickupAddress,
  contactPhone,
  specialInstructions,
  accessToken,
}) => {
  const formattedDate = new Date(scheduledDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const manageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/manage/${accessToken}`;

  return `
✅ PICKUP CONFIRMED!

Congratulations, ${customerName}!

Your vehicle pickup has been successfully scheduled. You've accepted our offer and we're ready to complete the transaction.

💰 ACCEPTED OFFER: $${offerAmount.toLocaleString()}
🆔 Quote ID: ${quoteId}

📅 PICKUP DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Date: ${formattedDate}
Time Window: ${pickupWindow.charAt(0).toUpperCase() + pickupWindow.slice(1)} (${pickupTimeRange})
Contact Phone: ${contactPhone}

📍 PICKUP LOCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${pickupAddress}

${specialInstructions ? `
📝 SPECIAL INSTRUCTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${specialInstructions}
` : ''}

🚙 VEHICLE INFORMATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vehicle: ${vehicleName}
Offer Amount: $${offerAmount.toLocaleString()}

✨ WHAT HAPPENS NEXT?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. We'll arrive during your scheduled time window
   → Our team will call 30 minutes before arrival

2. Vehicle inspection
   → Quick verification of the condition as described

3. Complete paperwork
   → We'll handle all the documents on-site

4. Get paid immediately
   → You'll receive $${offerAmount.toLocaleString()} via your preferred payment method

⚡ IMPORTANT: Please have your title and photo ID ready. 

🔧 NEED TO MAKE CHANGES?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Access Token: ${accessToken}
Manage Your Pickup: ${manageUrl}

You can reschedule or cancel anytime using your access token.

📞 QUESTIONS?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Call us at (971) 398-7852 or reply to this email

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PNW Cash for Cars
Quote ID: ${quoteId} | Access Token: ${accessToken}

This is a confirmation of your accepted offer and scheduled pickup.
We look forward to serving you!
  `.trim();
};

