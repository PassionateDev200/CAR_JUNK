/** route: src/components/admin/CustomerDetailsModal.jsx */
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Car,
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
  MessageSquare,
  TrendingUp,
} from "lucide-react";

export default function CustomerDetailsModal({ customer, open, onOpenChange }) {
  const [copied, setCopied] = useState(false);

  if (!customer) return null;

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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const sortedQuotes = customer.quotes.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-6 w-6 text-blue-600" />
            Customer Details - {customer.customer.name}
            <Badge className="bg-blue-100 text-blue-800">
              {customer.totalQuotes} Quote{customer.totalQuotes !== 1 ? "s" : ""}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quotes">Quotes ({customer.totalQuotes})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="font-medium">{customer.customer.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{customer.customer.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{customer.customer.phone}</p>
                    </div>
                  </div>
                  {customer.customer.address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{customer.customer.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Customer Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Customer Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {customer.totalQuotes}
                    </div>
                    <p className="text-sm text-gray-600">Total Quotes</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {formatCurrency(customer.totalValue)}
                    </div>
                    <p className="text-sm text-gray-600">Total Value</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(customer.avgQuoteValue)}
                    </div>
                    <p className="text-sm text-gray-600">Avg Quote Value</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {customer.hasActiveQuote ? "Yes" : "No"}
                    </div>
                    <p className="text-sm text-gray-600">Active Quote</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes" className="space-y-4">
            <div className="space-y-4">
              {sortedQuotes.map((quote, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Car className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium">{quote.vehicleName}</p>
                          <p className="text-sm text-gray-600">Quote: {quote.quoteId}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(quote.status)}>
                        {getStatusIcon(quote.status)}
                        <span className="ml-1">{quote.status.replace("_", " ")}</span>
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="text-sm text-gray-600">Value</p>
                          <p className="font-medium">{formatCurrency(quote.finalPrice)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-sm text-gray-600">Created</p>
                          <p className="font-medium">{formatDate(quote.createdAt)}</p>
                        </div>
                      </div>
                      {quote.pickupDetails?.scheduledDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-sm text-gray-600">Pickup</p>
                            <p className="font-medium">
                              {formatDate(quote.pickupDetails.scheduledDate)}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Quote Timeline</h4>
                    <div className="space-y-2">
                      {sortedQuotes.map((quote, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{quote.vehicleName}</p>
                            <p className="text-xs text-gray-600">
                              {formatDate(quote.createdAt)} - {formatCurrency(quote.finalPrice)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(quote.status)}>
                            {quote.status.replace("_", " ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Customer Insights</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-800">Customer Type</p>
                        <p className="text-sm text-blue-600">
                          {customer.totalQuotes > 1 ? "Returning Customer" : "New Customer"}
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Value Range</p>
                        <p className="text-sm text-green-600">
                          {customer.avgQuoteValue > 1000 ? "High Value" : "Standard Value"}
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-sm font-medium text-purple-800">Engagement</p>
                        <p className="text-sm text-purple-600">
                          {customer.hasActiveQuote ? "Currently Active" : "No Active Quotes"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(customer.customer.email)}
                    className="flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    {copied ? "Copied!" : "Copy Email"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => copyToClipboard(customer.customer.phone)}
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Copy Phone
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open(`mailto:${customer.customer.email}`, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Send Email
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => window.open(`tel:${customer.customer.phone}`, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Call Customer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
