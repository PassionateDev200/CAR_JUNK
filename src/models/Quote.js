/** route: src/models/Quote.js */

import mongoose from "mongoose";

// ✅ Generate exactly 6 alphanumeric characters for Access Token
function generateAccessToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// ✅ Generate exactly 6 alphanumeric characters for Quote ID
function generateQuoteId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

const quoteSchema = new mongoose.Schema(
  {
    // ✅ UPDATED: Quote Identification with 6-character generation
    quoteId: {
      type: String,
      required: true,
      unique: true,
      default: generateQuoteId,
    },

    // Vehicle Information
    vehicleDetails: {
      year: { type: Number, required: true },
      make: { type: String, required: true },
      model: { type: String, required: true },
      trim: { type: String, default: "" },
    },
    vin: { type: String, default: "" },

    // Customer Information
    customer: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, default: "" },
      zipCode: { type: String, required: false },
    },

    // Location Data
    locationData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Pricing Information
    pricing: {
      basePrice: { type: Number, required: true },
      currentPrice: { type: Number, required: true },
      finalPrice: { type: Number, default: 0 },
    },

    // Condition Answers
    conditionAnswers: {
      // Location and ownership
      zipcode: {
        zipCode: String,
        locationData: mongoose.Schema.Types.Mixed,
      },
      ownership: {
        type: String,
        enum: ["own_outright", "loan_payments", "lease_payments"],
        required: true,
      },
      // Title status
      title: {
        type: String,
        enum: ["clean_title", "salvage_rebuilt", "no_title"],
        required: true,
      },
      // Vehicle condition
      wheels_tires: {
        type: String,
        enum: [
          "all_inflated_attached",
          "one_or_more_flat",
          "one_or_more_missing",
        ],
        required: true,
      },
      battery: {
        type: String,
        enum: ["battery_works", "no_battery"],
        required: true,
      },
      key: {
        type: String,
        enum: ["have_key", "no_key"],
        required: true,
      },
      drivability: {
        type: String,
        enum: ["starts_and_drives", "starts_not_drive", "doesnt_start"],
        required: true,
      },
      engine_transmission: {
        type: String,
        enum: [
          "engine_transmission_intact",
          "missing_parts",
          "engine_transmission_missing",
        ],
        required: true,
      },
      mileage: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
      exterior_damage: {
        type: String,
        enum: ["no_major_damage", "has_damage"],
        required: true,
      },
      missing_parts: {
        type: String,
        enum: ["all_parts_attached", "missing_parts"],
        required: true,
      },
      mirrors_glass_lights: {
        type: String,
        enum: ["all_intact", "damaged_missing"],
        required: true,
      },
      catalytic_converter: {
        type: String,
        enum: ["attached", "missing"],
        required: true,
      },
      airbags: {
        type: String,
        enum: ["intact", "deployed"],
        required: true,
      },
      interior: {
        type: String,
        enum: ["good_condition", "damaged_missing"],
        required: true,
      },
      flood_fire: {
        type: String,
        enum: ["no_flood_fire", "flood_fire_damage"],
        required: true,
      },
      // Sub-question location arrays
      wheels_tires_location: { type: [String], default: [] },
      exterior_damage_location: { type: [String], default: [] },
      missing_parts_location: { type: [String], default: [] },
      mirrors_glass_lights_location: { type: [String], default: [] },
    },

    // Quote Status - Enhanced with customer action statuses
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "expired",
        "cancelled",
        "customer_cancelled", // Customer initiated cancellation
        "pickup_scheduled", // Pickup date/time confirmed
        "rescheduled", // Customer rescheduled pickup
        "completed", // Transaction completed
      ],
      default: "pending",
    },

    // ✅ ENHANCED: Customer Action Management
    customerActions: {
      // Permission flags
      canCancel: { type: Boolean, default: true },
      canReschedule: { type: Boolean, default: false }, // true when accepted

      // Cancellation details
      cancellationReason: {
        type: String,
        enum: [
          "changed_mind",
          "found_better_offer",
          "vehicle_sold_elsewhere",
          "family_decision",
          "financial_reasons",
          "timing_issues",
          "other",
        ],
        default: null,
      },
      cancellationNote: { type: String, default: "" },
      cancelledAt: { type: Date, default: null },

      // Rescheduling details
      originalPickupDate: { type: Date, default: null },
      originalPickupTime: { type: String, default: null },
      rescheduledDate: { type: Date, default: null },
      rescheduledTime: { type: String, default: null },
      rescheduleReason: {
        type: String,
        enum: [
          "schedule_conflict",
          "weather_concerns",
          "location_change",
          "personal_emergency",
          "vehicle_accessibility",
          "other",
        ],
        default: null,
      },
      rescheduleNote: { type: String, default: "" },
      rescheduledAt: { type: Date, default: null },

      // ✅ FIXED: Action history for audit trail with "created" enum value
      actionHistory: [
        {
          action: {
            type: String,
            enum: [
              "created", // ✅ Added to fix validation error
              "cancelled",
              "rescheduled",
              "modified",
              "accepted",
              "pickup_scheduled",
              "completed",
            ],
            required: true,
          },
          reason: String,
          note: String,
          timestamp: { type: Date, default: Date.now },
          customerInitiated: { type: Boolean, default: false },
          adminUserId: String, // Track which admin made changes
          details: mongoose.Schema.Types.Mixed, // Store additional action-specific data
        },
      ],
    },

    // Enhanced Pickup Details
    pickupDetails: {
      scheduledDate: { type: Date, default: null },
      scheduledTime: { type: String, default: null },
      timeSlot: {
        type: String,
        enum: ["morning", "afternoon", "evening", "flexible"],
        default: "flexible",
      },
      pickupWindow: {
        type: String,
        enum: ["morning", "afternoon", "evening"],
        default: null,
      },
      pickupTimeRange: { type: String, default: null },
      address: { type: String, default: "" },
      addressType: {
        type: String,
        enum: ["residence", "business"],
        default: "residence",
      },
      structuredAddress: {
        street: { type: String, default: "" },
        city: { type: String, default: "" },
        state: { type: String, default: "" },
        zipCode: { type: String, default: "" },
      },
      specialInstructions: { type: String, default: "" },
      contactName: { type: String, default: "" },
      contactPhone: { type: String, default: "" },
      alternateContact: {
        name: String,
        phone: String,
        relationship: String,
      },
      confirmedAt: { type: Date, default: null },
      completedAt: { type: Date, default: null },
    },

    // Generated vehicle name for display
    vehicleName: {
      type: String,
      default: function () {
        return `${this.vehicleDetails.year} ${this.vehicleDetails.make} ${this.vehicleDetails.model}`.trim();
      },
    },

    // Expiration date (7 days from creation)
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },

    // Communication log
    communications: [
      {
        type: { type: String, enum: ["email", "sms", "phone"] },
        content: String,
        sentAt: { type: Date, default: Date.now },
        successful: { type: Boolean, default: false },
      },
    ],

    // ✅ UPDATED: Customer access token with 6-character generation
    accessToken: {
      type: String,
      default: generateAccessToken,
      unique: true, // ✅ Only this index declaration needed (removed duplicate)
    },

    // ✅ NEW: Question pricing breakdown for transparency
    questionPricing: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Enhanced Indexes (removed duplicate accessToken index)
