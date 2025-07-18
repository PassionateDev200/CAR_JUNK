/**route: src/lib/email-templates/rescheduleConfirmation.js */

// Generate HTML email template for reschedule confirmation
export const generateRescheduleConfirmationHTML = ({
  customerName,
  quoteId,
  vehicleName,
  originalDate,
  originalTime,
  newDate,
  newTime,
  reason,
  rescheduledAt,
}) => {
  const rescheduleDate = new Date(rescheduledAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedOriginalDate = originalDate
    ? new Date(originalDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not set";

  const formattedNewDate = new Date(newDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reasonLabels = {
    schedule_conflict: "Schedule conflict",
    weather_concerns: "Weather concerns",
    location_change: "Location change",
    personal_emergency: "Personal emergency",
    vehicle_accessibility: "Vehicle accessibility",
    other: "Other reason",
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pickup Rescheduled - ${quoteId}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .reschedule-box { background: #f0f9ff; border: 2px solid #3B82F6; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
        .vehicle-details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .schedule-comparison { background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .schedule-item { display: flex; justify-content: space-between; padding: 10px 0; }
        .old-schedule { color: #dc2626; text-decoration: line-through; }
        .new-schedule { color: #16a34a; font-weight: bold; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .important-note { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #3B82F6; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 Pickup Rescheduled</h1>
          <p>Hi ${customerName}, your pickup has been successfully rescheduled</p>
        </div>
        
        <div class="content">
          <div class="reschedule-box">
            <h2 style="margin: 0; color: #1d4ed8;">Pickup Rescheduled</h2>
            <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
              Quote ID: ${quoteId}
            </p>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">
              Rescheduled on: ${rescheduleDate}
            </p>
          </div>

          <div class="schedule-comparison">
            <h3 style="margin-top: 0; color: #1f2937;">📊 Schedule Changes</h3>
            <div class="schedule-item">
              <span><strong>Original:</strong></span>
              <span class="old-schedule">${formattedOriginalDate} at ${
    originalTime || "Not set"
  }</span>
            </div>
            <div class="schedule-item">
              <span><strong>New:</strong></span>
              <span class="new-schedule">${formattedNewDate} at ${newTime}</span>
            </div>
            <div class="schedule-item">
              <span><strong>Reason:</strong></span>
              <span>${reasonLabels[reason] || reason}</span>
            </div>
          </div>

          <div class="vehicle-details">
            <h3 style="margin-top: 0; color: #1f2937;">🚙 Vehicle Details</h3>
            <div class="detail-row">
              <strong>Vehicle:</strong> <span>${vehicleName}</span>
            </div>
            <div class="detail-row">
              <strong>Quote ID:</strong> <span>${quoteId}</span>
            </div>
            <div class="detail-row">
              <strong>Status:</strong> <span style="color: #3B82F6; font-weight: bold;">Rescheduled</span>
            </div>
          </div>

          <div class="important-note">
            <h3 style="margin-top: 0; color: #1f2937;">📋 Important Reminders</h3>
            <ul style="margin: 10px 0; color: #374151;">
              <li>Please be available at the new scheduled time</li>
              <li>Have your vehicle title and ID ready</li>
              <li>Remove all personal belongings from the vehicle</li>
              <li>Our driver will call you 30 minutes before arrival</li>
              <li>Payment will be made immediately upon pickup</li>
            </ul>
          </div>

          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #22c55e;">
            <h3 style="margin-top: 0; color: #1f2937;">✅ What's Next</h3>
            <p style="margin: 10px 0; color: #374151;">
              We've updated your pickup schedule. Our team will contact you closer to the pickup date 
              to confirm the appointment and provide any additional instructions.
            </p>
          </div>

          <div style="background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p style="margin: 0; color: #92400e;">
              <strong>⏰ Need to Change Again?</strong> If you need to make another change, 
              please contact us as soon as possible at (971) 398-7852.
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>PNW Cash for Cars</strong></p>
          <p>Questions? Reply to this email or call us at (971) 398-7852</p>
          <p style="font-size: 12px; margin-top: 20px;">
            Thank you for working with PNW Cash for Cars. We appreciate your flexibility.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text version for fallback
export const generateRescheduleConfirmationText = ({
  customerName,
  quoteId,
  vehicleName,
  originalDate,
  originalTime,
  newDate,
  newTime,
  reason,
  rescheduledAt,
}) => {
  const rescheduleDate = new Date(rescheduledAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedOriginalDate = originalDate
    ? new Date(originalDate).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not set";

  const formattedNewDate = new Date(newDate).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const reasonLabels = {
    schedule_conflict: "Schedule conflict",
    weather_concerns: "Weather concerns",
    location_change: "Location change",
    personal_emergency: "Personal emergency",
    vehicle_accessibility: "Vehicle accessibility",
    other: "Other reason",
  };

  return `
Pickup Rescheduled Successfully

Hi ${customerName},

Your pickup has been successfully rescheduled.

RESCHEDULE DETAILS:
- Vehicle: ${vehicleName}
- Quote ID: ${quoteId}
- Rescheduled on: ${rescheduleDate}
- Reason: ${reasonLabels[reason] || reason}

SCHEDULE CHANGES:
- Original: ${formattedOriginalDate} at ${originalTime || "Not set"}
- New: ${formattedNewDate} at ${newTime}

IMPORTANT REMINDERS:
✓ Please be available at the new scheduled time
✓ Have your vehicle title and ID ready
✓ Remove all personal belongings from the vehicle
✓ Our driver will call you 30 minutes before arrival
✓ Payment will be made immediately upon pickup

WHAT'S NEXT:
We've updated your pickup schedule. Our team will contact you closer to the pickup date 
to confirm the appointment and provide any additional instructions.

NEED TO CHANGE AGAIN?
If you need to make another change, please contact us as soon as possible at (971) 398-7852.

Questions? Reply to this email or call us at (971) 398-7852

Thank you for working with PNW Cash for Cars. We appreciate your flexibility.

Best regards,
PNW Cash for Cars Team
  `.trim();
};
