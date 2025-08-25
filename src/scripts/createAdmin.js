/** route: src/scripts/createAdmin.js */
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
const envPath = join(__dirname, "../../.env.local");
dotenv.config({ path: envPath });

console.log("🔧 Environment file path:", envPath);
console.log(
  "🔗 MongoDB URI loaded:",
  process.env.MONGODB_URI ? "Yes ✅" : "No ❌"
);

// MongoDB connection function
async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    throw new Error(
      "MONGODB_URI environment variable is not loaded. Check your .env.local file."
    );
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
    });
    return mongoose.connection;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    throw error;
  }
}

// Admin schema
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

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

async function createDefaultAdmin() {
  try {
    console.log("🚀 Starting admin creation process...");
    console.log("📁 Working directory:", process.cwd());

    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in environment variables");
      console.log("💡 Make sure .env.local exists in the root directory");
      console.log("💡 Current env vars check:");
      console.log(
        "   - MONGODB_URI:",
        process.env.MONGODB_URI ? "Found" : "Missing"
      );
      console.log(
        "   - JWT_SECRET:",
        process.env.JWT_SECRET ? "Found" : "Missing"
      );
      process.exit(1);
    }

    console.log("🔗 Connecting to database...");
    await connectToDatabase();
    console.log("✅ Database connected successfully");

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      email: "admin@pnwcashforcars.com",
    });

    if (existingAdmin) {
      console.log("⚠️  Default admin already exists");
      console.log("📧 Email: admin@pnwcashforcars.com");
      console.log("🔑 Use existing password or reset if needed");
      console.log("🌐 Login at: http://107.172.232.68:3000/admin/login");
      return;
    }

    console.log("🔐 Creating admin user...");
    const hashedPassword = await bcrypt.hash("TempPassword123!", 12);

    const admin = new Admin({
      email: "admin@pnwcashforcars.com",
      password: hashedPassword,
      name: "Super Admin",
      role: "super_admin",
      permissions: ["quotes", "customers", "pickups", "analytics", "settings"],
      isActive: true,
    });

    await admin.save();
    console.log("🎉 Default admin created successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📧 Email: admin@pnwcashforcars.com");
    console.log("🔑 Password: TempPassword123!");
    console.log("🌐 Login URL: http://107.172.232.68:3000/admin/login");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("⚠️  Please change the default password after first login!");
  } catch (error) {
    console.error("❌ Error creating admin:", error);

    if (error.message.includes("MONGODB_URI")) {
      console.log("\n💡 Solution: Make sure your .env.local file contains:");
      console.log("MONGODB_URI=your_mongodb_connection_string");
    }

    if (error.code === 11000) {
      console.log("\n💡 Admin user already exists in database");
    }

    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database disconnected");
    process.exit(0);
  }
}

createDefaultAdmin();
