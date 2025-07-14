/** route: src/app/api/offer/route.js */

import { NextResponse } from "next/server";

// GET - Fetch all offers for a user
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const vin = searchParams.get("vin");

    // In a real app, you would query your database
    const mockOffers = [
      {
        id: "offer-123",
        vehicleId: "veh-456",
        amount: 3500,
        status: "pending",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        vehicle: {
          make: "Toyota",
          model: "Camry",
          year: 2010,
          vin: "1HGCM82633A123456",
          mileage: 120000,
          condition: "good",
        },
      },
      // Add more mock offers as needed
    ];

    return NextResponse.json({ offers: mockOffers });
  } catch (error) {
    console.error("Error fetching offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch offers" },
      { status: 500 }
    );
  }
}

// POST - Create a new offer
export async function POST(request) {
  try {
    const body = await request.json();

    // In a real app, you would save to your database
    // For now, we'll just return the data with an ID
    const newOffer = {
      id: `offer-${Date.now()}`,
      ...body,
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    return NextResponse.json({ offer: newOffer });
  } catch (error) {
    console.error("Error creating offer:", error);
    return NextResponse.json(
      { error: "Failed to create offer" },
      { status: 500 }
    );
  }
}
