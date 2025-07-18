/** route: src/models/Quote.js */

import mongoose from "mongoose";
import { randomBytes } from "crypto";

const quoteSchema = new mongoose.Schema(
  {
    // Quote Identification
    quoteId: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        `Q-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 4)
          .toUpperCase()}`,
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

    // Quote Status - UPDATED with new statuses
    status: {
      type: String,
      enum: [
        "pending",
        "accepted",
        "expired",
        "cancelled",
        "customer_cancelled", // NEW: Customer initiated cancellation
        "pickup_scheduled", // NEW: Pickup date/time confirmed
        "rescheduled", // NEW: Customer rescheduled pickup
        "completed", // NEW: Transaction completed
      ],
      default: "pending",
    },

    // NEW: Customer Action Management
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

      // Action history for audit trail
      actionHistory: [
        {
          action: {
            type: String,
            enum: [
              "created",
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

    // NEW: Pickup Details - Enhanced
    pickupDetails: {
      scheduledDate: { type: Date, default: null },
      scheduledTime: { type: String, default: null },
      timeSlot: {
        type: String,
        enum: ["morning", "afternoon", "evening", "flexible"],
        default: "flexible",
      },
      address: { type: String, default: "" },
      specialInstructions: { type: String, default: "" },
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

    // Customer access token for secure quote management
    accessToken: {
      type: String,
      default: "",
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enhanced Indexes
quoteSchema.index({ "customer.email": 1 });
quoteSchema.index({ "customer.zipCode": 1 });
quoteSchema.index({ status: 1 });
quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
// quoteSchema.index({ accessToken: 1 }); // NEW: For secure quote access
quoteSchema.index({ "customerActions.cancelledAt": 1 }); // NEW: For cancellation tracking
quoteSchema.index({ "pickupDetails.scheduledDate": 1 }); // NEW: For pickup scheduling

// NEW: Instance methods for customer actions
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
  return (
    this.customerActions.canReschedule &&
    ["accepted", "pickup_scheduled"].includes(this.status)
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
  });
};

export default mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
