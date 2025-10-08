/** route: src/app/api/verify-address/route.js */
import { NextResponse } from "next/server";

/**
 * Address Verification API
 * Uses a simple regex-based validation for US addresses
 * In production, you should use a service like:
 * - USPS Address Verification API
 * - Google Maps Geocoding API
 * - SmartyStreets API
 * - Melissa Data API
 */

export async function POST(request) {
  try {
    const { address } = await request.json();

    if (!address || typeof address !== "string") {
      return NextResponse.json(
        { verified: false, error: "Address is required" },
        { status: 400 }
      );
    }

    const trimmedAddress = address.trim();

    // Basic validation: must be at least 10 characters
    if (trimmedAddress.length < 10) {
      return NextResponse.json(
        {
          verified: false,
          error: "Address is too short. Please provide a complete address.",
        },
        { status: 400 }
      );
    }

    // Enhanced validation patterns
    const hasStreetNumber = /\d+/.test(trimmedAddress);
    const hasStreetName = /[a-zA-Z]{2,}/.test(trimmedAddress);
    const hasCommaOrNewline = /[,\n]/.test(trimmedAddress);
    
    // Check for common US state abbreviations or full names
    const statePattern = /\b(AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY|Alabama|Alaska|Arizona|Arkansas|California|Colorado|Connecticut|Delaware|Florida|Georgia|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Mississippi|Missouri|Montana|Nebraska|Nevada|New Hampshire|New Jersey|New Mexico|New York|North Carolina|North Dakota|Ohio|Oklahoma|Oregon|Pennsylvania|Rhode Island|South Carolina|South Dakota|Tennessee|Texas|Utah|Vermont|Virginia|Washington|West Virginia|Wisconsin|Wyoming)\b/i;
    const hasState = statePattern.test(trimmedAddress);
    
    // Check for ZIP code (5 digits or 5+4 format)
    const zipPattern = /\b\d{5}(-\d{4})?\b/;
    const hasZip = zipPattern.test(trimmedAddress);

    // Validation logic
    if (!hasStreetNumber) {
      return NextResponse.json({
        verified: false,
        error: "Address must include a street number",
      });
    }

    if (!hasStreetName) {
      return NextResponse.json({
        verified: false,
        error: "Address must include a street name",
      });
    }

    if (!hasState) {
      return NextResponse.json({
        verified: false,
        error: "Address must include a valid US state",
      });
    }

    if (!hasZip) {
      return NextResponse.json({
        verified: false,
        error: "Address must include a valid ZIP code (e.g., 12345 or 12345-6789)",
      });
    }

    // If all validations pass
    // In production, you would call an external API here to verify and normalize
    
    // Simple normalization: capitalize first letter of each word
    const normalizedAddress = trimmedAddress
      .split(/\s+/)
      .map(word => {
        // Keep state abbreviations uppercase
        if (word.length === 2 && /^[A-Z]{2}$/i.test(word)) {
          return word.toUpperCase();
        }
        // Capitalize first letter
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");

    return NextResponse.json({
      verified: true,
      normalizedAddress: normalizedAddress,
      message: "Address verified successfully",
    });

  } catch (error) {
    console.error("Address verification error:", error);
    return NextResponse.json(
      { verified: false, error: "Failed to verify address" },
      { status: 500 }
    );
  }
}

// Handle GET requests
export async function GET() {
  return NextResponse.json(
    {
      error: "Method not allowed. Use POST to verify addresses.",
      allowedMethods: ["POST"],
    },
    { status: 405 }
  );
}

