/** route: src/components/quote/questions/ExteriorDamageQuestion.jsx */
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
import { Shield, Info } from "lucide-react";
import QuestionLayout from "./QuestionLayout";
import { questionTheme } from "@/theme/questionTheme";

export default function ExteriorDamageQuestion({
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
      value: "no_major_damage",
      label: "No, nothing major, just a few dings and scratches",
      priceAdjustment: {
        type: "exterior_damage",
        amount: 0,
      },
      description:
        "Normal wear and tear - small scratches, door dings, minor scuffs",
    },
    {
      value: "has_damage",
      label: "Yes, it has some rust or exterior damage",
      priceAdjustment: {
        type: "exterior_damage",
        amount: -75,
      },
      description:
        "Visible damage larger than a baseball - dents, rust, collision damage",
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
      icon={Shield}
      title={`Does your ${getVehicleDisplayName()} have any exterior damage?`}
      description="Most used cars have a little wear and tear, but small blemishes won't affect your offer. Just let us know if the outside of your car has any damage bigger than a baseball."
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

        {selectedValue === "has_damage" && (
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
            After clicking continue, you'll be able to select which areas of your
            vehicle have damage. This helps us provide the most accurate pricing.
          </Alert>
        )}
      </Box>
    </QuestionLayout>
  );
}
