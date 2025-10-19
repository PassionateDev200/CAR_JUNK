/** route: src/components/quote/VehicleConditionWizard.jsx */
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Box,
  Paper,
  Button,
  Alert,
  AlertTitle,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  Stack,
  Chip,
} from "@mui/material";
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
import { useAuth } from "@/contexts/AuthContext";

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
  },
  {
    id: "key",
    component: KeyQuestion,
    icon: Key,
    label: "Key",
    required: true,
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
  const { isAuthenticated } = useAuth(); // Check if user is already logged in

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
      // Mark step as completed first
      dispatch(vehicleActions.markStepCompleted(2));

      // ✅ Check if user is already authenticated
      if (isAuthenticated) {
        console.log("🎉 All questions completed! User already authenticated, skipping to PricingDisplay...");
        
        // Skip authentication modals, go directly to PricingDisplay
        const completionData = {
          conditionAssessmentComplete: true,
          totalQuestionsAnswered: Object.keys(conditionAnswers).filter(
            (key) => conditionAnswers[key] !== null
          ).length,
          finalPricing: pricing.currentPrice,
        };
        onComplete(completionData);
      } else {
        console.log("🎉 All questions completed! Showing price modal for authentication...");
        
        // Show the price modal with authentication options
        setShowPriceModal(true);
      }
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
      // Mark step as completed first
      dispatch(vehicleActions.markStepCompleted(2));

      // ✅ Check if user is already authenticated
      if (isAuthenticated) {
        console.log("🎉 Last question with sub-question completed! User already authenticated, skipping to PricingDisplay...");
        
        // Skip authentication modals, go directly to PricingDisplay
        const completionData = {
          conditionAssessmentComplete: true,
          totalQuestionsAnswered: Object.keys(conditionAnswers).filter(
            (key) => conditionAnswers[key] !== null
          ).length,
          finalPricing: pricing.currentPrice,
        };
        onComplete(completionData);
      } else {
        console.log("🎉 Last question with sub-question completed! Showing price modal for authentication...");
        
        // Show the price modal with authentication options
        setShowPriceModal(true);
      }
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
    <Box sx={{ width: "100%" }}>

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
            {console.log(
              "VehicleConditionWizard == vehicleDetails ==>",
              vehicleDetails
            )}
            <CurrentQuestionComponent
              vehicleDetails={vehicleDetails}
              vin={vin}
              currentAnswer={conditionAnswers[currentStep.id]}
              onAnswer={(answer, pricing) =>
                handleAnswer(currentStep.id, answer, pricing)
              }
              onPrevious={currentQuestionIndex > 0 ? handlePrevious : null}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalSteps}
            />
          </motion.div>
        ) : (
          <motion.div
            key="sub-question"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <VehicleQuadrantSelector
              title={subQuestionData.title}
              onSelectionComplete={handleSubQuestionComplete}
              vehicleDetails={vehicleDetails}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={totalSteps}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Navigation Sidebar */}
      <Box sx={{ mt: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 2,
            border: "1px solid #e0dfdc",
            bgcolor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(8px)",
            boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.08)",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#666666",
              mb: 2,
            }}
          >
            Progress
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 1,
            }}
          >
            {CONDITION_STEPS.map((step, index) => {
              const status = getStepStatus(index);
              const IconComponent = step.icon;

              return (
                <Box
                  key={step.id}
                  component="button"
                  onClick={() => jumpToStep(index)}
                  disabled={
                    status === "pending" && index > currentQuestionIndex
                  }
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    border: "1px solid",
                    borderColor:
                      status === "completed"
                        ? "#057642"
                        : status === "current"
                        ? "#0a66c2"
                        : "#e0dfdc",
                    bgcolor:
                      status === "completed"
                        ? "#f0f9f6"
                        : status === "current"
                        ? "#edf3f8"
                        : "#f9fafb",
                    color:
                      status === "completed"
                        ? "#057642"
                        : status === "current"
                        ? "#0a66c2"
                        : "#9ca3af",
                    cursor:
                      status === "pending" && index > currentQuestionIndex
                        ? "not-allowed"
                        : "pointer",
                    transition: "all 0.2s ease",
                    "&:hover:not(:disabled)": {
                      bgcolor:
                        status === "completed"
                          ? "#e6f7f0"
                          : status === "current"
                          ? "#e3f0ff"
                          : "#f3f4f6",
                    },
                    "&:disabled": {
                      opacity: 0.5,
                    },
                  }}
                >
                  <IconComponent
                    size={16}
                    style={{ display: "block", margin: "0 auto 4px" }}
                  />
                  <Typography
                    sx={{
                      fontSize: "0.688rem",
                      fontWeight: 500,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {step.label}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Paper>
      </Box>

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
        onClose={() => setShowDisqualificationModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.12)",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            color: "#d32f2f",
            fontWeight: 600,
            fontSize: "1.25rem",
            pb: 2,
          }}
        >
          <XCircle size={24} />
          We're Sorry
        </DialogTitle>

        <DialogContent sx={{ py: 3 }}>
          <Typography
            sx={{
              color: "#666666",
              fontSize: "0.938rem",
              lineHeight: 1.6,
              mb: 2,
            }}
          >
            {disqualificationReason}
          </Typography>
          <Typography
            sx={{
              color: "#9ca3af",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}
          >
            Thank you for your interest in our service.
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 1.5 }}>
          <Button
            variant="outlined"
            onClick={() => setShowDisqualificationModal(false)}
            sx={{
              borderColor: "#e0dfdc",
              color: "#666666",
              "&:hover": {
                borderColor: "#0a66c2",
                bgcolor: "#fafafa",
              },
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            onClick={() => (window.location.href = "/")}
            sx={{
              bgcolor: "#0a66c2",
              "&:hover": {
                bgcolor: "#004182",
              },
            }}
          >
            Back to Home
          </Button>
        </DialogActions>
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
    </Box>
  );
}
