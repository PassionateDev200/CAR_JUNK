/**route: src/models/Notification.js */

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "quote_cancelled",
        "pickup_rescheduled",
        "contact_updated",
        "new_quote",
        "quote_expired",
        "system_alert",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    quoteId: {
      type: String,
      required: false,
    },
    customerName: {
      type: String,
      required: false,
    },
    vehicleName: {
      type: String,
      required: false,
    },
    read: {
      type: Boolean,
      default: false,
    },
    adminUserId: {
      type: String,
      required: false,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
notificationSchema.index({ read: 1, createdAt: -1 });
notificationSchema.index({ type: 1 });
notificationSchema.index({ adminUserId: 1 });

export default mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
