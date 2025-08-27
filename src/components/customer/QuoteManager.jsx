"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Car,
  Calendar,
  User,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Edit,
  Ban,
  RotateCcw,
} from "lucide-react";

import CancelDialog from "./CancelDialog";
import RescheduleDialog from "./RescheduleDialog";
import ScheduleDialog from "./ScheduleDialog"; // ✅ NEW: Import ScheduleDialog
import UpdateInfoDialog from "./UpdateInfoDialog";
import ActionHistory from "./ActionHistory";

export default function QuoteManager({ quote, onQuoteUpdate }) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false); // ✅ NEW: Schedule dialog state
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "accepted":
      case "pickup_scheduled":
        return "bg-green-100 text-green-800 border-green-200";
      case "customer_cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "rescheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleActionComplete = (updatedQuote) => {
    console.log("handleActionComplete ===> ", updatedQuote);
    onQuoteUpdate(updatedQuote);
    setActionLoading(false);
    setShowCancelDialog(false);
    setShowRescheduleDialog(false);
    setShowScheduleDialog(false); // ✅ NEW: Close schedule dialog
    setShowUpdateDialog(false);
  };

  // ✅ FIXED: More robust logic for determining if quote can be cancelled
  const canCancelQuote = () => {
    const nonCancellableStatuses = [
      "customer_cancelled",
      "cancelled",
      "expired",
      "completed",
    ];
    const isNotExpired = !isExpired;

    return !nonCancellableStatuses.includes(quote.status) && isNotExpired;
  };

  // ✅ FIXED: More robust logic for determining if pickup can be rescheduled
  const canRescheduleQuote = () => {
    const reschedulableStatuses = [
      "accepted",
      "pickup_scheduled",
      "rescheduled",
    ];
    const isNotExpired = !isExpired;

    return reschedulableStatuses.includes(quote.status) && isNotExpired;
  };

  // ✅ NEW: Logic for determining if pickup can be scheduled
  const canSchedulePickup = () => {
    const schedulableStatuses = ["accepted"]; // Only accepted quotes can be scheduled
    const isNotExpired = !isExpired;
    const hasNoScheduledPickup = !quote.pickupDetails?.scheduledDate;

    return (
      schedulableStatuses.includes(quote.status) &&
      isNotExpired &&
      hasNoScheduledPickup
    );
  };

  const isExpired = new Date() > new Date(quote.expiresAt);

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {isExpired && (
        <Alert className="border-red-200 bg-red-50">
          <XCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            This quote has expired. Please get a new quote if you're still
            interested.
          </AlertDescription>
        </Alert>
      )}

      {quote.status === "customer_cancelled" && (
        <Alert className="border-gray-200 bg-gray-50">
          <Ban className="h-4 w-4 text-gray-600" />
          <AlertDescription className="text-gray-700">
            This quote has been cancelled. You can get a new quote if you change
            your mind.
          </AlertDescription>
        </Alert>
      )}

      {/* Vehicle Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5 text-blue-600" />
            Vehicle Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Vehicle</p>
              <p className="font-medium">{quote.vehicleName}</p>
            </div>
            {quote.vin && (
              <div>
                <p className="text-sm text-gray-600">VIN</p>
                <p className="font-mono text-sm">{quote.vin}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Contact Information
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpdateDialog(true)}
              disabled={
                !["pending", "accepted", "pickup_scheduled"].includes(
                  quote.status
                )
              }
            >
              <Edit className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span>{quote.customer.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{quote.customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{quote.customer.phone}</span>
            </div>
            {quote.customer.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span>{quote.customer.address}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pickup Details */}
      {quote.pickupDetails &&
        (quote.pickupDetails.scheduledDate ||
          quote.pickupDetails.scheduledTime) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Pickup Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quote.pickupDetails.scheduledDate && (
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Date</p>
                    <p className="font-medium">
                      {new Date(
                        quote.pickupDetails.scheduledDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {quote.pickupDetails.scheduledTime && (
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Time</p>
                    <p className="font-medium">
                      {quote.pickupDetails.scheduledTime}
                    </p>
                  </div>
                )}
                {quote.pickupDetails.specialInstructions && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">
                      Special Instructions
                    </p>
                    <p className="font-medium">
                      {quote.pickupDetails.specialInstructions}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Available Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {/* ✅ FIXED: Use local logic instead of quote.canCancel */}
            {canCancelQuote() && (
              <Button
                variant="destructive"
                onClick={() => setShowCancelDialog(true)}
                disabled={actionLoading}
              >
                <Ban className="h-4 w-4 mr-2" />
                Cancel Quote
              </Button>
            )}

            {/* ✅ NEW: Schedule Pickup Button */}
            {/* {canSchedulePickup() && ( */}
            <Button
              variant="default"
              onClick={() => setShowScheduleDialog(true)}
              disabled={actionLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Pickup
            </Button>
            {/* )} */}

            {/* ✅ FIXED: Use local logic instead of quote.canReschedule */}
            {/* {canRescheduleQuote() && (
              <Button
                variant="outline"
                onClick={() => setShowRescheduleDialog(true)}
                disabled={actionLoading}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reschedule Pickup
              </Button>
            )} */}

            {/* ✅ UPDATED: Updated condition to include schedule check */}
            {!canCancelQuote() &&
              !canRescheduleQuote() &&
              !canSchedulePickup() && (
                <Alert className="border-gray-200 bg-gray-50">
                  <AlertDescription className="text-gray-700">
                    No actions available for this quote in its current status.
                  </AlertDescription>
                </Alert>
              )}
          </div>
        </CardContent>
      </Card>

      {/* Action History */}
      <ActionHistory actions={quote.customerActions.actionHistory} />

      {/* Action Dialogs */}
      <CancelDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        quote={quote}
        onActionComplete={handleActionComplete}
        loading={actionLoading}
        setLoading={setActionLoading}
      />

      {/* ✅ NEW: Schedule Dialog */}
      <ScheduleDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        quote={quote}
        onActionComplete={handleActionComplete}
        loading={actionLoading}
        setLoading={setActionLoading}
      />

      <RescheduleDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        quote={quote}
        onActionComplete={handleActionComplete}
        loading={actionLoading}
        setLoading={setActionLoading}
      />

      <UpdateInfoDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        quote={quote}
        onActionComplete={handleActionComplete}
        loading={actionLoading}
        setLoading={setActionLoading}
      />
    </div>
  );
}
