/** route: src/components/quote/questions/InteriorQuestion.jsx */
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
} from "@mui/material";
import { Armchair } from "lucide-react";
import QuestionLayout from "./QuestionLayout";
import { questionTheme } from "@/theme/questionTheme";

export default function InteriorQuestion({
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
      value: "good_condition",
      label: "No, all interior parts are there and in good condition",
      priceAdjustment: {
        type: "interior",
        amount: 0,
      },
      description:
        "Seats, dashboard, and interior components are intact and functional",
    },
    {
      value: "damaged_missing",
      label: "Yes, some interior parts are damaged or missing",
      priceAdjustment: {
        type: "interior",
        amount: -75,
      },
      description:
        "Interior has significant damage, missing parts, or major wear",
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
      icon={Armchair}
      title={`Are any interior parts of your ${getVehicleDisplayName()} damaged or missing?`}
      description="Think about the seats, airbags, and dashboard. Don't worry about small scratches or spots. We just need to know if there are any serious rips or tears."
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
      </Box>
    </QuestionLayout>
  );
}
