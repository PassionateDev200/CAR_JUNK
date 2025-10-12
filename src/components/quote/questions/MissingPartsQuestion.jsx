/** route: src/components/quote/questions/MissingPartsQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  Paper,
  Typography,
  Stack,
  Alert,
} from "@mui/material";
import { AlertTriangle, Info } from "lucide-react";
import QuestionLayout from "./QuestionLayout";
import { questionTheme } from "@/theme/questionTheme";

export default function MissingPartsQuestion({
  vehicleDetails,
  currentAnswer,
  onAnswer,
  onPrevious,
  questionNumber,
  totalQuestions,
}) {
  const [selectedValue, setSelectedValue] = useState(currentAnswer || "");

  useEffect(() => {
    setSelectedValue(currentAnswer || "");
  }, [currentAnswer]);

  const options = [
    {
      value: "all_parts_attached",
      label: "Yes, all exterior parts and panels are attached",
      priceAdjustment: {
        type: "missing_parts",
        amount: 0,
      },
      description:
        "All doors, bumpers, panels securely attached as from factory",
    },
    {
      value: "missing_parts",
      label:
        "No, at least one exterior part or panel is broken, loose, or missing",
      priceAdjustment: {
        type: "missing_parts",
        amount: -100,
      },
      description:
        "Some exterior components are damaged, loose, or completely missing",
    },
  ];

  const handleSelection = (event) => {
    setSelectedValue(event.target.value);
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
    }
    return vehicleDetails.make || "vehicle";
  };

  return (
    <QuestionLayout
      icon={AlertTriangle}
      title={`Are all exterior parts and panels attached to your ${getVehicleDisplayName()}?`}
      description="We're talking just as secure as when it left the factory, or a sturdy aftermarket replacement— Nothing loose, hanging or missing"
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      onPrevious={onPrevious}
      onNext={handleNext}
      nextDisabled={!selectedValue}
    >
      <Box sx={{ maxWidth: "700px", mx: "auto" }}>
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

        {selectedValue === "missing_parts" && (
          <Alert
            severity="info"
            icon={<Info size={20} />}
            sx={{
              mt: 3,
              borderRadius: 2,
              bgcolor: "#e3f0ff",
              border: "1px solid #b9d6f2",
              "& .MuiAlert-message": {
                color: "#0a66c2",
                fontSize: "0.875rem",
              },
            }}
          >
            After clicking continue, you'll be able to select which areas have
            missing or loose parts. This helps us provide the most accurate pricing
            and plan the pickup properly.
          </Alert>
        )}
      </Box>
    </QuestionLayout>
  );
}
