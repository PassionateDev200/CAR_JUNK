/** route: src/app/api/offer/[offerId]/route.js */
import { NextResponse } from "next/server";
import {
  sendOfferStatusEmail,
  sendAdminNotification,
} from "@/lib/emailService";

// GET - Fetch a specific offer
export async function GET(request, { params }) {
  try {
    const { offerId } = params;

    // In a real app, you would query your database
    const mockOffer = {
      id: offerId,
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
      seller: {
        name: "John Smith",
        email: "john@example.com",
        phone: "555-123-4567",
      },
    };

    return NextResponse.json({ offer: mockOffer });
  } catch (error) {
    console.error(`Error fetching offer ${params.offerId}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch offer" },
      { status: 500 }
    );
  }
}

// PUT - Update an offer (accept, reject, revise) and send email
export async function PUT(request, { params }) {
  try {
    const { offerId } = params;
    const body = await request.json();
    const { action, message, pickupDetails, revisionRequest } = body;

    // Get current offer (in real app, fetch from database)
    const currentOffer = {
      id: offerId,
      amount: 3500,
      vehicle: {
        make: "Toyota",
        model: "Camry",
        year: 2010,
        vin: "1HGCM82633A123456",
      },
      seller: {
        name: "John Smith",
        email: "john@example.com",
        phone: "555-123-4567",
      },
    };

    // Update offer based on action
    let updatedOffer = { ...currentOffer };
    let emailAction = action;

    switch (action) {
      case "accept":
        updatedOffer.status = "accepted";
        updatedOffer.acceptedAt = new Date().toISOString();
        updatedOffer.pickupDetails = pickupDetails;
        emailAction = "accepted";
        break;

      case "reject":
        updatedOffer.status = "rejected";
        updatedOffer.rejectedAt = new Date().toISOString();
        updatedOffer.rejectionReason = message;
        emailAction = "rejected";
        break;

      case "revise":
        updatedOffer.status = "revision_requested";
        updatedOffer.revisionRequest = revisionRequest;
        emailAction = "revised";
        break;

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    updatedOffer.updatedAt = new Date().toISOString();

    // In a real app, save to database here
    console.log(`Updating offer ${offerId} with action: ${action}`);

    // Send email notification to customer
    const emailResult = await sendOfferStatusEmail({
      offer: currentOffer,
      action: emailAction,
      message,
    });

    if (!emailResult.success) {
      console.error("Failed to send offer status email:", emailResult.error);
    }

    // Send admin notification
    await sendAdminNotification({
      type: `offer_${action}ed`,
      data: {
        offerId,
        action,
        vehicle: `${currentOffer.vehicle.year} ${currentOffer.vehicle.make} ${currentOffer.vehicle.model}`,
        amount: currentOffer.amount,
        customer: currentOffer.seller.name,
        message: message || revisionRequest,
      },
    });

    return NextResponse.json({
      offer: updatedOffer,
      emailSent: emailResult.success,
    });
  } catch (error) {
    console.error(`Error updating offer ${params.offerId}:`, error);
    return NextResponse.json(
      { error: "Failed to update offer" },
      { status: 500 }
    );
  }
}
