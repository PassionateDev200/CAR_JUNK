/** route: src/components/quote/VehicleConditionWizard.jsx */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  MapPin,
  User,
  FileText,
  Settings,
  Battery,
  Key,
  Car,
  Wrench,
  Gauge,
  Shield,
  AlertTriangle,
  Eye,
  Zap,
  Armchair,
  Flame,
  XCircle,
} from "lucide-react";
import {
  useVehicle,
  useVehicleDispatch,
  vehicleActions,
} from "@/contexts/VehicleContext";

// Individual Question Components
import ZipCodeQuestion from "./questions/ZipCodeQuestion";
import OwnershipQuestion from "./questions/OwnershipQuestion";
import TitleQuestion from "./questions/TitleQuestion";
import WheelsTiresQuestion from "./questions/WheelsTiresQuestion";
import BatteryQuestion from "./questions/BatteryQuestion";
import KeyQuestion from "./questions/KeyQuestion";
import DrivabilityQuestion from "./questions/DrivabilityQuestion";
import EngineTransmissionQuestion from "./questions/EngineTransmissionQuestion";
import MileageQuestion from "./questions/MileageQuestion";
import ExteriorDamageQuestion from "./questions/ExteriorDamageQuestion";
import MissingPartsQuestion from "./questions/MissingPartsQuestion";
import MirrorsGlassLightsQuestion from "./questions/MirrorsGlassLightsQuestion";
import CatalyticConverterQuestion from "./questions/CatalyticConverterQuestion";
import AirbagsQuestion from "./questions/AirbagsQuestion";
import InteriorQuestion from "./questions/InteriorQuestion";
import FloodFireQuestion from "./questions/FloodFireQuestion";
import VehicleQuadrantSelector from "./questions/VehicleQuadrantSelector";

// Authentication Modals
import PriceModal from "./PriceModal";
import AccountModal from "./AccountModal";

// Define the complete question flow
const CONDITION_STEPS = [
  {
    id: "zipcode",
    component: ZipCodeQuestion,
    icon: MapPin,
    label: "Pickup Location",
    required: true,
  },
  {
    id: "ownership",
    component: OwnershipQuestion,
    icon: User,
    label: "Ownership",
    required: true,
    disqualifyingAnswers: ["loan_payments", "lease_payments"],
  },
  {
    id: "title",
    component: TitleQuestion,
    icon: FileText,
    label: "Title Status",
    required: true,
    disqualifyingAnswers: ["no_title"],
  },
  {
    id: "wheels_tires",
    component: WheelsTiresQuestion,
    icon: Settings,
    label: "Wheels & Tires",
    required: true,
    hasSubQuestion: true,
    subQuestionTrigger: ["one_or_more_flat", "one_or_more_missing"],
  },
  {
    id: "battery",
    component: BatteryQuestion,
    icon: Battery,
    label: "Battery",
    required: true,
    disqualifyingAnswers: ["no_battery"],
  },
  {
    id: "key",
    component: KeyQuestion,
    icon: Key,
    label: "Key",
    required: true,
    disqualifyingAnswers: ["no_key"],
  },
  {
    id: "drivability",
    component: DrivabilityQuestion,
    icon: Car,
    label: "Drivability",
    required: true,
  },
  {
    id: "engine_transmission",
    component: EngineTransmissionQuestion,
    icon: Wrench,
    label: "Engine/Transmission",
    required: true,
  },
  {
    id: "mileage",
    component: MileageQuestion,
    icon: Gauge,
    label: "Mileage",
    required: true,
  },
  {
    id: "exterior_damage",
    component: ExteriorDamageQuestion,
    icon: Shield,
    label: "Exterior Damage",
    required: true,
    hasSubQuestion: true,
    subQuestionTrigger: ["has_damage"],
  },
  {
    id: "missing_parts",
    component: MissingPartsQuestion,
    icon: AlertTriangle,
    label: "Missing Parts",
    required: true,
    hasSubQuestion: true,
    subQuestionTrigger: ["missing_parts"],
  },
  {
    id: "mirrors_glass_lights",
    component: MirrorsGlassLightsQuestion,
    icon: Eye,
    label: "Mirrors/Glass/Lights",
    required: true,
    hasSubQuestion: true,
    subQuestionTrigger: ["damaged_missing"],
  },
  {
    id: "catalytic_converter",
    component: CatalyticConverterQuestion,
    icon: Zap,
    label: "Catalytic Converter",
    required: true,
  },
  {
    id: "airbags",
    component: AirbagsQuestion,
    icon: Shield,
    label: "Airbags",
    required: true,
  },
  {
    id: "interior",
    component: InteriorQuestion,
    icon: Armchair,
    label: "Interior",
    required: true,
  },
  {
    id: "flood_fire",
    component: FloodFireQuestion,
    icon: Flame,
    label: "Flood/Fire Damage",
    required: true,
  },
];

