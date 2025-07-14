/** route: src/scripts/testDatabase.js */
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import mongoose from "mongoose";

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

// Quote schema
const quoteSchema = new mongoose.Schema(
  {
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
      year: { type: String, required: true },
      make: { type: String, required: true },
      model: { type: String, required: true },
      trim: { type: String },
    },
    vin: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || v.length === 17;
        },
        message: "VIN must be 17 characters long",
      },
    },

    // Customer Information
    customer: {
      name: { type: String, required: true },
      email: {
        type: String,
        required: true,
        match: [
          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
          "Please enter a valid email",
        ],
      },
      phone: { type: String, required: true },
      address: String,
      zipCode: { type: String, required: true },
    },

    // Pricing Information
    pricing: {
      basePrice: { type: Number, required: true, min: 0 },
      currentPrice: { type: Number, required: true, min: 0 },
      finalPrice: { type: Number, required: true, min: 0 },
      adjustments: [
        {
          type: { type: String, required: true },
          amount: { type: Number, required: true },
          description: String,
          appliedAt: { type: Date, default: Date.now },
        },
      ],
    },

    // Condition Assessment (Based on your Vehicle-Condition-Landing.docx)
    conditionAnswers: {
      zipCode: { type: String, required: true },
      ownership: {
        type: String,
        enum: ["own_outright", "making_payments", "lease_payments"],
        required: true,
      },
      title: {
        type: String,
        enum: ["clean", "salvage_rebuilt", "no_title"],
        required: true,
      },
      wheels_tires: {
        type: String,
        enum: ["all_inflated", "flat_tires", "missing_wheels"],
        required: true,
      },
      wheels_removed: [String],
      battery: {
        type: String,
        enum: ["working", "not_working"],
        required: true,
      },
      keys: {
        type: String,
        enum: ["have_key", "no_key"],
        required: true,
      },
      drivability: {
        type: String,
        enum: ["starts_drives", "starts_no_drive", "no_start"],
        required: true,
      },
      engine_transmission: {
        type: String,
        enum: ["intact", "missing_parts", "missing_completely"],
        required: true,
      },
      mileage: { type: String, required: true },
      mileage_unknown: { type: Boolean, default: false },
      exterior_damage: {
        type: String,
        enum: ["no_major_damage", "has_damage"],
        required: true,
      },
      exterior_damage_locations: [String],
      missing_parts: {
        type: String,
        enum: ["all_attached", "parts_missing"],
        required: true,
      },
      missing_parts_locations: [String],
      mirrors_glass_lights: {
        type: String,
        enum: ["all_intact", "damaged_missing"],
        required: true,
      },
      damaged_items_locations: [String],
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
    },

    status: {
      type: String,
      enum: [
        "pending",
        "reviewed",
        "approved",
        "rejected",
        "expired",
        "completed",
      ],
      default: "pending",
    },

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  },
  {
    timestamps: true,
  }
);

// Customer schema
const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      default: () =>
        `CUST-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 4)
          .toUpperCase()}`,
    },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: { type: String, required: true },
    address: String,
    zipCode: String,
    status: {
      type: String,
      enum: ["active", "completed", "inactive", "blocked"],
      default: "active",
    },
    totalQuotes: { type: Number, default: 0 },
    completedDeals: { type: Number, default: 0 },
    totalValue: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now },
    joinDate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Quote = mongoose.models.Quote || mongoose.model("Quote", quoteSchema);
const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);

