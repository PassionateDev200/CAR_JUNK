/** route: src/components/quote/questions/FloodFireQuestion.jsx */
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
import { Flame, Info } from "lucide-react";
import QuestionLayout from "./QuestionLayout";
import { questionTheme } from "@/theme/questionTheme";

export default function FloodFireQuestion({
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
      value: "no_flood_fire",
      label: "No, thank goodness",
      priceAdjustment: {
        type: "flood_fire",
        amount: 0,
      },
      description: "Vehicle has never been involved in flood or fire incidents",
    },
    {
      value: "flood_fire_damage",
      label: "Yes, it has been in a flood or fire",
      priceAdjustment: {
        type: "flood_fire",
        amount: -200,
      },
      description: "Vehicle has experienced flood or fire damage at some point",
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
      icon={Flame}
      title={`Has your ${getVehicleDisplayName()} been in a flood or fire?`}
      description="It's terrible, but it happens. And it impacts the offer. Just let us know if it's been involved in an incident resulting in fire or water damage, inside or out."
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

        {selectedValue === "flood_fire_damage" && (
          <Alert
            severity="warning"
            icon={<Info size={20} />}
            sx={{
              mt: 3,
              borderRadius: 2,
              bgcolor: "#fef3c7",
              border: "1px solid #fde68a",
              "& .MuiAlert-message": {
                color: "#d97706",
                fontSize: "0.875rem",
              },
            }}
          >
            Flood and fire damage significantly impacts vehicle value due to extensive
            hidden damage to electrical systems, metals, and safety components. We
            still purchase these vehicles but at adjusted pricing to account for the
            damage.
          </Alert>
        )}
      </Box>
    </QuestionLayout>
  );
}