export default function VehicleConditionWizard({ onComplete }) {
  // Get state and dispatch from context
  const vehicleState = useVehicle();
  const dispatch = useVehicleDispatch();

  const {
    vehicleDetails,
    vin,
    conditionAnswers,
    currentQuestionIndex,
    pricing,
    questionPricing, // NEW: Access question pricing
    submissionStatus,
  } = vehicleState;

  // Local state for UI components
  const [showDisqualificationModal, setShowDisqualificationModal] =
    useState(false);
  const [disqualificationReason, setDisqualificationReason] = useState("");
  const [showSubQuestion, setShowSubQuestion] = useState(false);
  const [subQuestionData, setSubQuestionData] = useState(null);
  
  // Authentication modal states
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [accountModalMode, setAccountModalMode] = useState("create"); // "create" or "login"

  const currentStep = CONDITION_STEPS[currentQuestionIndex];
  const CurrentQuestionComponent = currentStep.component;
  const totalSteps = CONDITION_STEPS.length;

  // Initialize base pricing if not set
  useEffect(() => {
    if (pricing.basePrice === 0 && vehicleDetails.year) {
      const basePrice = calculateBasePrice(vehicleDetails);
      dispatch(
        vehicleActions.setPricing({
          basePrice,
          currentPrice: basePrice,
        })
      );
    }
  }, [vehicleDetails, pricing.basePrice, dispatch]);

  // Calculate base price for junk cars (realistic pricing)
  const calculateBasePrice = (vehicleData) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(vehicleData.year);

    // Base pricing for junk cars: $400-$600 range
    let basePrice = 600; // Starting base for newer cars

    // Age-based pricing (most cars are pre-2020)
    if (age >= 20) {
      basePrice = 400; // Very old cars: $400
    } else if (age >= 10) {
      basePrice = 500; // 10-20 years old: $500
    } else if (age >= 5) {
      basePrice = 600; // 5-10 years old: $600
    } else {
      basePrice = 800; // Less than 5 years: $800 (rare for junk cars)
    }

    // Premium makes adjustment (smaller for junk cars)
    const premiumMakes = [
      "BMW",
      "MERCEDES",
      "AUDI",
      "LEXUS",
      "ACURA",
      "INFINITI",
    ];
    if (premiumMakes.includes(vehicleData.make?.toUpperCase())) {
      basePrice += 200; // Only $200 premium for luxury brands in junk condition
    }

    // High-demand makes get slight boost
    const popularMakes = ["TOYOTA", "HONDA", "FORD", "CHEVROLET", "NISSAN"];
    if (popularMakes.includes(vehicleData.make?.toUpperCase())) {
      basePrice += 100; // Popular brands hold value better
    }

    // Truck/SUV premium (parts are more valuable)
    const truckSuvKeywords = [
      "TRUCK",
      "SUV",
      "PICKUP",
      "F-150",
      "SILVERADO",
      "RAM",
      "TAHOE",
      "SUBURBAN",
    ];
    if (
      truckSuvKeywords.some(
        (keyword) =>
          vehicleData.model?.toUpperCase().includes(keyword) ||
          vehicleData.trim?.toUpperCase().includes(keyword)
      )
    ) {
      basePrice += 150; // Trucks/SUVs worth more for parts
    }

    return Math.max(basePrice, 300); // Minimum $300 (even for worst condition)
  };

  // ✅ FIXED: Handle answer submission with proper completion data
  const handleAnswer = (questionId, answer, pricingAdjustment = null) => {
    console.log("questionID ====> ", questionId);
    console.log("answer ====> ", answer);
    console.log("pricingAdjustment ====> ", pricingAdjustment);

    // Save the answer to context
    dispatch(vehicleActions.setConditionAnswer(questionId, answer));

    // Apply pricing adjustment using new system
    if (pricingAdjustment) {
      dispatch(
        vehicleActions.setQuestionPricing(questionId, pricingAdjustment.amount)
      );
    }

    // Clean up sub-question pricing when main question doesn't trigger sub-question
    const currentStep = CONDITION_STEPS.find((step) => step.id === questionId);
    if (
      currentStep?.hasSubQuestion &&
      !currentStep.subQuestionTrigger?.includes(answer)
    ) {
      dispatch(
        vehicleActions.setQuestionPricing(`${questionId}_damage_areas`, 0)
      );
    }

    // Check for disqualifying answers
    if (isDisqualifyingAnswer(questionId, answer)) {
      setDisqualificationReason(getDisqualificationMessage(questionId, answer));
      setShowDisqualificationModal(true);
      return;
    }

    // Check for sub-questions
    if (
      currentStep?.hasSubQuestion &&
      currentStep.subQuestionTrigger?.includes(answer)
    ) {
      setSubQuestionData({
        questionId: `${questionId}_location`,
        parentQuestion: questionId,
        answer: answer,
        title: getSubQuestionTitle(questionId, answer),
      });
      setShowSubQuestion(true);
      return;
    }

    // Move to next step or complete
    if (currentQuestionIndex < CONDITION_STEPS.length - 1) {
      dispatch(vehicleActions.setCurrentQuestion(currentQuestionIndex + 1));
    } else {
      // ✅ NEW: Show PriceModal instead of going directly to PricingDisplay
      console.log("🎉 All questions completed! Showing price modal...");

      // Mark step as completed first
      dispatch(vehicleActions.markStepCompleted(2));

      // Show the price modal with authentication options
      setShowPriceModal(true);
    }
  };

  // ✅ FIXED: Handle sub-question completion with proper data
  const handleSubQuestionComplete = (selectedAreas) => {
    const parentQuestionId = subQuestionData.parentQuestion;
    const subQuestionId = subQuestionData.questionId;

    // Save sub-question answer to context
    dispatch(vehicleActions.setConditionAnswer(subQuestionId, selectedAreas));

    // Apply additional pricing adjustment for damage areas
    const damageAmount = -25 * selectedAreas.length;
    dispatch(
      vehicleActions.setQuestionPricing(
        `${parentQuestionId}_damage_areas`,
        damageAmount
      )
    );

    setShowSubQuestion(false);
    setSubQuestionData(null);

    // Move to next step
    if (currentQuestionIndex < CONDITION_STEPS.length - 1) {
      dispatch(vehicleActions.setCurrentQuestion(currentQuestionIndex + 1));
    } else {
      // ✅ NEW: Show PriceModal after sub-question completion
      console.log("🎉 Last question with sub-question completed! Showing price modal...");

      dispatch(vehicleActions.markStepCompleted(2));

      // Show the price modal with authentication options
      setShowPriceModal(true);
    }
  };

  // Modal handler functions
  const handleCreateAccount = () => {
    setAccountModalMode("create");
    setShowPriceModal(false);
    setShowAccountModal(true);
  };

  const handleLogin = () => {
    setAccountModalMode("login");
    setShowPriceModal(false);
    setShowAccountModal(true);
  };

  const handleAccountSuccess = () => {
    // Close account modal
    setShowAccountModal(false);
    
    // Proceed to PricingDisplay
    const completionData = {
      conditionAssessmentComplete: true,
      totalQuestionsAnswered: Object.keys(conditionAnswers).filter(
        (key) => conditionAnswers[key] !== null
      ).length,
      finalPricing: pricing.currentPrice,
    };
    
    onComplete(completionData);
  };

  const handlePriceModalClose = () => {
    setShowPriceModal(false);
  };

  const handleAccountModalClose = () => {
    setShowAccountModal(false);
    // Optionally reopen price modal
    setShowPriceModal(true);
  };

  // Navigation functions (context-aware)
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      dispatch(vehicleActions.setCurrentQuestion(currentQuestionIndex - 1));
    }
  };

  const jumpToStep = (stepIndex) => {
    // Allow jumping to completed steps or current/previous steps
    const hasAnswer = conditionAnswers[CONDITION_STEPS[stepIndex].id] !== null;
    if (hasAnswer || stepIndex <= currentQuestionIndex) {
      dispatch(vehicleActions.setCurrentQuestion(stepIndex));
    }
  };

  // Helper functions
  const isDisqualifyingAnswer = (questionId, answer) => {
    const step = CONDITION_STEPS.find((s) => s.id === questionId);
    return step?.disqualifyingAnswers?.includes(answer);
  };

  const getDisqualificationMessage = (questionId, answer) => {
    const messages = {
      ownership:
        "We're sorry, but we can only purchase vehicles that are owned outright. If your situation changes in the future, please feel free to get another quote.",
      title:
        "We require a clean title to complete the purchase. If you obtain the title, please feel free to get another quote.",
      battery:
        "A working battery is required for vehicle pickup. If you install a working battery, please get another quote.",
      key: "We need a key to complete the vehicle purchase. If you obtain a key, please get another quote.",
    };

    return (
      messages[questionId] ||
      "Unfortunately, we cannot proceed with this vehicle based on your response."
    );
  };

  const getSubQuestionTitle = (questionId, answer) => {
    const titles = {
      wheels_tires: "Which wheels or tires are affected on your vehicle?",
      exterior_damage: "Where is the exterior damage located?",
      missing_parts: "Where are the missing or loose exterior parts?",
      mirrors_glass_lights:
        "Where are the damaged or missing mirrors, glass, or lights?",
    };

    return titles[questionId] || "Select the affected areas on your vehicle";
  };

  const getStepStatus = (stepIndex) => {
    const hasAnswer = conditionAnswers[CONDITION_STEPS[stepIndex].id] !== null;
    if (hasAnswer) return "completed";
    if (stepIndex === currentQuestionIndex) return "current";
    return "pending";
  };

  return (
    <div className="space-y-6">
      {/* Progress Header - Hidden by default to match original style */}
      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl border-0 hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Vehicle Condition Assessment
              </h2>
              <p className="text-blue-100">
                Help us determine the most accurate offer for your{" "}
                {vehicleDetails.year} {vehicleDetails.make}{" "}
                {vehicleDetails.model}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">
                {currentQuestionIndex + 1}
              </div>
              <div className="text-sm text-blue-100">of {totalSteps}</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 bg-blue-500/30 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / totalSteps) * 100}%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Main Question Card */}
      <AnimatePresence mode="wait">
        {!showSubQuestion ? (
          <motion.div
            key={`question-${currentQuestionIndex}`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl border-0 bg-white">
              <CardContent className="p-8">
                {console.log(
                  "VehicleConditionWizard == vehicleDetails ==>",
                  vehicleDetails
                )}
                <CurrentQuestionComponent
                  vehicleDetails={vehicleDetails}
                  vin={vin}
                  currentAnswer={conditionAnswers[currentStep.id]} // PERSISTS FROM CONTEXT!
                  onAnswer={(answer, pricing) =>
                    handleAnswer(currentStep.id, answer, pricing)
                  }
                  onPrevious={currentQuestionIndex > 0 ? handlePrevious : null}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={totalSteps}
                />
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="sub-question"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-xl border-0 bg-white">
              <CardContent className="p-8">
                <VehicleQuadrantSelector
                  title={subQuestionData.title}
                  onSelectionComplete={handleSubQuestionComplete}
                  vehicleDetails={vehicleDetails}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={totalSteps}
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Navigation Sidebar */}
      <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Progress</h3>
          <div className="grid grid-cols-4 gap-2">
            {CONDITION_STEPS.map((step, index) => {
              const status = getStepStatus(index);
              const IconComponent = step.icon;

              return (
                <button
                  key={step.id}
                  onClick={() => jumpToStep(index)}
                  disabled={
                    status === "pending" && index > currentQuestionIndex
                  }
                  className={`p-2 rounded-lg transition-all text-xs ${
                    status === "completed"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : status === "current"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  <IconComponent className="h-4 w-4 mx-auto mb-1" />
                  <div className="truncate">{step.label}</div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* UPDATED: Real-time Pricing Display */}
      {/* {pricing.currentPrice > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 lg:relative lg:bottom-auto lg:right-auto"
        >
          <Card className="bg-green-50 border-2 border-green-200 shadow-lg">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  ${pricing.currentPrice?.toLocaleString()}
                </div>
                <p className="text-xs text-green-700">Current Offer</p>
                {Object.keys(questionPricing).some(
                  (key) => questionPricing[key] !== 0
                ) && (
                  <p className="text-xs text-gray-600 mt-1">
                    {
                      Object.values(questionPricing).filter((val) => val !== 0)
                        .length
                    }{" "}
                    adjustment
                    {Object.values(questionPricing).filter((val) => val !== 0)
                      .length !== 1
                      ? "s"
                      : ""}{" "}
                    applied
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )} */}

      {/* UPDATED: Debug Info (Remove in production) */}
      {/* {process.env.NODE_ENV === "development" && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <h4 className="text-sm font-bold text-yellow-800 mb-2">
              Debug Info
            </h4>
            <div className="text-xs text-yellow-700 space-y-1">
              <div>Current Question Index: {currentQuestionIndex}</div>
              <div>Current Question: {currentStep.id}</div>
              <div>
                Answered Questions:{" "}
                {
                  Object.keys(conditionAnswers).filter(
                    (key) => conditionAnswers[key] !== null
                  ).length
                }
              </div>
              <div>Base Price: ${pricing.basePrice}</div>
              <div>Current Price: ${pricing.currentPrice}</div>
              <div>
                Question Adjustments:{" "}
                {
                  Object.values(questionPricing).filter((val) => val !== 0)
                    .length
                }
              </div>
              <div>
                Is Last Question:{" "}
                {currentQuestionIndex === CONDITION_STEPS.length - 1
                  ? "YES"
                  : "NO"}
              </div>
            </div>
          </CardContent>
        </Card>
      )} */}

      {/* Disqualification Modal */}
      <Dialog
        open={showDisqualificationModal}
        onOpenChange={setShowDisqualificationModal}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-6 w-6" />
              We're Sorry
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-gray-700 mb-4">{disqualificationReason}</p>
            <p className="text-sm text-gray-500">
              Thank you for your interest in our service.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowDisqualificationModal(false)}
            >
              Close
            </Button>
            <Button onClick={() => (window.location.href = "/")}>
              Back to Home
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Price Modal - Shows after all questions completed */}
      <PriceModal
        isOpen={showPriceModal}
        onClose={handlePriceModalClose}
        onCreateAccount={handleCreateAccount}
        onLogin={handleLogin}
      />

      {/* Account Modal - For registration/login */}
      <AccountModal
        isOpen={showAccountModal}
        onClose={handleAccountModalClose}
        mode={accountModalMode}
        onSuccess={handleAccountSuccess}
      />
    </div>
  );
}
