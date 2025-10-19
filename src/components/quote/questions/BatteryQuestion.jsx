/** route: src/components/quote/questions/BatteryQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { Battery, AlertCircle } from "lucide-react";
import QuestionLayout from "./QuestionLayout";
import { questionTheme } from "@/theme/questionTheme";
import { useVehicle } from "@/contexts/VehicleContext";

export default function BatteryQuestion({
  vehicleDetails,
  currentAnswer,
  onAnswer,
  onPrevious,
  questionNumber,
  totalQuestions,
}) {
  const vehicleState = useVehicle();
  const { pricing } = vehicleState;
  const [selectedValue, setSelectedValue] = useState(currentAnswer || "");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setSelectedValue(currentAnswer || "");
  }, [currentAnswer]);

  // Calculate 20% penalty based on base price
  const calculateBatteryPenalty = () => {
    const basePrice = pricing.basePrice || 500; // Default to $500 if not set
    return Math.round(-basePrice * 0.20); // 20% discount as negative value
  };

  const options = [
    {
      value: "battery_works",
      label: "Yes, the battery is installed and works",
      priceAdjustment: {
        type: "battery",
        amount: 0,
      },
      description: "Vehicle starts without jump-start or external power",
      isDisqualifying: false,
    },
    {
      value: "no_battery",
      label: "No, the battery doesn't work or is not installed",
      priceAdjustment: {
        type: "battery",
        amount: calculateBatteryPenalty(),
      },
      description: "Battery is dead, missing, or requires jump-start - 20% price reduction will apply",
      isDisqualifying: false,
    },
  ];

  const handleSelection = (event) => {
    const value = event.target.value;
    const selectedOption = options.find((opt) => opt.value === value);
    setSelectedValue(value);

    // Show informational warning for no battery
    if (value === "no_battery") {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleNext = () => {
    if (selectedValue) {
      const selectedOption = options.find((opt) => opt.value === selectedValue);
      onAnswer(selectedValue, selectedOption.priceAdjustment);
    }
  };

  const getVehicleDisplayName = () => {
    if (vehicleDetails.year && vehicleDetails.make && vehicleDetails.model) {
      return `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;
    } else if (vehicleDetails.make && vehicleDetails.model) {
      return `${vehicleDetails.make} ${vehicleDetails.model}`;
    }
    return "vehicle";
  };

  return (
    <QuestionLayout
      icon={Battery}
      title={`Does your ${getVehicleDisplayName()} have a working battery?`}
      description="Don't worry if you don't have a working battery - you can still sell your vehicle with a price adjustment."
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      onPrevious={onPrevious}
      onNext={handleNext}
      nextDisabled={!selectedValue}
    >
      <Box sx={{ maxWidth: "700px", mx: "auto" }}>
        {showWarning && (
          <Alert
            severity="warning"
            icon={<AlertCircle size={20} />}
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: "#fff8e1",
              border: "1px solid #ffecb3",
              "& .MuiAlert-message": {
                color: "#f57c00",
                fontSize: "0.875rem",
              },
            }}
          >
            No problem! You can still sell your vehicle. A 20% price reduction will be applied to account for the battery issue.
          </Alert>
        )}

        <RadioGroup value={selectedValue} onChange={handleSelection}>
          <Stack spacing={2}>
            {options.map((option) => (
              <Paper
                key={option.value}
                elevation={0}
                sx={{
                  p: 0,
                  border: "2px solid",
                  borderColor:
                    selectedValue === option.value
                      ? questionTheme.colors.primary.main
                      : questionTheme.colors.border.primary,
                  borderRadius: 2,
                  cursor: "pointer",
                  transition: questionTheme.transitions.default,
                  "&:hover": {
                    borderColor: questionTheme.colors.border.focus,
                    bgcolor: questionTheme.colors.background.hover,
                  },
                }}
              >
                <FormControlLabel
                  value={option.value}
                  control={
                    <Radio
                      sx={{
                        ml: 2,
                        color: questionTheme.colors.border.primary,
                        "&.Mui-checked": {
                          color: questionTheme.colors.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Box sx={{ py: 1.5, pr: 2 }}>
                      <Typography
                        sx={{
                          fontSize: questionTheme.typography.sizes.md,
                          fontWeight: questionTheme.typography.weights.semibold,
                          color: questionTheme.colors.text.primary,
                          mb: 0.5,
                        }}
                      >
                        {option.label}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: questionTheme.typography.sizes.sm,
                          color: questionTheme.colors.text.secondary,
                          lineHeight: 1.5,
                        }}
                      >
                        {option.description}
                      </Typography>
                    </Box>
                  }
                  sx={{ m: 0, width: "100%" }}
                />
              </Paper>
            ))}
          </Stack>
        </RadioGroup>
      </Box>
    </QuestionLayout>
  );
}
