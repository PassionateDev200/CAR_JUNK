
import { NextResponse } from "next/server";

const ZIPCODE_API_KEY =
  process.env.ZIPCODE_API_KEY || "RpCKB1PkV5O6giV+gcl0Gg==79NrJlEYibILNvaH";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const zip = searchParams.get("zip");

    if (!zip) {
      return NextResponse.json(
        { error: "ZIP code parameter is required" },
        { status: 400 }
      );
    }

    // Validate ZIP code format (5 digits)
    if (!/^\d{5}$/.test(zip)) {
      return NextResponse.json(
        { error: "Invalid ZIP code format. Must be 5 digits." },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://api.api-ninjas.com/v1/zipcode?zip=${zip}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": ZIPCODE_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the response to match our expected format
    if (data && data.length > 0) {
      const locationData = data[0];
      const transformedData = {
        valid: locationData.valid !== false, // Assume valid if not explicitly false
        zipCode: locationData.zip_code,
        city: locationData.city,
        state: locationData.state,
        county: locationData.county,
        timezone: locationData.timezone,
        latitude: parseFloat(locationData.lat),
        longitude: parseFloat(locationData.lon),
        areaCodes: locationData.area_codes,
        country: locationData.country,
      };

      return NextResponse.json(transformedData);
    } else {
      return NextResponse.json(
        { valid: false, error: "ZIP code not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching ZIP code data:", error);
    return NextResponse.json(
      { error: "Failed to fetch ZIP code data", details: error.message },
      { status: 500 }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
