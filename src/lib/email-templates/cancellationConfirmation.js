/**route: src/lib/email-templates/cancellationConfirmation.js*/

// Generate HTML email template for cancellation confirmation
export const generateCancellationConfirmationHTML = ({
  customerName,
  quoteId,
  vehicleName,
  reason,
  cancelledAt,
}) => {
  const cancelDate = new Date(cancelledAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reasonLabels = {
    changed_mind: "Changed mind",
    found_better_offer: "Found a better offer",
    vehicle_sold_elsewhere: "Sold vehicle elsewhere",
    family_decision: "Family decision",
    financial_reasons: "Financial reasons",
    timing_issues: "Timing issues",
    other: "Other reason",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Quote Cancellation Confirmation - ${quoteId}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #EF4444 0%, #DC2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .cancellation-box { background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .vehicle-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .cta-button { background: #3B82F6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .feedback-section { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Quote Cancellation Confirmed</h1>
          <p>Hi ${customerName}, your quote has been successfully cancelled</p>
        </div>
        
        <div class="content">
          <div class="cancellation-box">
            <h2 style="margin: 0; color: #dc2626;">Quote Cancelled</h2>
            <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
              Quote ID: ${quoteId}
            </p>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
              Cancelled on: ${cancelDate}
            </p>
          </div>

          <div class="vehicle-details">
            <h3 style="margin-top: 0; color: #1f2937;">🚙 Cancelled Quote Details</h3>
            <div class="detail-row">
              <strong>Vehicle:</strong> <span>${vehicleName}</span>
            </div>
            <div class="detail-row">
              <strong>Quote ID:</strong> <span>${quoteId}</span>
            </div>
            <div class="detail-row">
              <strong>Reason:</strong> <span>${
                reasonLabels[reason] || reason
              }</span>
            </div>
            <div class="detail-row">
              <strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">Cancelled</span>
            </div>
          </div>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6;">
            <h3 style="margin-top: 0; color: #1f2937;">💡 What This Means</h3>
            <ul style="margin: 10px 0; color: #374151;">
              <li>Your quote is now cancelled and no longer valid</li>
              <li>No pickup will be scheduled for this vehicle</li>
              <li>You will not receive any further communications about this quote</li>
              <li>You're welcome to get a new quote anytime in the future</li>
            </ul>
          </div>

          <div class="feedback-section">
            <h3 style="margin-top: 0; color: #1f2937;">🔄 Changed Your Mind?</h3>
            <p style="margin: 10px 0; color: #374151;">
              If you decide to sell your vehicle in the future, we'd love to help you again. 
              Getting a new quote is quick and easy!
            </p>
            <div style="text-align: center;">
              <a href="${
                process.env.NEXT_PUBLIC_BASE_URL || "http://107.172.232.68:3000"
              }/quote" class="cta-button">
                Get New Quote →
              </a>
            </div>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>📝 Feedback:</strong> We're always looking to improve our service. 
              If you have any feedback about your experience, we'd love to hear from you.
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>PNW Cash for Cars</strong></p>
          <p>Questions? Reply to this email or call us at (971) 398-7852</p>
          <p style="font-size: 12px; margin-top: 20px;">
            Thank you for considering PNW Cash for Cars. We're here whenever you're ready to sell.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text version for fallback
export const generateCancellationConfirmationText = ({
  customerName,
  quoteId,
  vehicleName,
  reason,
  cancelledAt,
}) => {
  const cancelDate = new Date(cancelledAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reasonLabels = {
    changed_mind: "Changed mind",
    found_better_offer: "Found a better offer",
    vehicle_sold_elsewhere: "Sold vehicle elsewhere",
    family_decision: "Family decision",
    financial_reasons: "Financial reasons",
    timing_issues: "Timing issues",
    other: "Other reason",
  };

  return `
Quote Cancellation Confirmed

Hi ${customerName},

Your quote has been successfully cancelled.

CANCELLATION DETAILS:
- Vehicle: ${vehicleName}
- Quote ID: ${quoteId}
- Cancelled on: ${cancelDate}
- Reason: ${reasonLabels[reason] || reason}
- Status: CANCELLED

WHAT THIS MEANS:
✓ Your quote is now cancelled and no longer valid
✓ No pickup will be scheduled for this vehicle
✓ You will not receive further communications about this quote
✓ You're welcome to get a new quote anytime in the future

CHANGED YOUR MIND?
If you decide to sell your vehicle in the future, we'd love to help you again. 
Getting a new quote is quick and easy!

Get a new quote: ${
    process.env.NEXT_PUBLIC_BASE_URL || "http://107.172.232.68:3000"
  }/quote

We're always looking to improve our service. If you have any feedback about your experience, we'd love to hear from you.

Questions? Reply to this email or call us at (971) 398-7852

Thank you for considering PNW Cash for Cars. We're here whenever you're ready to sell.

Best regards,
PNW Cash for Cars Team
  `.trim();
};
