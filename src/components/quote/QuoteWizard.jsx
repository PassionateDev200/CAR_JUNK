/** route: src/components/quote/QuoteWizard.jsx */
"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VehicleBasicInfo from "./VehicleBasicInfo";
import VehicleConditionWizard from "./VehicleConditionWizard";
import PricingDisplay from "./PricingDisplay";
import ResetButton from "@/components/ui/ResetButton";
import { Card } from "@/components/ui/card";
import { CheckCircle, Car, MapPin, Sparkles } from "lucide-react";
import {
  useVehicle,
  useVehicleDispatch,
  vehicleActions,
} from "@/contexts/VehicleContext";

const STEPS = {
  BASIC_INFO: 1,
  CONDITION_ASSESSMENT: 2,
  FINAL_QUOTE: 3,
};

export default function QuoteWizard() {
  // Get state and dispatch from context
  const vehicleState = useVehicle();
  const dispatch = useVehicleDispatch();

  const {
    currentStep,
    vehicleDetails,
    vin,
    conditionAnswers,
    pricing,
    questionPricing, // NEW: Access question pricing
    zipCode,
    locationData,
    completedSteps,
  } = vehicleState;

  // ✅ FIXED: Handle step completion with proper logic for condition assessment
  const handleStepComplete = (stepData) => {
    console.log("QuoteWizard == handleStepComplete = stepData ==> ", stepData);

    // ✅ NEW: Handle condition assessment completion
    if (stepData?.conditionAssessmentComplete) {
      console.log(
        "🎯 Condition Assessment completed, moving to Final Quote step"
      );

      // Move to final quote step (PricingDisplay)
      dispatch(vehicleActions.setCurrentStep(STEPS.FINAL_QUOTE));
      return;
    }

    // Handle basic info completion (existing logic)
    if (stepData?.vehicleDetails) {
      dispatch(vehicleActions.setVehicleDetails(stepData.vehicleDetails));
    }

    if (stepData?.vin) {
      dispatch(vehicleActions.setVin(stepData.vin));
    }

    // Mark current step as completed
    dispatch(vehicleActions.markStepCompleted(currentStep));

    // Move to next step
    if (currentStep < 3) {
      dispatch(vehicleActions.setCurrentStep(currentStep + 1));
    }
  };

  // UPDATED: Handle condition updates from the wizard
  const handleConditionUpdate = (
    questionId,
    answer,
    pricingAdjustment = null
  ) => {
    // Update condition answer in context
    dispatch(vehicleActions.setConditionAnswer(questionId, answer));

    // UPDATED: Apply pricing adjustment using new system
    if (pricingAdjustment) {
      dispatch(
        vehicleActions.setQuestionPricing(questionId, pricingAdjustment.amount)
      );
    }
  };

  // UPDATED: Handle pricing updates from basic info
  const updatePricing = (adjustments) => {
    if (adjustments && adjustments.length > 0) {
      const adjustment = adjustments[0];
      if (adjustment.type === "base_price") {
        dispatch(
          vehicleActions.setPricing({
            basePrice: adjustment.amount,
            currentPrice: adjustment.amount,
          })
        );
      } else {
        // UPDATED: Use new question pricing system
        dispatch(
          vehicleActions.setQuestionPricing(adjustment.type, adjustment.amount)
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-20 ">
          {/* ORIGINAL SIDEBAR - EXACT STYLING */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-xl border-0">
                <div className="space-y-6">
                  {/* ORIGINAL HEADER */}
                  <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">
                      We'll keep track of your answers over here.
                    </h2>
                    <p className="text-sm text-gray-600">
                      You can jump back to a previous question any time.
                    </p>
                  </div>

                  {/* ORIGINAL VEHICLE DETAILS TAGS - EXACT STYLE */}
                  {(vehicleDetails.year ||
                    vehicleDetails.make ||
                    vehicleDetails.model ||
                    vin) && (
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Vehicle Details
                      </h3>

                      {/* ORIGINAL COLORED TAGS */}
                      <div className="flex flex-wrap gap-2">
                        {vehicleDetails.year && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                            Year: {vehicleDetails.year}
                          </span>
                        )}
                        {vehicleDetails.make && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            Make: {vehicleDetails.make}
                          </span>
                        )}
                        {vehicleDetails.model && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            Model: {vehicleDetails.model}
                          </span>
                        )}
                        {vehicleDetails.trim && (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
                            Trim: {vehicleDetails.trim}
                          </span>
                        )}
                      </div>

                      {/* ORIGINAL VIN DISPLAY */}
                      {vin && (
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">
                              VIN
                            </span>
                            <Sparkles className="h-3 w-3 text-gray-400" />
                          </div>
                          <div className="font-mono text-sm text-gray-800 break-all leading-relaxed">
                            {vin}
                          </div>
                        </div>
                      )}

                      {/* ORIGINAL ZIP CODE DISPLAY */}
                      {zipCode && locationData && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-600">Pickup:</span>
                          <span className="font-medium text-gray-800">
                            {locationData.city}, {locationData.state} {zipCode}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* UPDATED: PRICING DISPLAY */}
                  {pricing.currentPrice > 0 && (
                    <div className="space-y-4">
                      <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                        <div className="text-3xl font-bold text-green-600">
                          ${pricing.currentPrice?.toLocaleString()}
                        </div>
                        <p className="text-xs text-green-700 mt-1">
                          Current Offer
                        </p>
                      </div>

                      {/* UPDATED: PRICING BREAKDOWN */}
                      {Object.keys(questionPricing).some(
                        (key) => questionPricing[key] !== 0
                      ) && (
                        <div className="text-xs space-y-1 bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between font-medium text-gray-700">
                            <span>Base Price:</span>
                            <span>${pricing.basePrice?.toLocaleString()}</span>
                          </div>
                          {Object.entries(questionPricing)
                            .filter(([key, value]) => value !== 0)
                            .map(([questionId, amount]) => (
                              <div
                                key={questionId}
                                className="flex justify-between text-gray-600"
                              >
                                <span className="capitalize">
                                  {questionId.replace(/_/g, " ")}:
                                </span>
                                <span
                                  className={
                                    amount < 0
                                      ? "text-red-600"
                                      : "text-green-600"
                                  }
                                >
                                  {amount > 0 ? "+" : ""}${amount}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ORIGINAL STEP PROGRESS */}
                  <div className="space-y-3">
                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        currentStep === STEPS.BASIC_INFO
                          ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm"
                          : completedSteps.includes(STEPS.BASIC_INFO)
                          ? "bg-green-50 border-l-4 border-green-500 shadow-sm"
                          : "bg-gray-50 border-l-4 border-gray-300"
                      }`}
                    >
                      <CheckCircle
                        className={`h-5 w-5 ${
                          completedSteps.includes(STEPS.BASIC_INFO)
                            ? "text-green-600"
                            : currentStep === STEPS.BASIC_INFO
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          Vehicle Information
                        </p>
                        <p className="text-xs text-gray-600">
                          Year, make, model, VIN
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        currentStep === STEPS.CONDITION_ASSESSMENT
                          ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm"
                          : completedSteps.includes(STEPS.CONDITION_ASSESSMENT)
                          ? "bg-green-50 border-l-4 border-green-500 shadow-sm"
                          : "bg-gray-50 border-l-4 border-gray-300"
                      }`}
                    >
                      <CheckCircle
                        className={`h-5 w-5 ${
                          completedSteps.includes(STEPS.CONDITION_ASSESSMENT)
                            ? "text-green-600"
                            : currentStep === STEPS.CONDITION_ASSESSMENT
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          Vehicle Condition
                        </p>
                        <p className="text-xs text-gray-600">
                          Detailed assessment
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        currentStep === STEPS.FINAL_QUOTE
                          ? "bg-blue-50 border-l-4 border-blue-500 shadow-sm"
                          : "bg-gray-50 border-l-4 border-gray-300"
                      }`}
                    >
                      <CheckCircle
                        className={`h-5 w-5 ${
                          currentStep === STEPS.FINAL_QUOTE
                            ? "text-blue-600"
                            : "text-gray-400"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-800">
                          Get Your Offer
                        </p>
                        <p className="text-xs text-gray-600">Final pricing</p>
                      </div>
                    </div>
                  </div>

                  {/* ORIGINAL TIPS SECTION */}
                  {/* <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      💡 Tips
                    </h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Be honest about condition for accurate pricing</li>
                      <li>• Price updates in real-time as you answer</li>
                      <li>• You can go back to change any answer</li>
                      <li>• Free pickup included with every offer</li>
                    </ul>
                  </div> */}
                </div>
                {/* FLOATING RESET BUTTON */}
                <ResetButton
                  // position="floating"
                  size="default" // Changed from "sm" to make it bigger
                  style="warning" // Makes it orange/amber gradient
                  className="shadow-2xl hover:shadow-3xl transition-all duration-300 animate-pulse"
                />
              </Card>
            </div>
          </div>

          {/* MAIN CONTENT WITH ORIGINAL ANIMATIONS */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {console.log("QuoteWizard == currentStep ==> ", currentStep)}
              {currentStep === STEPS.BASIC_INFO && (
                <motion.div
                  key="basic-info"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <VehicleBasicInfo
                    onComplete={handleStepComplete}
                    onPricingUpdate={updatePricing}
                  />
                </motion.div>
              )}

              {currentStep === STEPS.CONDITION_ASSESSMENT && (
                <motion.div
                  key="condition-assessment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <VehicleConditionWizard
                    onComplete={handleStepComplete}
                    onConditionUpdate={handleConditionUpdate}
                  />
                </motion.div>
              )}

              {currentStep === STEPS.FINAL_QUOTE && (
                <motion.div
                  key="final-quote"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PricingDisplay />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
