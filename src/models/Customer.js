/** route: src/models/Customer.js */

import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true, // ✅ Keep this, remove the explicit index below
      default: () =>
        `CUST-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 4)
          .toUpperCase()}`,
    },

    // Personal Information
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true, // ✅ Keep this, remove the explicit index below
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: { type: String, required: true },
    address: String,
    zipCode: String,

    // Customer Status
    status: {
      type: String,
      enum: ["active", "completed", "inactive", "blocked"],
      default: "active",
    },

    // Activity Statistics
    totalQuotes: { type: Number, default: 0 },
    completedDeals: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },

    // Communication Preferences
    preferences: {
      emailNotifications: { type: Boolean, default: true },
      smsNotifications: { type: Boolean, default: false },
      preferredContactMethod: {
        type: String,
        enum: ["email", "phone", "sms"],
        default: "email",
      },
    },

    // Notes and Tags
    notes: String,
    tags: [String],

    // Timestamps
    lastActivity: { type: Date, default: Date.now },
    joinDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// ✅ FIXED: Remove duplicate indexes, keep only non-duplicate ones
// customerSchema.index({ email: 1 }); // ❌ REMOVE: Duplicate with unique: true
// customerSchema.index({ customerId: 1 }); // ❌ REMOVE: Duplicate with unique: true
customerSchema.index({ status: 1 }); // ✅ KEEP: Not duplicate
customerSchema.index({ lastActivity: -1 }); // ✅ KEEP: Not duplicate

export default mongoose.models.Customer ||
  mongoose.model("Customer", customerSchema);
