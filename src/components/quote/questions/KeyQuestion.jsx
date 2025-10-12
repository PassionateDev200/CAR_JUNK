/** route: src/components/quote/questions/KeyQuestion.jsx */
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
import { Key, AlertCircle } from "lucide-react";
import QuestionLayout from "./QuestionLayout";
import { questionTheme } from "@/theme/questionTheme";

export default function KeyQuestion({
  vehicleDetails,
  currentAnswer,
  onAnswer,
  onPrevious,
  questionNumber,
  totalQuestions,
}) {
  const [selectedValue, setSelectedValue] = useState(currentAnswer || "");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setSelectedValue(currentAnswer || "");
  }, [currentAnswer]);

  const options = [
    {
      value: "have_key",
      label: "Yes, I have a key",
      priceAdjustment: {
        type: "key",
        amount: 0,
      },
      description: "Original key, spare key, or working key fob available",
      isDisqualifying: false,
    },
    {
      value: "no_key",
      label: "No, I don't have a key",
      priceAdjustment: null,
      description: "No keys available - lost, broken, or with someone else",
      isDisqualifying: true,
    },
  ];

  const handleSelection = (event) => {
    const value = event.target.value;
    const selectedOption = options.find((opt) => opt.value === value);
    setSelectedValue(value);

    if (selectedOption.isDisqualifying) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleNext = () => {
    if (selectedValue) {
      const selectedOption = options.find((opt) => opt.value === selectedValue);

      if (selectedOption.isDisqualifying) {
        setTimeout(() => {
          onAnswer(selectedValue, selectedOption.priceAdjustment);
        }, 1500);
      } else {
        onAnswer(selectedValue, selectedOption.priceAdjustment);
      }
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
      icon={Key}
      title={`Do you have a key for your ${getVehicleDisplayName()}?`}
      description="We need a key to complete the vehicle purchase and pickup process."
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      onPrevious={onPrevious}
      onNext={handleNext}
      nextDisabled={!selectedValue}
    >
      <Box sx={{ maxWidth: "700px", mx: "auto" }}>
        {showWarning && (
          <Alert
            severity="error"
            icon={<AlertCircle size={20} />}
            sx={{
              mb: 3,
              borderRadius: 2,
              bgcolor: "#ffebee",
              border: "1px solid #ffcdd2",
              "& .MuiAlert-message": {
                color: "#d32f2f",
                fontSize: "0.875rem",
              },
            }}
          >
            We need a key to complete the vehicle purchase. We'll redirect you shortly.
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
