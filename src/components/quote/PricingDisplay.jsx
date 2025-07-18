/** route: src/components/quote/PricingDisplay.jsx */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import {
  DollarSign,
  Car,
  User,
  Mail,
  Phone,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  useVehicle,
  useVehicleDispatch,
  vehicleActions,
} from "@/contexts/VehicleContext";

export default function PricingDisplay() {
  const vehicleState = useVehicle();
  const dispatch = useVehicleDispatch();

  const {
    vehicleDetails,
    vin,
    pricing,
    questionPricing,
    conditionAnswers,
    zipCode,
    locationData,
  } = vehicleState;

  const [sellerInfo, setSellerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [quoteId, setQuoteId] = useState("");

  const handleInputChange = (field, value) => {
    setSellerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      // Validate required fields
      if (!sellerInfo.name || !sellerInfo.email || !sellerInfo.phone) {
        throw new Error("Please fill in all required fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sellerInfo.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Prepare quote data
      const quoteData = {
        vehicleDetails,
        vin,
        pricing: {
          ...pricing,
          finalPrice: pricing.currentPrice,
        },
        questionPricing,
        conditionAnswers,
        customer: sellerInfo,
        zipCode,
        locationData,
      };

      // Submit quote
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(quoteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to submit quote");
      }

      const result = await response.json();

      // Update context with submission status
      dispatch(
        vehicleActions.setSubmissionStatus({
          isSubmitted: true,
          isSubmitting: false,
          error: null,
        })
      );

      setQuoteId(result.quoteId);
      setSubmissionSuccess(true);
    } catch (error) {
      console.error("Error submitting quote:", error);
      setSubmissionError(error.message);

      dispatch(
        vehicleActions.setSubmissionStatus({
          isSubmitted: false,
          isSubmitting: false,
          error: error.message,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const vehicleName = `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;

  // Success screen
  if (submissionSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="text-center">
            <CardContent className="p-8">
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Quote Submitted Successfully!
                </h2>
                <p className="text-gray-600">
                  Your quote has been submitted and we've sent you a
                  confirmation email.
                </p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  ${pricing.currentPrice.toLocaleString()}
                </div>
                <p className="text-sm text-green-700 mb-4">
                  Your offer for {vehicleName}
                </p>
                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="h-4 w-4" />
                    <span>Quote ID: {quoteId}</span>
                  </div>
                  <p>Valid for 7 days from today</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-800 mb-2">
                  📧 Check Your Email
                </h3>
                <p className="text-sm text-blue-700">
                  We've sent a confirmation email to{" "}
                  <strong>{sellerInfo.email}</strong> with:
                </p>
                <ul className="text-sm text-blue-700 mt-2 space-y-1">
                  <li>• Your quote details and access link</li>
                  <li>• Instructions to manage your quote</li>
                  <li>• Contact information for questions</li>
                </ul>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={() => (window.location.href = "/")}
                  className="w-full"
                >
                  Get Another Quote
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (window.location.href = "/how-it-works")}
                  className="w-full"
                >
                  Learn More About Our Process
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Final Offer
          </h1>
          <p className="text-gray-600">
            Complete your information below to receive your cash offer
          </p>
        </div>

        {/* Offer Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Offer Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <Car className="h-4 w-4" />
                  Vehicle Details
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Year:</span>
                    <span className="font-medium">{vehicleDetails.year}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Make:</span>
                    <span className="font-medium">{vehicleDetails.make}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Model:</span>
                    <span className="font-medium">{vehicleDetails.model}</span>
                  </div>
                  {vehicleDetails.trim && (
                    <div className="flex justify-between">
                      <span>Trim:</span>
                      <span className="font-medium">{vehicleDetails.trim}</span>
                    </div>
                  )}
                  {vin && (
                    <div className="flex justify-between">
                      <span>VIN:</span>
                      <span className="font-medium font-mono text-xs">
                        {vin}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-3">
                  Pricing Breakdown
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Base Price:</span>
                    <span className="font-medium">
                      ${pricing.basePrice.toLocaleString()}
                    </span>
                  </div>
                  {Object.entries(questionPricing)
                    .filter(([key, value]) => value !== 0)
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <span
                          className={`font-medium ${
                            value < 0 ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {value > 0 ? "+" : ""}${value}
                        </span>
                      </div>
                    ))}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Final Offer:</span>
                    <span className="text-green-600">
                      ${pricing.currentPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Seller Information Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={sellerInfo.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={sellerInfo.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={sellerInfo.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Address (Optional)
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    placeholder="Enter your address"
                    value={sellerInfo.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                  />
                </div>
              </div>

              {submissionError && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">
                    {submissionError}
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full md:w-auto min-w-48"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="mr-2 h-4 w-4" />
                      Submitting Offer...
                    </>
                  ) : (
                    <>Get My ${pricing.currentPrice.toLocaleString()} Offer</>
                  )}
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  By submitting this form, you agree to our terms and
                  conditions. We'll send you a confirmation email with your
                  quote details.
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