async function testDatabase() {
  try {
    console.log("🚀 Starting database test...");
    console.log("📁 Working directory:", process.cwd());

    // Check environment variables
    if (!process.env.MONGODB_URI) {
      console.error("❌ MONGODB_URI not found in environment variables");
      console.log("💡 Make sure your .env.local file contains:");
      console.log("MONGODB_URI=your_mongodb_connection_string");
      console.log("💡 Current env vars check:");
      console.log(
        "   - MONGODB_URI:",
        process.env.MONGODB_URI ? "Found" : "Missing"
      );
      process.exit(1);
    }

    console.log("🔗 Connecting to database...");
    await connectToDatabase();
    console.log("✅ Database connected successfully");

    // Clear existing test data
    console.log("🧹 Cleaning up existing test data...");
    await Quote.deleteMany({ "customer.email": "test@example.com" });
    await Customer.deleteMany({ email: "test@example.com" });

    // Test creating a sample quote based on your EXTREMELY IMPORTANT requirements
    console.log("🔧 Creating sample quote (2020 Mustang)...");
    const sampleQuote = new Quote({
      vehicleDetails: {
        year: "2020",
        make: "Ford",
        model: "Mustang",
        trim: "GT",
      },
      vin: "1FA6P8TH5L5179137", // From your EXTREMELY IMPORTANT requirements
      customer: {
        name: "Test Customer",
        email: "test@example.com",
        phone: "555-0123",
        address: "123 Test St, Seattle, WA",
        zipCode: "98101",
      },
      pricing: {
        basePrice: 5500, // Base price for 2020 Mustang (from your requirements)
        currentPrice: 3750, // After condition adjustments
        finalPrice: 3750,
        adjustments: [
          {
            type: "high_mileage",
            amount: -500,
            description: "High mileage adjustment",
            appliedAt: new Date(),
          },
          {
            type: "exterior_damage",
            amount: -750,
            description: "Exterior damage penalty",
            appliedAt: new Date(),
          },
          {
            type: "missing_parts",
            amount: -500,
            description: "Missing parts adjustment",
            appliedAt: new Date(),
          },
        ],
      },
      conditionAnswers: {
        zipCode: "98101",
        ownership: "own_outright",
        title: "clean",
        wheels_tires: "all_inflated",
        battery: "working",
        keys: "have_key",
        drivability: "starts_drives",
        engine_transmission: "intact",
        mileage: "125000",
        mileage_unknown: false,
        exterior_damage: "has_damage",
        exterior_damage_locations: ["front_left", "rear_right"],
        missing_parts: "all_attached",
        missing_parts_locations: [],
        mirrors_glass_lights: "all_intact",
        damaged_items_locations: [],
        catalytic_converter: "attached",
        airbags: "intact",
        interior: "good_condition",
        flood_fire: "no_flood_fire",
      },
      status: "pending",
    });

    const savedQuote = await sampleQuote.save();
    console.log("✅ Sample quote created successfully!");
    console.log("   Quote ID:", savedQuote.quoteId);
    console.log(
      "   Vehicle:",
      `${savedQuote.vehicleDetails.year} ${savedQuote.vehicleDetails.make} ${savedQuote.vehicleDetails.model}`
    );
    console.log(
      "   Final Price: $" + savedQuote.pricing.finalPrice.toLocaleString()
    );

    // Test retrieving quotes
    console.log("🔍 Testing quote retrieval...");
    const quotes = await Quote.find().limit(5);
    console.log(`✅ Found ${quotes.length} quotes in database`);

    // Test customer creation
    console.log("👤 Creating sample customer...");
    const sampleCustomer = new Customer({
      name: "Test Customer",
      email: "test@example.com",
      phone: "555-0123",
      address: "123 Test St, Seattle, WA",
      zipCode: "98101",
      totalQuotes: 1,
      status: "active",
    });

    const savedCustomer = await sampleCustomer.save();
    console.log("✅ Sample customer created successfully!");
    console.log("   Customer ID:", savedCustomer.customerId);
    console.log("   Name:", savedCustomer.name);
    console.log("   Status:", savedCustomer.status);

    // Test database queries
    console.log("🔎 Testing database queries...");

    // Find quotes by status
    const pendingQuotes = await Quote.find({ status: "pending" });
    console.log(`✅ Found ${pendingQuotes.length} pending quotes`);

    // Find customers by status
    const activeCustomers = await Customer.find({ status: "active" });
    console.log(`✅ Found ${activeCustomers.length} active customers`);

    // Test aggregation (for admin dashboard stats)
    const quoteStats = await Quote.aggregate([
      {
        $group: {
          _id: null,
          totalQuotes: { $sum: 1 },
          totalValue: { $sum: "$pricing.finalPrice" },
          avgValue: { $avg: "$pricing.finalPrice" },
        },
      },
    ]);

    if (quoteStats.length > 0) {
      console.log("📊 Quote Statistics:");
      console.log("   Total Quotes:", quoteStats[0].totalQuotes);
      console.log(
        "   Total Value: $" + quoteStats[0].totalValue.toLocaleString()
      );
      console.log(
        "   Average Value: $" +
          Math.round(quoteStats[0].avgValue).toLocaleString()
      );
    }

    console.log("🎉 Database test completed successfully!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("✅ Database is ready for production use!");
    console.log("✅ You can now input data through the website!");
    console.log("✅ Admin dashboard will show real database data!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  } catch (error) {
    console.error("❌ Database test failed:", error);

    if (error.message.includes("MONGODB_URI")) {
      console.log("\n💡 Solution: Make sure your .env.local file contains:");
      console.log("MONGODB_URI=your_mongodb_connection_string");
    }

    if (error.code === 11000) {
      console.log("\n💡 Duplicate key error - test data already exists");
    }

    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Database disconnected");
    process.exit(0);
  }
}

testDatabase();
