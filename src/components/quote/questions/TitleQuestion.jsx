/** route: src/components/quote/questions/TitleQuestion.jsx */
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
import { FileText, AlertCircle } from "lucide-react";
import QuestionLayout from "./QuestionLayout";
import { questionTheme } from "@/theme/questionTheme";

export default function TitleQuestion({
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
      value: "clean_title",
      label: "Yes, it has a clean title",
      priceAdjustment: {
        type: "title",
        amount: 0,
      },
      description: "No stamps or notes indicating salvage or rebuilt status",
      isDisqualifying: false,
    },
    {
      value: "salvage_rebuilt",
      label: "No, it has a salvage or rebuilt title",
      priceAdjustment: {
        type: "title",
        amount: -150,
      },
      description: "Title shows salvage, rebuilt, or flood damage history",
      isDisqualifying: false,
    },
    {
      value: "no_title",
      label: "I don't have the title",
      priceAdjustment: null,
      description: "Title is lost, with lender, or not available",
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
      icon={FileText}
      title={`Does your ${getVehicleDisplayName()} have a clean title?`}
      description="Unless your vehicle has a history of severe damage, it probably has a clean title. But it's easy to check. Look for a note or stamp on your title that says 'salvage' or 'rebuilt.'"
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
            We require a title to complete the purchase. We'll redirect you shortly.
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
