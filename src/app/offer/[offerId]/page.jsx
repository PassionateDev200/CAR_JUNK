/** route: src/app/offer/[offerId]/page.jsx */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Car,
  DollarSign,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowLeft,
  FileText,
  Phone,
  Mail,
  MessageSquare,
} from "lucide-react";
import OfferStatus from "@/components/offer/OfferStatus";
import OfferActions from "@/components/offer/OfferActions";

export default function OfferDetailPage({ params }) {
  const router = useRouter();
  const [offerId, setOfferId] = useState("");
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dialogs
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [reviseDialogOpen, setReviseDialogOpen] = useState(false);

  // Form states
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [reviseAmount, setReviseAmount] = useState("");
  const [reviseReason, setReviseReason] = useState("");

  // Action states
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Resolve params Promise - THIS IS THE FIX
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setOfferId(resolvedParams.offerId);
      } catch (err) {
        console.error("Error resolving params:", err);
        setError("Failed to load offer details");
        setLoading(false);
      }
    };
    resolveParams();
  }, [params]);

  // Mock data for demonstration
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
      images: ["/placeholder.svg?height=300&width=500"],
    },
    seller: {
      name: "John Smith",
      email: "john@example.com",
      phone: "555-123-4567",
    },
  };

  // Simulate fetching offer details - Wait for offerId to be resolved
  useEffect(() => {
    if (!offerId) return; // Don't fetch until offerId is available

    // In a real app, you would fetch from your API
    setTimeout(() => {
      setOffer(mockOffer);
      setLoading(false);
    }, 1000);
  }, [offerId]); // Add offerId as dependency

  const handleAcceptOffer = () => {
    setActionLoading(true);

    // Simulate API call
    setTimeout(() => {
      setOffer({
        ...offer,
        status: "accepted",
        pickupDetails: {
          date: pickupDate,
          time: pickupTime,
          contactPhone: contactPhone,
        },
      });
      setActionLoading(false);
      setAcceptDialogOpen(false);
      setActionSuccess(
        "Offer accepted! We'll contact you shortly to confirm your pickup details."
      );
    }, 1500);
  };

  const handleRejectOffer = () => {
    setActionLoading(true);

    // Simulate API call
    setTimeout(() => {
      setOffer({
        ...offer,
        status: "rejected",
        rejectionReason: rejectReason,
      });
      setActionLoading(false);
      setRejectDialogOpen(false);
      setActionSuccess(
        "Offer rejected. Thank you for considering our service."
      );
    }, 1500);
  };

  const handleReviseOffer = () => {
    setActionLoading(true);

    // Simulate API call
    setTimeout(() => {
      setOffer({
        ...offer,
        status: "revision_requested",
        revisionRequest: {
          requestedAmount: Number.parseFloat(reviseAmount),
          reason: reviseReason,
        },
      });
      setActionLoading(false);
      setReviseDialogOpen(false);
      setActionSuccess(
        "Revision requested. Our team will review your request and get back to you within 24 hours."
      );
    }, 1500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const daysRemaining = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getConditionLabel = (condition) => {
    switch (condition) {
      case "excellent":
        return {
          label: "Excellent",
          color: "bg-green-100 text-green-800 border-green-200",
        };
      case "good":
        return {
          label: "Good",
          color: "bg-blue-100 text-blue-800 border-blue-200",
        };
      case "fair":
        return {
          label: "Fair",
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        };
      case "poor":
        return {
          label: "Poor",
          color: "bg-red-100 text-red-800 border-red-200",
        };
      default:
        return {
          label: condition,
          color: "bg-gray-100 text-gray-800 border-gray-200",
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-lg text-gray-600">Loading offer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !offer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="ghost"
              className="mb-6 flex items-center text-gray-600 hover:text-blue-600"
              onClick={() => router.push("/offer")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Offers
            </Button>

            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error ||
                  "Offer not found. It may have been removed or expired."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6 flex items-center text-gray-600 hover:text-blue-600"
            onClick={() => router.push("/offer")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Offers
          </Button>

          {/* Success Message */}
          {actionSuccess && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {actionSuccess}
              </AlertDescription>
            </Alert>
          )}

          {/* Offer Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-xl border-0 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl md:text-3xl flex items-center">
                      <DollarSign className="w-6 h-6 mr-2" />$
                      {offer.amount.toLocaleString()}
                    </CardTitle>
                    <CardDescription className="text-blue-100 mt-1">
                      Offer for your {offer.vehicle.year} {offer.vehicle.make}{" "}
                      {offer.vehicle.model}
                    </CardDescription>
                  </div>
                  <OfferStatus status={offer.status} />
                </div>
              </CardHeader>

              <CardContent className="p-6">
                {/* Vehicle Details */}
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <Car className="w-5 h-5 mr-2 text-blue-600" />
                      Vehicle Details
                    </h3>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Make</p>
                          <p className="font-medium">{offer.vehicle.make}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Model</p>
                          <p className="font-medium">{offer.vehicle.model}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Year</p>
                          <p className="font-medium">{offer.vehicle.year}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Condition</p>
                          <Badge
                            className={
                              getConditionLabel(offer.vehicle.condition).color
                            }
                          >
                            {getConditionLabel(offer.vehicle.condition).label}
                          </Badge>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">VIN</p>
                        <p className="font-medium font-mono">
                          {offer.vehicle.vin}
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Mileage</p>
                        <p className="font-medium">
                          {offer.vehicle.mileage.toLocaleString()} miles
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-blue-600" />
                      Offer Details
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500">Offer Amount</p>
                        <p className="text-2xl font-bold text-green-600">
                          ${offer.amount.toLocaleString()}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Created On</p>
                          <p className="font-medium">
                            {formatDate(offer.createdAt)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Expires On</p>
                          <div className="flex items-center">
                            <p className="font-medium">
                              {formatDate(offer.expiresAt)}
                            </p>
                            {daysRemaining(offer.expiresAt) > 0 && (
                              <Badge className="ml-2 bg-blue-100 text-blue-800 border-blue-200">
                                {daysRemaining(offer.expiresAt)} days left
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Free Towing</p>
                        <p className="font-medium flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          Included with your offer
                        </p>
                      </div>

                      {offer.status === "accepted" && offer.pickupDetails && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="font-medium text-green-800 mb-2">
                            Pickup Scheduled
                          </p>
                          <p className="text-green-700">
                            {offer.pickupDetails.date} at{" "}
                            {offer.pickupDetails.time}
                          </p>
                          <p className="text-sm text-green-600 mt-1">
                            Contact phone: {offer.pickupDetails.contactPhone}
                          </p>
                        </div>
                      )}

                      {offer.status === "rejected" && offer.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="font-medium text-red-800 mb-2">
                            Offer Rejected
                          </p>
                          <p className="text-red-700">
                            {offer.rejectionReason}
                          </p>
                        </div>
                      )}

                      {offer.status === "revision_requested" &&
                        offer.revisionRequest && (
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="font-medium text-yellow-800 mb-2">
                              Revision Requested
                            </p>
                            <p className="text-yellow-700">
                              Requested amount: $
                              {offer.revisionRequest.requestedAmount.toLocaleString()}
                            </p>
                            <p className="text-sm text-yellow-600 mt-1">
                              {offer.revisionRequest.reason}
                            </p>
                          </div>
                        )}
                    </div>
                  </div>
                </div>

                <Separator className="my-8" />

                {/* Actions */}
                {["pending", "revision_requested"].includes(offer.status) && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">
                      Respond to This Offer
                    </h3>
                    <OfferActions
                      onAccept={() => setAcceptDialogOpen(true)}
                      onReject={() => setRejectDialogOpen(true)}
                      onRevise={() => setReviseDialogOpen(true)}
                    />
                  </div>
                )}

                {/* Contact Info */}
                <div className="mt-8 bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Need Help?</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="flex items-start">
                      <Phone className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Call Us</p>
                        <p className="text-gray-600">1-855-437-9728</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Mail className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Email Us</p>
                        <p className="text-gray-600">
                          support@pnwcashforcars.com
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MessageSquare className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                      <div>
                        <p className="font-medium">Live Chat</p>
                        <p className="text-gray-600">Available 8AM-9PM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Accept Dialog */}
      <Dialog open={acceptDialogOpen} onOpenChange={setAcceptDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Accept Offer</DialogTitle>
            <DialogDescription>
              Schedule a pickup time for your vehicle. We'll send a confirmation
              to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="pickup-date">Preferred Pickup Date</Label>
              <Input
                id="pickup-date"
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup-time">Preferred Time</Label>
              <select
                id="pickup-time"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
              >
                <option value="">Select a time</option>
                <option value="Morning (8AM-12PM)">Morning (8AM-12PM)</option>
                <option value="Afternoon (12PM-4PM)">
                  Afternoon (12PM-4PM)
                </option>
                <option value="Evening (4PM-8PM)">Evening (4PM-8PM)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-phone">Contact Phone Number</Label>
              <Input
                id="contact-phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAcceptDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAcceptOffer}
              disabled={
                !pickupDate || !pickupTime || !contactPhone || actionLoading
              }
              className="bg-green-600 hover:bg-green-700"
            >
              {actionLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept Offer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject Offer</DialogTitle>
            <DialogDescription>
              Please let us know why you're rejecting this offer. This helps us
              improve our service.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reject-reason">
                Reason for Rejection (Optional)
              </Label>
              <Textarea
                id="reject-reason"
                placeholder="The offer is too low, I found a better offer elsewhere, etc."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRejectOffer}
              disabled={actionLoading}
              variant="destructive"
            >
              {actionLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Offer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revise Dialog */}
      <Dialog open={reviseDialogOpen} onOpenChange={setReviseDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Offer Revision</DialogTitle>
            <DialogDescription>
              Let us know what you're looking for. Our team will review your
              request and respond within 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="revise-amount">Requested Amount ($)</Label>
              <Input
                id="revise-amount"
                type="number"
                placeholder="Enter your desired amount"
                value={reviseAmount}
                onChange={(e) => setReviseAmount(e.target.value)}
                min={offer.amount}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="revise-reason">Reason for Revision Request</Label>
              <Textarea
                id="revise-reason"
                placeholder="Please explain why you're requesting a higher amount..."
                value={reviseReason}
                onChange={(e) => setReviseReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviseDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReviseOffer}
              disabled={!reviseAmount || !reviseReason || actionLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {actionLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Request Revision
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