quoteSchema.index({ "customer.email": 1 });
quoteSchema.index({ "customer.zipCode": 1 });
quoteSchema.index({ status: 1 });
quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// Removed duplicate: quoteSchema.index({ accessToken: 1 }); // Already handled by unique: true
quoteSchema.index({ "customerActions.cancelledAt": 1 }); // For cancellation tracking
quoteSchema.index({ "pickupDetails.scheduledDate": 1 }); // For pickup scheduling
quoteSchema.index({ "customerActions.actionHistory.timestamp": -1 }); // For activity feeds

// ✅ UPDATED: Enhanced instance methods for customer actions
quoteSchema.methods.canCustomerCancel = function () {
  // Customers can cancel quotes unless they're already cancelled, expired, or completed
  const nonCancellableStatuses = [
    "customer_cancelled",
    "cancelled",
    "expired",
    "completed",
  ];
  const isNotExpired = !this.expiresAt || new Date() <= this.expiresAt;

  return !nonCancellableStatuses.includes(this.status) && isNotExpired;
};

quoteSchema.methods.canCustomerReschedule = function () {
  // Can reschedule if quote is accepted or pickup is scheduled and not expired
  const reschedulableStatuses = ["accepted", "pickup_scheduled", "rescheduled"];
  const isNotExpired = !this.expiresAt || new Date() <= this.expiresAt;

  return (
    this.customerActions.canReschedule &&
    reschedulableStatuses.includes(this.status) &&
    isNotExpired
  );
};

quoteSchema.methods.addActionHistory = function (action, details = {}) {
  this.customerActions.actionHistory.push({
    action,
    reason: details.reason || "",
    note: details.note || "",
    customerInitiated: details.customerInitiated || false,
    adminUserId: details.adminUserId || null,
    details: details.additionalData || {},
    timestamp: new Date(),
  });
};

// ✅ NEW: Helper method to check if quote is expired
quoteSchema.methods.isExpired = function () {
  return this.expiresAt && new Date() > this.expiresAt;
};

// ✅ NEW: Helper method to get quote age in days
quoteSchema.methods.getAgeInDays = function () {
  const now = new Date();
  const created = new Date(this.createdAt);
  const diffInMs = now - created;
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};

// ✅ NEW: Helper method to get remaining days until expiration
quoteSchema.methods.getDaysUntilExpiration = function () {
  if (!this.expiresAt) return null;
  const now = new Date();
  const expires = new Date(this.expiresAt);
  const diffInMs = expires - now;
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
};

// ✅ NEW: Static method to find quotes expiring soon
quoteSchema.statics.findExpringSoon = function (days = 1) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() + days);

  return this.find({
    expiresAt: { $lte: cutoffDate },
    status: {
      $nin: ["expired", "completed", "cancelled", "customer_cancelled"],
    },
  });
};

// ✅ NEW: Pre-save middleware to ensure vehicleName is set
quoteSchema.pre("save", function (next) {
  if (
    this.vehicleDetails &&
    this.vehicleDetails.year &&
    this.vehicleDetails.make &&
    this.vehicleDetails.model
  ) {
    this.vehicleName =
      `${this.vehicleDetails.year} ${this.vehicleDetails.make} ${this.vehicleDetails.model}`.trim();
  }
  next();
});

export default mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
