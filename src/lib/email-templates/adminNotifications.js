/**route: src/lib/email-templates/adminNotifications.js */

// Generate HTML email template for admin notifications
export const generateAdminNotificationHTML = ({
  type,
  quoteId,
  customerName,
  vehicleName,
  actionType,
  details,
}) => {
  const getTypeInfo = (type) => {
    switch (type) {
      case "quote_cancelled":
        return {
          title: "Quote Cancelled",
          color: "#ef4444",
          bgColor: "#fef2f2",
          icon: "🚫",
        };
      case "pickup_rescheduled":
        return {
          title: "Pickup Rescheduled",
          color: "#3b82f6",
          bgColor: "#eff6ff",
          icon: "📅",
        };
      case "contact_updated":
        return {
          title: "Contact Info Updated",
          color: "#10b981",
          bgColor: "#f0fdf4",
          icon: "📝",
        };
      case "new_quote":
        return {
          title: "New Quote Submitted",
          color: "#8b5cf6",
          bgColor: "#f5f3ff",
          icon: "🆕",
        };
      default:
        return {
          title: "Customer Action",
          color: "#6b7280",
          bgColor: "#f9fafb",
          icon: "📋",
        };
    }
  };

  const typeInfo = getTypeInfo(type);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Admin Notification - ${typeInfo.title}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1f2937 0%, #374151 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: white; padding: 30px; border: 1px solid #e5e7eb; }
        .notification-box { background: ${
          typeInfo.bgColor
        }; border: 2px solid ${
    typeInfo.color
  }; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .details-section { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .detail-row:last-child { border-bottom: none; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 14px; color: #6b7280; }
        .action-needed { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
        .timestamp { color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚨 Admin Notification</h1>
          <p>Customer action requires attention</p>
        </div>
        
        <div class="content">
          <div class="notification-box">
            <h2 style="margin: 0; color: ${typeInfo.color};">
              ${typeInfo.icon} ${typeInfo.title}
            </h2>
            <p style="margin: 10px 0 0 0; color: #6b7280; font-size: 14px;">
              Quote ID: ${quoteId}
            </p>
            <p class="timestamp">
              ${new Date().toLocaleString()}
            </p>
          </div>

          <div class="details-section">
            <h3 style="margin-top: 0; color: #1f2937;">📋 Action Details</h3>
            <div class="detail-row">
              <strong>Customer:</strong> <span>${customerName}</span>
            </div>
            <div class="detail-row">
              <strong>Vehicle:</strong> <span>${vehicleName}</span>
            </div>
            <div class="detail-row">
              <strong>Quote ID:</strong> <span>${quoteId}</span>
            </div>
            <div class="detail-row">
              <strong>Action Type:</strong> <span style="color: ${
                typeInfo.color
              }; font-weight: bold;">${actionType}</span>
            </div>
            ${
              details.reason
                ? `
            <div class="detail-row">
              <strong>Reason:</strong> <span>${details.reason.replace(
                /_/g,
                " "
              )}</span>
            </div>
            `
                : ""
            }
            ${
              details.note
                ? `
            <div class="detail-row">
              <strong>Note:</strong> <span>${details.note}</span>
            </div>
            `
                : ""
            }
          </div>

          ${
            type === "pickup_rescheduled"
              ? `
          <div class="details-section">
            <h3 style="margin-top: 0; color: #1f2937;">📅 Schedule Changes</h3>
            ${
              details.originalDate
                ? `
            <div class="detail-row">
              <strong>Original Date:</strong> <span>${new Date(
                details.originalDate
              ).toLocaleDateString()} at ${
                    details.originalTime || "Not set"
                  }</span>
            </div>
            `
                : ""
            }
            <div class="detail-row">
              <strong>New Date:</strong> <span>${new Date(
                details.newDate
              ).toLocaleDateString()} at ${details.newTime}</span>
            </div>
          </div>
          `
              : ""
          }

          ${
            type === "contact_updated"
              ? `
          <div class="details-section">
            <h3 style="margin-top: 0; color: #1f2937;">📝 Updated Information</h3>
            ${Object.entries(details)
              .map(
                ([key, value]) => `
            <div class="detail-row">
              <strong>${
                key.charAt(0).toUpperCase() + key.slice(1)
              }:</strong> <span>${value}</span>
            </div>
            `
              )
              .join("")}
          </div>
          `
              : ""
          }

          <div class="action-needed">
            <p style="margin: 0; color: #92400e;">
              <strong>⚡ Action Required:</strong> Please review this customer action and update the quote status in the admin dashboard if necessary.
            </p>
          </div>
        </div>

        <div class="footer">
          <p><strong>PNW Cash for Cars - Admin System</strong></p>
          <p>This is an automated notification from the quote management system.</p>
          <p style="font-size: 12px; margin-top: 20px;">
            Generated at ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Generate plain text version for admin notifications
export const generateAdminNotificationText = ({
  type,
  quoteId,
  customerName,
  vehicleName,
  actionType,
  details,
}) => {
  const getTypeTitle = (type) => {
    switch (type) {
      case "quote_cancelled":
        return "Quote Cancelled";
      case "pickup_rescheduled":
        return "Pickup Rescheduled";
      case "contact_updated":
        return "Contact Info Updated";
      case "new_quote":
        return "New Quote Submitted";
      default:
        return "Customer Action";
    }
  };

  let detailsText = "";

  if (type === "pickup_rescheduled") {
    detailsText = `
SCHEDULE CHANGES:
- Original: ${
      details.originalDate
        ? new Date(details.originalDate).toLocaleDateString() +
          " at " +
          (details.originalTime || "Not set")
        : "Not set"
    }
- New: ${new Date(details.newDate).toLocaleDateString()} at ${details.newTime}
    `;
  } else if (type === "contact_updated") {
    detailsText = `
UPDATED INFORMATION:
${Object.entries(details)
  .map(
    ([key, value]) =>
      `- ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`
  )
  .join("\n")}
    `;
  }

  return `
ADMIN NOTIFICATION: ${getTypeTitle(type)}

Customer action requires attention.

ACTION DETAILS:
- Customer: ${customerName}
- Vehicle: ${vehicleName}
- Quote ID: ${quoteId}
- Action Type: ${actionType}
${details.reason ? `- Reason: ${details.reason.replace(/_/g, " ")}` : ""}
${details.note ? `- Note: ${details.note}` : ""}

${detailsText}

ACTION REQUIRED:
Please review this customer action and update the quote status in the admin dashboard if necessary.

---
PNW Cash for Cars - Admin System
Generated at ${new Date().toLocaleString()}
This is an automated notification from the quote management system.
  `.trim();
};
