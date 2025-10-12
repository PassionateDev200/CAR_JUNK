/** route: src/components/quote/questions/MileageQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Stack,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";
import { Gauge, Info } from "lucide-react";
import QuestionLayout from "./QuestionLayout";
import { questionTheme } from "@/theme/questionTheme";

export default function MileageQuestion({
  vehicleDetails,
  currentAnswer,
  onAnswer,
  onPrevious,
  questionNumber,
  totalQuestions,
}) {
  const [mileage, setMileage] = useState("");
  const [unsureAboutMileage, setUnsureAboutMileage] = useState(false);
  const [mileageCategory, setMileageCategory] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      if (currentAnswer) {
        if (typeof currentAnswer === "object") {
          if (currentAnswer.unsure || currentAnswer.mileage === "unsure") {
            setUnsureAboutMileage(true);
            setMileage("");
            setMileageCategory("unsure");
          } else if (currentAnswer.mileage) {
            setMileage(currentAnswer.mileage.toString());
            setUnsureAboutMileage(false);
            calculateMileageCategory(currentAnswer.mileage);
          }
        } else if (typeof currentAnswer === "string") {
          if (currentAnswer === "unsure") {
            setUnsureAboutMileage(true);
            setMileage("");
            setMileageCategory("unsure");
          } else {
            setMileage(currentAnswer);
            setUnsureAboutMileage(false);
            calculateMileageCategory(parseInt(currentAnswer));
          }
        }
      } else {
        setMileage("");
        setUnsureAboutMileage(false);
        setMileageCategory("");
      }
      setError("");
    } catch (err) {
      console.error("Error initializing MileageQuestion state:", err);
      setError("Error loading previous answer");
    }
  }, [currentAnswer]);

  const calculateMileageCategory = (miles) => {
    try {
      if (!vehicleDetails.year || !miles || miles <= 0) {
        setMileageCategory("");
        return;
      }

      const currentYear = new Date().getFullYear();
      const vehicleAge = currentYear - parseInt(vehicleDetails.year);
      const averageMilesPerYear = 12000;
      const expectedMileage = Math.max(vehicleAge * averageMilesPerYear, 0);

      if (miles > expectedMileage + 50000) {
        setMileageCategory("high");
      } else if (miles < expectedMileage - 50000 && vehicleAge > 0) {
        setMileageCategory("low");
      } else {
        setMileageCategory("average");
      }
    } catch (err) {
      console.error("Error calculating mileage category:", err);
      setMileageCategory("");
    }
  };

  const getMileageAdjustment = (miles) => {
    try {
      if (!vehicleDetails.year || !miles || miles <= 0) {
        return { type: "mileage", amount: 0 };
      }

      const currentYear = new Date().getFullYear();
      const vehicleAge = currentYear - parseInt(vehicleDetails.year);
      const averageMilesPerYear = 12000;
      const expectedMileage = Math.max(vehicleAge * averageMilesPerYear, 0);

      if (miles > expectedMileage + 50000) {
        return { type: "mileage", amount: -100 };
      } else if (miles < expectedMileage - 50000 && vehicleAge > 0) {
        return { type: "mileage", amount: 50 };
      } else {
        return { type: "mileage", amount: 0 };
      }
    } catch (err) {
      console.error("Error calculating mileage adjustment:", err);
      return { type: "mileage", amount: 0 };
    }
  };

  const handleNext = () => {
    try {
      setError("");

      if (unsureAboutMileage) {
        onAnswer(
          { mileage: "unsure", unsure: true },
          { type: "mileage", amount: -75 }
        );
      } else if (mileage && parseInt(mileage.replace(/,/g, "")) > 0) {
        const miles = parseInt(mileage.replace(/,/g, ""));
        const adjustment = getMileageAdjustment(miles);
        onAnswer({ mileage: miles, unsure: false }, adjustment);
      } else {
        setError("Please enter a valid mileage or check 'I'm not sure'");
      }
    } catch (err) {
      console.error("Error handling next:", err);
      setError("Error processing mileage. Please try again.");
    }
  };

  const formatMileage = (value) => {
    try {
      const digits = value.replace(/\D/g, "");
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (err) {
      return value;
    }
  };

  const handleMileageChange = (e) => {
    try {
      const formatted = formatMileage(e.target.value);
      setMileage(formatted);
      setError("");

      if (formatted && !unsureAboutMileage) {
        const miles = parseInt(formatted.replace(/,/g, ""));
        if (miles > 0) {
          calculateMileageCategory(miles);
        }
      } else {
        setMileageCategory("");
      }
    } catch (err) {
      console.error("Error handling mileage change:", err);
    }
  };

  const handleUnsureToggle = (event) => {
    try {
      const checked = event.target.checked;
      setUnsureAboutMileage(checked);
      setError("");

      if (checked) {
        setMileage("");
        setMileageCategory("unsure");
      } else {
        setMileageCategory("");
      }
    } catch (err) {
      console.error("Error handling unsure toggle:", err);
    }
  };

  const getMileageInfo = () => {
    if (unsureAboutMileage) {
      return {
        text: "We'll estimate based on vehicle age",
        color: "#d97706",
        bg: "#fef3c7",
        border: "#fde68a",
      };
    }

    switch (mileageCategory) {
      case "low":
        return {
          text: "Lower than average - increases value!",
          color: "#057642",
          bg: "#f0f9f6",
          border: "#b9d6f2",
        };
      case "average":
        return {
          text: "About average for vehicle age",
          color: "#0a66c2",
          bg: "#e3f0ff",
          border: "#b9d6f2",
        };
      case "high":
        return {
          text: "Higher than average for vehicle age",
          color: "#d97706",
          bg: "#fef3c7",
          border: "#fde68a",
        };
      default:
        return null;
    }
  };

  const getVehicleDisplayName = () => {
    if (vehicleDetails.year && vehicleDetails.make && vehicleDetails.model) {
      return `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;
    }
    return "vehicle";
  };

  const mileageInfo = getMileageInfo();

  return (
    <QuestionLayout
      icon={Gauge}
      title={`What's the mileage on your ${getVehicleDisplayName()}?`}
      description="Don't worry about the exact number. We round to the nearest thousand, so you can too."
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      onPrevious={onPrevious}
      onNext={handleNext}
      nextDisabled={!mileage && !unsureAboutMileage}
    >
      <Box sx={{ maxWidth: "600px", mx: "auto" }}>
        <Stack spacing={3}>
          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              icon={<Info size={20} />}
              sx={{
                borderRadius: 2,
                bgcolor: "#ffebee",
                border: "1px solid #ffcdd2",
                "& .MuiAlert-message": {
                  color: "#d32f2f",
                  fontSize: "0.875rem",
                },
              }}
            >
              {error}
            </Alert>
          )}

          {/* Mileage Input */}
          <Box>
            <Typography
              sx={{
                fontSize: questionTheme.typography.sizes.sm,
                fontWeight: questionTheme.typography.weights.semibold,
                color: questionTheme.colors.text.primary,
                mb: 1.5,
              }}
            >
              Enter mileage (optional)
            </Typography>
            <TextField
              fullWidth
              value={mileage}
              onChange={handleMileageChange}
              disabled={unsureAboutMileage}
              placeholder="e.g., 125,000"
              inputProps={{
                style: {
                  fontSize: "1.125rem",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: unsureAboutMileage
                    ? questionTheme.colors.background.secondary
                    : questionTheme.colors.background.primary,
                  "& fieldset": {
                    borderColor: questionTheme.colors.border.primary,
                    borderWidth: 2,
                  },
                  "&:hover fieldset": {
                    borderColor: questionTheme.colors.border.focus,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: questionTheme.colors.primary.main,
                  },
                },
              }}
            />
          </Box>

          {/* Unsure Checkbox */}
          <FormControlLabel
            control={
              <Checkbox
                checked={unsureAboutMileage}
                onChange={handleUnsureToggle}
                sx={{
                  color: questionTheme.colors.border.primary,
                  "&.Mui-checked": {
                    color: questionTheme.colors.primary.main,
                  },
                }}
              />
            }
            label={
              <Typography
                sx={{
                  fontSize: questionTheme.typography.sizes.md,
                  color: questionTheme.colors.text.primary,
                }}
              >
                I'm not sure about the exact mileage
              </Typography>
            }
          />

          {/* Mileage Category Info */}
          {mileageInfo && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: "1.5px solid",
                borderColor: mileageInfo.border,
                bgcolor: mileageInfo.bg,
              }}
            >
              <Typography
                sx={{
                  fontSize: questionTheme.typography.sizes.md,
                  fontWeight: questionTheme.typography.weights.semibold,
                  color: mileageInfo.color,
                }}
              >
                {mileageInfo.text}
              </Typography>
            </Paper>
          )}
        </Stack>
      </Box>
    </QuestionLayout>
  );
}
