/** route: src/app/api/admin/auth/login/route.js */
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// Simple connection
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }
  return mongoose.connect(process.env.MONGODB_URI);
}

// Admin schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  name: { type: String, required: true },
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
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  createdAt: { type: Date, default: Date.now },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

export async function POST(request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    console.log("🔍 Login attempt for:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find admin user
    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      console.log("❌ Admin not found:", email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("✅ Admin found:", admin.email);

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        { error: "Account is deactivated" },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      console.log("❌ Invalid password for:", email);
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    console.log("✅ Password valid for:", email);

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create JWT token
    const token = jwt.sign(
      {
        adminId: admin._id,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
      },
      process.env.JWT_SECRET ||
        "your-super-secret-jwt-key-here-make-it-long-and-random",
      { expiresIn: "24h" }
    );

    console.log("✅ Login successful for:", email);

    // Return success response
    const adminData = {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
      permissions: admin.permissions,
      lastLogin: admin.lastLogin,
    };

    return NextResponse.json({
      success: true,
      admin: adminData,
      token,
    });
  } catch (error) {
    console.error("❌ Admin login error:", error);
    return NextResponse.json(
      { error: "Login failed: " + error.message },
      { status: 500 }
    );
  }
}
