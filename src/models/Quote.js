/** route: src/models/Quote.js */

import mongoose from "mongoose";

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
      zipCode: { type: String, required: false }, // ✅ Make optional since it's in locationData
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

    // ✅ FIXED: Condition Answers - Updated to match frontend data structure
    conditionAnswers: {
      // Location and ownership
      zipcode: {
        zipCode: String,
        locationData: mongoose.Schema.Types.Mixed,
      },
      ownership: {
        type: String,
        enum: ["own_outright", "loan_payments", "lease_payments"], // ✅ Updated enum values
        required: true,
      },

      // Title status
      title: {
        type: String,
        enum: ["clean_title", "salvage_rebuilt", "no_title"], // ✅ Updated enum values
        required: true,
      },

      // Vehicle condition
      wheels_tires: {
        type: String,
        enum: [
          "all_inflated_attached",
          "one_or_more_flat",
          "one_or_more_missing",
        ], // ✅ Updated enum values
        required: true,
      },

      battery: {
        type: String,
        enum: ["battery_works", "no_battery"], // ✅ Updated enum values
        required: true,
      },

      // ✅ FIXED: Changed from "keys" to "key" to match frontend
      key: {
        type: String,
        enum: ["have_key", "no_key"], // ✅ Updated enum values
        required: true,
      },

      drivability: {
        type: String,
        enum: ["starts_and_drives", "starts_not_drive", "doesnt_start"], // ✅ Updated enum values
        required: true,
      },

      engine_transmission: {
        type: String,
        enum: [
          "engine_transmission_intact",
          "missing_parts",
          "engine_transmission_missing",
        ], // ✅ Updated enum values
        required: true,
      },

      // ✅ FIXED: Mileage can be object or string
      mileage: {
        type: mongoose.Schema.Types.Mixed, // Allows both object and string
        required: true,
      },

      exterior_damage: {
        type: String,
        enum: ["no_major_damage", "has_damage"], // ✅ Updated enum values
        required: true,
      },

      missing_parts: {
        type: String,
        enum: ["all_parts_attached", "missing_parts"], // ✅ Updated enum values
        required: true,
      },

      mirrors_glass_lights: {
        type: String,
        enum: ["all_intact", "damaged_missing"], // ✅ Updated enum values
        required: true,
      },

      catalytic_converter: {
        type: String,
        enum: ["attached", "missing"], // ✅ Updated enum values
        required: true,
      },

      airbags: {
        type: String,
        enum: ["intact", "deployed"], // ✅ Updated enum values
        required: true,
      },

      interior: {
        type: String,
        enum: ["good_condition", "damaged_missing"], // ✅ Updated enum values
        required: true,
      },

      flood_fire: {
        type: String,
        enum: ["no_flood_fire", "flood_fire_damage"], // ✅ Updated enum values
        required: true,
      },

      // Sub-question location arrays
      wheels_tires_location: { type: [String], default: [] },
      exterior_damage_location: { type: [String], default: [] },
      missing_parts_location: { type: [String], default: [] },
      mirrors_glass_lights_location: { type: [String], default: [] },
    },

    // Quote Status
    status: {
      type: String,
      enum: ["pending", "accepted", "expired", "cancelled"],
      default: "pending",
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
  },
  {
    timestamps: true,
  }
);

// Remove duplicate indexes
quoteSchema.index({ "customer.email": 1 });
quoteSchema.index({ "customer.zipCode": 1 });
quoteSchema.index({ status: 1 });
quoteSchema.index({ createdAt: -1 });
quoteSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
