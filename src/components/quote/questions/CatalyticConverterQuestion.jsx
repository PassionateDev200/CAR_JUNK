/** route: src/components/quote/questions/CatalyticConverterQuestion.jsx */
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
import { Zap } from "lucide-react";
import QuestionLayout from "./QuestionLayout";
import { questionTheme } from "@/theme/questionTheme";

export default function CatalyticConverterQuestion({
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
      value: "attached",
      label: "Yes, it's attached",
      priceAdjustment: {
        type: "catalytic_converter",
        amount: 0,
      },
      description: "Catalytic converter is present and properly attached",
    },
    {
      value: "missing",
      label: "No, it's missing",
      priceAdjustment: {
        type: "catalytic_converter",
        amount: -150,
      },
      description: "Catalytic converter has been removed or stolen",
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
      icon={Zap}
      title={`Is the catalytic converter attached to your ${getVehicleDisplayName()}?`}
      description="You'll know it's missing if your car makes a loud roar when you start it and gets louder as you accelerate. You might also notice an increase in exhaust fumes. Finally, you can check for missing parts under the car, around the muffler."
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
