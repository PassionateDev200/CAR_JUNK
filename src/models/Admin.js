/** route: src/models/Admin.js */
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["super_admin", "manager", "sales_agent", "driver"],
    default: "sales_agent",
  },
  permissions: [
    {
      type: String,
      enum: ["quotes", "customers", "pickups", "analytics", "settings"],
    },
  ],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Admin || mongoose.model("Admin", adminSchema);
