/** route: src/components/admin/QuoteDetailsModal.jsx */
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
import { Separator } from "@/components/ui/separator";
import {
  Car,
  User,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  RotateCcw,
  Ban,
  AlertCircle,
  Copy,
  ExternalLink,
} from "lucide-react";

export default function QuoteDetailsModal({ quote, open, onOpenChange }) {
  const [copied, setCopied] = useState(false);

  if (!quote) return null;

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      customer_cancelled: "bg-red-100 text-red-800 border-red-200",
      rescheduled: "bg-blue-100 text-blue-800 border-blue-200",
      pickup_scheduled: "bg-purple-100 text-purple-800 border-purple-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
      expired: "bg-gray-100 text-gray-600 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "customer_cancelled":
        return <Ban className="h-4 w-4 text-red-600" />;
      case "rescheduled":
        return <RotateCcw className="h-4 w-4 text-blue-600" />;
      case "pickup_scheduled":
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Car className="h-6 w-6 text-blue-600" />
            Quote Details - {quote.quoteId}
            <Badge className={getStatusColor(quote.status)}>
              {getStatusIcon(quote.status)}
              <span className="ml-1">{quote.status.replace("_", " ")}</span>
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
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
                  <p className="font-medium text-lg">{quote.vehicleName}</p>
                </div>
                {quote.vin && (
                  <div>
                    <p className="text-sm text-gray-600">VIN</p>
                    <p className="font-mono text-sm">{quote.vin}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Year</p>
                  <p className="font-medium">{quote.vehicleDetails?.year}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Make</p>
                  <p className="font-medium">{quote.vehicleDetails?.make}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Model</p>
                  <p className="font-medium">{quote.vehicleDetails?.model}</p>
                </div>
                {quote.vehicleDetails?.trim && (
                  <div>
                    <p className="text-sm text-gray-600">Trim</p>
                    <p className="font-medium">{quote.vehicleDetails.trim}</p>
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
                    <p className="font-medium">{quote.customer.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{quote.customer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{quote.customer.phone}</p>
                  </div>
                </div>
                {quote.customer.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{quote.customer.address}</p>
                    </div>
                  </div>
                )}
                {quote.customer.zipCode && (
                  <div>
                    <p className="text-sm text-gray-600">ZIP Code</p>
                    <p className="font-medium">{quote.customer.zipCode}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-purple-600" />
                Pricing Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Base Price</p>
                  <p className="font-medium text-lg">
                    ${quote.pricing?.basePrice?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Price</p>
                  <p className="font-medium text-lg">
                    ${quote.pricing?.currentPrice?.toLocaleString() || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Final Price</p>
                  <p className="font-bold text-xl text-green-600">
                    ${quote.pricing?.finalPrice?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pickup Details */}
          {quote.pickupDetails && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Pickup Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {quote.pickupDetails.scheduledDate && (
                    <div>
                      <p className="text-sm text-gray-600">Scheduled Date</p>
                      <p className="font-medium">
                        {formatDate(quote.pickupDetails.scheduledDate)}
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
                  {quote.pickupDetails.timeSlot && (
                    <div>
                      <p className="text-sm text-gray-600">Time Slot</p>
                      <p className="font-medium">
                        {quote.pickupDetails.timeSlot}
                      </p>
                    </div>
                  )}
                  {quote.pickupDetails.contactPhone && (
                    <div>
                      <p className="text-sm text-gray-600">Contact Phone</p>
                      <p className="font-medium">
                        {quote.pickupDetails.contactPhone}
                      </p>
                    </div>
                  )}
                  {quote.pickupDetails.address && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Pickup Address</p>
                      <p className="font-medium">
                        {quote.pickupDetails.address}
                      </p>
                    </div>
                  )}
                  {quote.pickupDetails.specialInstructions && (
                    <div className="md:col-span-2">
                      <p className="text-sm text-gray-600">Special Instructions</p>
                      <p className="font-medium">
                        {quote.pickupDetails.specialInstructions}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quote Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Quote Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="font-medium">Quote Created</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(quote.createdAt)}
                    </p>
                  </div>
                </div>
                {quote.expiresAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                    <div>
                      <p className="font-medium">Expires</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(quote.expiresAt)}
                      </p>
                    </div>
                  </div>
                )}
                {quote.pickupDetails?.confirmedAt && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <div>
                      <p className="font-medium">Pickup Confirmed</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(quote.pickupDetails.confirmedAt)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action History */}
          {quote.customerActions?.actionHistory && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Action History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quote.customerActions.actionHistory
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                    .map((action, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mt-1">
                          {getStatusIcon(action.action)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium capitalize">
                              {action.action.replace("_", " ")}
                            </p>
                            <span className="text-xs text-gray-500">
                              {formatDate(action.timestamp)}
                            </span>
                          </div>
                          {action.reason && (
                            <p className="text-sm text-gray-600">
                              Reason: {action.reason.replace(/_/g, " ")}
                            </p>
                          )}
                          {action.note && (
                            <p className="text-sm text-gray-600">
                              Note: {action.note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(quote.quoteId)}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Copied!" : "Copy Quote ID"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    if (quote.accessToken) {
                      window.open(`/manage/${quote.accessToken}`, '_blank');
                    } else {
                      console.error('Access token not available for this quote');
                      alert('Access token not available for this quote');
                    }
                  }}
                  className="flex items-center gap-2"
                  disabled={!quote.accessToken}
                >
                  <ExternalLink className="h-4 w-4" />
                  View Customer Portal
                </Button>
                {quote.status === "pending" && (
                  <Button className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approve Quote
                  </Button>
                )}
                {quote.status === "accepted" && (
                  <Button variant="outline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Schedule Pickup
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
