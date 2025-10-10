/** route: src/components/quote/QuoteWizard.jsx */
"use client";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VehicleBasicInfo from "./VehicleBasicInfo";
import VehicleConditionWizard from "./VehicleConditionWizard";
import PricingDisplay from "./PricingDisplay";
import ResetButton from "@/components/ui/ResetButton";
import { CheckCircle, Car, MapPin, Sparkles } from "lucide-react";
import {
  Box,
  Container,
  Paper,
  Typography,
  Chip,
  Stack,
  Divider,
  LinearProgress,
} from "@mui/material";
import {
  CheckCircleOutline,
  RadioButtonUnchecked,
  DirectionsCar,
  LocationOn,
  AutoAwesome,
} from "@mui/icons-material";
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
    questionPricing,
    zipCode,
    locationData,
    completedSteps,
  } = vehicleState;

  // Handle step completion with proper logic for condition assessment
  const handleStepComplete = (stepData) => {
    console.log("QuoteWizard == handleStepComplete = stepData ==> ", stepData);

    // Handle condition assessment completion
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

  // Handle condition updates from the wizard
  const handleConditionUpdate = (
    questionId,
    answer,
    pricingAdjustment = null
  ) => {
    // Update condition answer in context
    dispatch(vehicleActions.setConditionAnswer(questionId, answer));

    // Apply pricing adjustment using new system
    if (pricingAdjustment) {
      dispatch(
        vehicleActions.setQuestionPricing(questionId, pricingAdjustment.amount)
      );
    }
  };

  // Handle pricing updates from basic info
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
        // Use new question pricing system
        dispatch(
          vehicleActions.setQuestionPricing(adjustment.type, adjustment.amount)
        );
      }
    }
  };

  // Calculate progress percentage
  const progressPercentage = (completedSteps.length / 3) * 100;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f2ef",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "320px 1fr" }, gap: 3, mt: 10 }}>
          {/* SIDEBAR - LinkedIn Style with MUI */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Box sx={{ position: "sticky", top: 24 }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "#e0dfdc",
                  bgcolor: "#ffffff",
                  boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.08)",
                }}
              >
                {/* HEADER */}
                <Box sx={{ mb: 4, pb: 3, borderBottom: "1px solid", borderColor: "#e0dfdc" }}>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      fontSize: "1.25rem",
                      fontWeight: 700,
                      color: "#000000",
                      mb: 1,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    Your Progress
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mb: 3, 
                      fontSize: "0.938rem", 
                      color: "#666666",
                      fontWeight: 400,
                      lineHeight: 1.5,
                    }}
                  >
                    Track your quote steps
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={progressPercentage} 
                    sx={{ 
                      height: 10, 
                      borderRadius: 2,
                      bgcolor: "#e0dfdc",
                      "& .MuiLinearProgress-bar": {
                        bgcolor: "#057642",
                        borderRadius: 2,
                      }
                    }} 
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      mt: 1.5, 
                      display: "block", 
                      fontSize: "0.875rem", 
                      color: "#666666",
                      fontWeight: 500,
                    }}
                  >
                    {completedSteps.length} of 3 steps completed
                  </Typography>
                </Box>

                {/* VEHICLE DETAILS */}
                {(vehicleDetails.year ||
                  vehicleDetails.make ||
                  vehicleDetails.model ||
                  vin) && (
                  <Box sx={{ mb: 3 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
                      <DirectionsCar sx={{ fontSize: 24, color: "#666666" }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          fontSize: "1.063rem", 
                          fontWeight: 700,
                          color: "#000000",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        Vehicle Details
                      </Typography>
                    </Stack>

                    {/* Vehicle Tags - Polished LinkedIn style */}
                    <Stack spacing={2}>
                      {vehicleDetails.year && (
                        <Paper
                          elevation={0}
                          sx={{
                            bgcolor: "#edf3f8",
                            border: "1.5px solid #b9d6f2",
                            borderRadius: 2,
                            px: 2.5,
                            py: 1.5,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: "#0a66c2",
                              bgcolor: "#e3f0ff",
                            },
                          }}
                        >
                          <Typography 
                            sx={{ 
                              fontSize: "0.938rem", 
                              fontWeight: 600,
                              color: "#0a66c2",
                              letterSpacing: "0.01em",
                            }}
                          >
                            Year: {vehicleDetails.year}
                          </Typography>
                        </Paper>
                      )}
                      {vehicleDetails.make && (
                        <Paper
                          elevation={0}
                          sx={{
                            bgcolor: "#edf3f8",
                            border: "1.5px solid #b9d6f2",
                            borderRadius: 2,
                            px: 2.5,
                            py: 1.5,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: "#0a66c2",
                              bgcolor: "#e3f0ff",
                            },
                          }}
                        >
                          <Typography 
                            sx={{ 
                              fontSize: "0.938rem", 
                              fontWeight: 600,
                              color: "#0a66c2",
                              letterSpacing: "0.01em",
                            }}
                          >
                            Make: {vehicleDetails.make}
                          </Typography>
                        </Paper>
                      )}
                      {vehicleDetails.model && (
                        <Paper
                          elevation={0}
                          sx={{
                            bgcolor: "#edf3f8",
                            border: "1.5px solid #b9d6f2",
                            borderRadius: 2,
                            px: 2.5,
                            py: 1.5,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: "#0a66c2",
                              bgcolor: "#e3f0ff",
                            },
                          }}
                        >
                          <Typography 
                            sx={{ 
                              fontSize: "0.938rem", 
                              fontWeight: 600,
                              color: "#0a66c2",
                              letterSpacing: "0.01em",
                            }}
                          >
                            Model: {vehicleDetails.model}
                          </Typography>
                        </Paper>
                      )}
                      {vehicleDetails.trim && (
                        <Paper
                          elevation={0}
                          sx={{
                            bgcolor: "#edf3f8",
                            border: "1.5px solid #b9d6f2",
                            borderRadius: 2,
                            px: 2.5,
                            py: 1.5,
                            transition: "all 0.2s ease",
                            "&:hover": {
                              borderColor: "#0a66c2",
                              bgcolor: "#e3f0ff",
                            },
                          }}
                        >
                          <Typography 
                            sx={{ 
                              fontSize: "0.938rem", 
                              fontWeight: 600,
                              color: "#0a66c2",
                              letterSpacing: "0.01em",
                            }}
                          >
                            Trim: {vehicleDetails.trim}
                          </Typography>
                        </Paper>
                      )}
                    </Stack>

                    {/* VIN DISPLAY */}
                    {vin && (
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 3,
                          p: 2.5,
                          bgcolor: "#f9fafb",
                          border: "1.5px solid",
                          borderColor: "#e0dfdc",
                          borderRadius: 2,
                          transition: "all 0.2s ease",
                          "&:hover": {
                            borderColor: "#b9d6f2",
                            bgcolor: "#ffffff",
                          },
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Typography 
                            variant="body2" 
                            sx={{ 
                              fontSize: "0.875rem", 
                              color: "#666666",
                              fontWeight: 600,
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            VIN Number
                          </Typography>
                          <AutoAwesome sx={{ fontSize: 18, color: "#9ca3af" }} />
                        </Stack>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            display: "block",
                            wordBreak: "break-all",
                            lineHeight: 1.7,
                            color: "#000000",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                          }}
                        >
                          {vin}
                        </Typography>
                      </Paper>
                    )}

                    {/* ZIP CODE DISPLAY */}
                    {zipCode && locationData && (
                      <Paper
                        elevation={0}
                        sx={{
                          mt: 1.5,
                          p: 2,
                          bgcolor: "#f9fafb",
                          border: "1px solid",
                          borderColor: "#e0dfdc",
                          borderRadius: 2,
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LocationOn sx={{ fontSize: 18, color: "#666666" }} />
                          <Typography variant="body2" sx={{ fontSize: "0.813rem", color: "#666666" }}>
                            Pickup:
                          </Typography>
                          <Typography variant="body2" fontWeight={600} sx={{ fontSize: "0.875rem", color: "#000000" }}>
                            {locationData.city}, {locationData.state} {zipCode}
                          </Typography>
                        </Stack>
                      </Paper>
                    )}
                  </Box>
                )}

                <Divider sx={{ my: 3 }} />

                {/* STEP PROGRESS - Sophisticated LinkedIn style */}
                <Box>
                  <Typography variant="subtitle1" fontWeight={600} mb={2} sx={{ fontSize: "1rem", color: "#000000" }}>
                    Steps
                  </Typography>
                  <Stack spacing={2}>
                    {/* Step 1 */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor:
                          currentStep === STEPS.BASIC_INFO
                            ? "#0a66c2"
                            : completedSteps.includes(STEPS.BASIC_INFO)
                            ? "#057642"
                            : "#e0dfdc",
                        bgcolor:
                          currentStep === STEPS.BASIC_INFO
                            ? "#edf3f8"
                            : completedSteps.includes(STEPS.BASIC_INFO)
                            ? "#f0f9f6"
                            : "#ffffff",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: currentStep === STEPS.BASIC_INFO ? "#edf3f8" : "#fafafa",
                          boxShadow: "0 1px 3px rgba(0,0,0,.08)",
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {completedSteps.includes(STEPS.BASIC_INFO) ? (
                          <CheckCircleOutline sx={{ fontSize: 22, color: "#057642" }} />
                        ) : currentStep === STEPS.BASIC_INFO ? (
                          <RadioButtonUnchecked sx={{ fontSize: 22, color: "#0a66c2" }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ fontSize: 22, color: "#9ca3af" }} />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight={600} sx={{ fontSize: "0.938rem", color: "#000000" }}>
                            Vehicle Information
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: "0.813rem", mt: 0.5, color: "#666666" }}>
                            Year, make, model, VIN
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Step 2 */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor:
                          currentStep === STEPS.CONDITION_ASSESSMENT
                            ? "#0a66c2"
                            : completedSteps.includes(STEPS.CONDITION_ASSESSMENT)
                            ? "#057642"
                            : "#e0dfdc",
                        bgcolor:
                          currentStep === STEPS.CONDITION_ASSESSMENT
                            ? "#edf3f8"
                            : completedSteps.includes(STEPS.CONDITION_ASSESSMENT)
                            ? "#f0f9f6"
                            : "#ffffff",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: currentStep === STEPS.CONDITION_ASSESSMENT ? "#edf3f8" : "#fafafa",
                          boxShadow: "0 1px 3px rgba(0,0,0,.08)",
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {completedSteps.includes(STEPS.CONDITION_ASSESSMENT) ? (
                          <CheckCircleOutline sx={{ fontSize: 22, color: "#057642" }} />
                        ) : currentStep === STEPS.CONDITION_ASSESSMENT ? (
                          <RadioButtonUnchecked sx={{ fontSize: 22, color: "#0a66c2" }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ fontSize: 22, color: "#9ca3af" }} />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight={600} sx={{ fontSize: "0.938rem", color: "#000000" }}>
                            Vehicle Condition
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: "0.813rem", mt: 0.5, color: "#666666" }}>
                            Detailed assessment
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>

                    {/* Step 3 */}
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "2px solid",
                        borderColor:
                          currentStep === STEPS.FINAL_QUOTE ? "#0a66c2" : "#e0dfdc",
                        bgcolor:
                          currentStep === STEPS.FINAL_QUOTE ? "#edf3f8" : "#ffffff",
                        transition: "all 0.2s ease",
                        cursor: "pointer",
                        "&:hover": {
                          bgcolor: currentStep === STEPS.FINAL_QUOTE ? "#edf3f8" : "#fafafa",
                          boxShadow: "0 1px 3px rgba(0,0,0,.08)",
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        {currentStep === STEPS.FINAL_QUOTE ? (
                          <RadioButtonUnchecked sx={{ fontSize: 22, color: "#0a66c2" }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ fontSize: 22, color: "#9ca3af" }} />
                        )}
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" fontWeight={600} sx={{ fontSize: "0.938rem", color: "#000000" }}>
                            Get Your Offer
                          </Typography>
                          <Typography variant="body2" sx={{ fontSize: "0.813rem", mt: 0.5, color: "#666666" }}>
                            Final pricing
                          </Typography>
                        </Box>
                      </Stack>
                    </Paper>
                  </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* RESET BUTTON */}
                <ResetButton
                  size="default"
                  style="warning"
                  className="w-full"
                />
              </Paper>
            </Box>
          </Box>

          {/* MAIN CONTENT WITH ORIGINAL ANIMATIONS */}
          <Box>
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
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
