/** route: src/components/admin/PickupDetailsModal.jsx */
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  Car,
  DollarSign,
  CheckCircle,
  AlertCircle,
  FileText,
  Copy,
  ExternalLink,
} from "lucide-react";
import axios from "axios";

export default function PickupDetailsModal({ pickup, open, onOpenChange, onPickupComplete }) {
  const [loading, setLoading] = useState(false);
  const [completionNotes, setCompletionNotes] = useState("");
  const [actualPickupTime, setActualPickupTime] = useState("");
  const [copied, setCopied] = useState(false);

  if (!pickup) return null;

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCompletePickup = async () => {
    if (!completionNotes.trim()) {
      alert("Please add completion notes");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/admin/pickups/complete", {
        quoteId: pickup._id,
        completionNotes: completionNotes.trim(),
        actualPickupTime: actualPickupTime || new Date(),
      });

      if (response.data.success) {
        onPickupComplete(response.data.quote);
        onOpenChange(false);
        setCompletionNotes("");
        setActualPickupTime("");
      }
    } catch (error) {
      console.error("Error completing pickup:", error);
      alert("Failed to complete pickup. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isOverdue = new Date(pickup.pickupDetails.scheduledDate) < new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            Pickup Details - {pickup.vehicleName}
            <Badge className={isOverdue ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
              {isOverdue ? "Overdue" : "Scheduled"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pickup Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Pickup Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Scheduled Date</p>
                    <p className="font-medium">{formatDate(pickup.pickupDetails.scheduledDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Time Slot</p>
                    <p className="font-medium">{pickup.pickupDetails.timeSlot}</p>
                  </div>
                </div>
                {pickup.pickupDetails.specialInstructions && (
                  <div className="md:col-span-2">
                    <p className="text-sm text-gray-600">Special Instructions</p>
                    <p className="font-medium">{pickup.pickupDetails.specialInstructions}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{pickup.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{pickup.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{pickup.customer.phone}</p>
                  </div>
                </div>
                {pickup.customer.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{pickup.customer.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Vehicle Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-purple-600" />
                Vehicle Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Vehicle</p>
                  <p className="font-medium">{pickup.vehicleName}</p>
                </div>
                {pickup.vin && (
                  <div>
                    <p className="text-sm text-gray-600">VIN</p>
                    <p className="font-medium font-mono text-sm">{pickup.vin}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Quote ID</p>
                  <div className="flex items-center gap-2">
                    <p className="font-medium font-mono">{pickup.quoteId}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(pickup.quoteId)}
                    >
                      <Copy className="h-3 w-3" />
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Pricing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Base Price</p>
                  <p className="font-medium">{formatCurrency(pickup.pricing.basePrice)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Adjustments</p>
                  <p className="font-medium">{formatCurrency(pickup.pricing.adjustments)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Final Price</p>
                  <p className="font-bold text-lg">{formatCurrency(pickup.pricing.finalPrice)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completion Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Complete Pickup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="completionNotes">Completion Notes *</Label>
                <Textarea
                  id="completionNotes"
                  placeholder="Add notes about the pickup completion..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="actualPickupTime">Actual Pickup Time</Label>
                <Input
                  id="actualPickupTime"
                  type="datetime-local"
                  value={actualPickupTime}
                  onChange={(e) => setActualPickupTime(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCompletePickup}
                  disabled={loading || !completionNotes.trim()}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  {loading ? "Completing..." : "Mark as Completed"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(`/manage/${pickup.accessToken}`, '_blank')}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Customer Portal
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
