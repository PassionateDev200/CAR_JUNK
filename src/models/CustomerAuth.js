/** route: src/models/CustomerAuth.js */

import mongoose from "mongoose";

const customerAuthSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    customerId: { type: String }, // optional link to Customer if/when created
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

customerAuthSchema.index({ email: 1 }, { unique: true });

export default mongoose.models.CustomerAuth ||
  mongoose.model("CustomerAuth", customerAuthSchema);





