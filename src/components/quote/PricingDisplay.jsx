/** route: src/components/quote/PricingDisplay.jsx */

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  DollarSign,
  Car,
  ArrowRight,
  Sparkles,
  Shield,
  TrendingDown,
  TrendingUp,
  Loader2,
  Mail,
  Edit3,
  MapPin,
} from "lucide-react";
import {
  useVehicle,
  useVehicleDispatch,
  vehicleActions,
} from "@/contexts/VehicleContext";

export default function PricingDisplay({ onComplete }) {
  // Get state and dispatch from context
  const vehicleState = useVehicle();
  const dispatch = useVehicleDispatch();

  // Destructure all needed data from context
  const {
    vehicleDetails,
    vin,
    pricing,
    conditionAnswers,
    sellerInfo,
    submissionStatus,
    zipCode,
    locationData,
  } = vehicleState;

  // Local state for form validation
  const [validationErrors, setValidationErrors] = useState({});

  // Update seller info in context
  const handleSellerInfoChange = (field, value) => {
    dispatch(vehicleActions.setSellerInfo({ [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {};
    if (!sellerInfo.name?.trim()) {
      errors.name = "Full name is required";
    }

    if (!sellerInfo.email?.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sellerInfo.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!sellerInfo.phone?.trim()) {
      errors.phone = "Phone number is required";
    } else if (
      !/^[\d\s\-\(\)\+]{10,}$/.test(sellerInfo.phone.replace(/\D/g, ""))
    ) {
      errors.phone = "Please enter a valid phone number";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAcceptOffer = async () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }

    // Update submission status in context
    dispatch(
      vehicleActions.setSubmissionStatus({
        isSubmitting: true,
        error: null,
      })
    );

    try {
      const { data } = await axios.post("/api/quote", {
        vehicleDetails,
        vin,
        pricing,
        conditionAnswers,
        sellerInfo, // ✅ Ensure this matches what the API expects
        zipCode,
        locationData,
      });

      dispatch(
        vehicleActions.setSubmissionStatus({
          isSubmitting: false,
          isSubmitted: true,
          error: null,
          quoteId: data.quote?.id,
        })
      );

      localStorage.removeItem("vehicleQuoteData");

      setTimeout(() => {
        window.location.href = "/offer";
      }, 3000);
    } catch (error) {
      console.error("Error submitting quote:", error);
      dispatch(
        vehicleActions.setSubmissionStatus({
          isSubmitting: false,
          error:
            error.response?.data?.error ||
            "Failed to submit quote. Please try again.",
        })
      );
    }
  };

  // Format phone number as user types
  const handlePhoneChange = (value) => {
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    handleSellerInfoChange("phone", formatted);
  };

  // Success state
  if (submissionStatus.isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>

            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Quote Submitted Successfully!
            </h2>

            <div className="space-y-3 text-green-700 mb-6">
              <p>We've sent your quote details to {sellerInfo.email}</p>
              {submissionStatus.quoteId && (
                <p className="font-mono text-sm bg-green-100 px-3 py-2 rounded">
                  Quote ID: {submissionStatus.quoteId}
                </p>
              )}
              <p className="text-sm">Redirecting to offer management...</p>
            </div>

            <div className="animate-spin w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full mx-auto"></div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Your {vehicleDetails.year} {vehicleDetails.make}{" "}
          {vehicleDetails.model} is worth more than you think!
        </h1>
        <p className="text-xl text-gray-600">
          Here's your personalized cash offer
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Offer Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2"
        >
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-2xl border-0">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8" />
                  <div>
                    <h2 className="text-2xl font-bold">Instant Cash Offer</h2>
                    <p className="text-blue-100 text-sm">
                      Valid for 7 days • Free pickup included • Get paid on the
                      spot
                    </p>
                  </div>
                </div>
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </div>

              <div className="text-center mb-8">
                <div className="text-6xl font-bold mb-2">
                  ${pricing.currentPrice?.toLocaleString()}
                </div>
                <div className="text-blue-100 text-lg">
                  Based on your vehicle's condition
                </div>
              </div>

              {/* Vehicle Summary */}
              <div className="bg-white/10 rounded-lg p-6 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Car className="w-5 h-5" />
                  <h3 className="text-lg font-semibold">Vehicle Summary</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-200">Year:</span>{" "}
                    <span className="font-semibold">{vehicleDetails.year}</span>
                  </div>
                  <div>
                    <span className="text-blue-200">Make:</span>{" "}
                    <span className="font-semibold">{vehicleDetails.make}</span>
                  </div>
                  <div>
                    <span className="text-blue-200">Model:</span>{" "}
                    <span className="font-semibold">
                      {vehicleDetails.model}
                    </span>
                  </div>
                  {vehicleDetails.trim && (
                    <div>
                      <span className="text-blue-200">Trim:</span>{" "}
                      <span className="font-semibold">
                        {vehicleDetails.trim}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Breakdown */}
              {pricing.basePrice !== pricing.currentPrice && (
                <div className="bg-white/10 rounded-lg p-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Edit3 className="w-4 h-4" />
                    Pricing Breakdown
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-200">Base Value:</span>
                      <span>${pricing.basePrice?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-blue-200">
                        Condition Adjustments:
                      </span>
                      <span
                        className={`flex items-center gap-1 ${
                          pricing.currentPrice > pricing.basePrice
                            ? "text-green-300"
                            : "text-orange-300"
                        }`}
                      >
                        {pricing.currentPrice > pricing.basePrice ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {pricing.currentPrice > pricing.basePrice ? "+" : ""}$
                        {(
                          pricing.currentPrice - pricing.basePrice
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="border-t border-white/20 pt-2 flex justify-between font-semibold">
                      <span>Final Offer:</span>
                      <span>${pricing.currentPrice?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Complete Your Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    type="text"
                    value={sellerInfo.name || ""}
                    onChange={(e) =>
                      handleSellerInfoChange("name", e.target.value)
                    }
                    placeholder="Enter your full name"
                    className={`${
                      validationErrors.name
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={sellerInfo.email || ""}
                    onChange={(e) =>
                      handleSellerInfoChange("email", e.target.value)
                    }
                    placeholder="Enter your email"
                    className={`${
                      validationErrors.email
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {validationErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={sellerInfo.phone || ""}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    placeholder="(555) 123-4567"
                    maxLength={14}
                    className={`${
                      validationErrors.phone
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">
                      {validationErrors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address/City
                  </label>
                  <Input
                    type="text"
                    value={sellerInfo.address || ""}
                    onChange={(e) =>
                      handleSellerInfoChange("address", e.target.value)
                    }
                    placeholder="Optional - helps with pickup scheduling"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleAcceptOffer}
                disabled={submissionStatus.isSubmitting}
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg font-semibold shadow-lg"
              >
                {submissionStatus.isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Offer & Schedule
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>

              {submissionStatus.error && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-700">
                    {submissionStatus.error}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Assessment Summary */}
          <Card className="bg-gray-50">
            <CardContent className="p-6">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-600" />
                Assessment Summary
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                Your vehicle assessment is complete with{" "}
                {
                  Object.keys(conditionAnswers).filter(
                    (key) => conditionAnswers[key] !== null
                  ).length
                }{" "}
                questions answered. This helps us provide the most accurate
                offer possible.
              </p>
              <div className="text-xs text-gray-500 pt-3 border-t border-gray-200">
                By accepting this offer, you agree to our terms and conditions.
                Offer valid for 7 days from today.
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
