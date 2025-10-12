/** route: src/components/quote/questions/ZipCodeQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Alert,
} from "@mui/material";
import { MapPin, CheckCircle, AlertCircle } from "lucide-react";
import QuestionLayout from "./QuestionLayout";
import { questionTheme } from "@/theme/questionTheme";
import { validateZipCode, getRegionAdjustment } from "@/utils/zipCodeApi";

export default function ZipCodeQuestion({
  vehicleDetails,
  currentAnswer,
  onAnswer,
  onPrevious,
  questionNumber,
  totalQuestions,
}) {
  const [zipCode, setZipCode] = useState(currentAnswer?.zipCode || "");
  const [locationData, setLocationData] = useState(
    currentAnswer?.locationData || null
  );
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (currentAnswer?.zipCode) {
      setZipCode(currentAnswer.zipCode);
      setLocationData(currentAnswer.locationData);
    }
  }, [currentAnswer]);

  const handleZipValidation = async (zip) => {
    if (zip.length === 5) {
      setIsValidating(true);
      setError("");

      try {
        const result = await validateZipCode(zip);
        if (result.valid) {
          setLocationData(result);
          setError("");
        } else {
          setLocationData(null);
          setError(
            result.error ||
              "Invalid ZIP code. Please enter a valid 5-digit ZIP code."
          );
        }
      } catch (err) {
        setLocationData(null);
        setError("Unable to validate ZIP code. Please try again.");
        console.error("ZIP validation error:", err);
      } finally {
        setIsValidating(false);
      }
    } else {
      setLocationData(null);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!zipCode) {
      setError("Please enter a ZIP code");
      return;
    }

    if (zipCode.length !== 5) {
      setError("Please enter a valid 5-digit ZIP code");
      return;
    }

    if (!locationData || !locationData.valid) {
      setError("Please wait for ZIP code validation");
      return;
    }

    const locationAdjustment = getRegionAdjustment(locationData);
    setError("");
    onAnswer({ zipCode, locationData }, locationAdjustment);
  };

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZipCode(value);
    setError("");

    if (value.length === 5) {
      handleZipValidation(value);
    } else {
      setLocationData(null);
    }
  };

  const getVehicleDisplayName = () => {
    if (vehicleDetails.year && vehicleDetails.make && vehicleDetails.model) {
      return `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;
    } else if (vehicleDetails.make) {
      return vehicleDetails.make;
    }
    return "vehicle";
  };

  return (
    <QuestionLayout
      icon={MapPin}
      title={`Where will we pick up your ${getVehicleDisplayName()}?`}
      description={`Enter the ZIP code where your ${
        vehicleDetails.make || "vehicle"
      } will be parked when we come to get it. This info helps us determine the offer amount.`}
      questionNumber={questionNumber}
      totalQuestions={totalQuestions}
      onPrevious={onPrevious}
      onNext={handleSubmit}
      nextDisabled={
        !zipCode ||
        zipCode.length !== 5 ||
        !locationData?.valid ||
        isValidating
      }
      nextLabel={isValidating ? "Validating..." : "Continue"}
    >
      <Box sx={{ maxWidth: "500px", mx: "auto" }}>
        <Stack spacing={3}>
          {/* ZIP Code Input */}
          <Box>
            <Typography
              sx={{
                fontSize: questionTheme.typography.sizes.sm,
                fontWeight: questionTheme.typography.weights.semibold,
                color: questionTheme.colors.text.primary,
                mb: 1.5,
              }}
            >
              ZIP Code
            </Typography>
            <TextField
              fullWidth
              value={zipCode}
              onChange={handleZipChange}
              placeholder="Enter 5-digit ZIP code"
              error={!!error}
              inputProps={{
                maxLength: 5,
                style: {
                  fontSize: "1.125rem",
                  textAlign: "center",
                  letterSpacing: "0.1em",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: questionTheme.colors.background.primary,
                  "& fieldset": {
                    borderColor: error
                      ? questionTheme.colors.error.main
                      : locationData?.valid
                      ? questionTheme.colors.success.main
                      : questionTheme.colors.border.primary,
                    borderWidth: 2,
                  },
                  "&:hover fieldset": {
                    borderColor: error
                      ? questionTheme.colors.error.main
                      : locationData?.valid
                      ? questionTheme.colors.success.main
                      : questionTheme.colors.border.focus,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: error
                      ? questionTheme.colors.error.main
                      : questionTheme.colors.primary.main,
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {isValidating && <CircularProgress size={20} />}
                    {!isValidating && locationData?.valid && (
                      <CheckCircle size={20} color="#057642" />
                    )}
                    {!isValidating && error && (
                      <AlertCircle size={20} color="#d32f2f" />
                    )}
                  </Box>
                ),
              }}
            />
            {error && (
              <Typography
                sx={{
                  mt: 1,
                  fontSize: questionTheme.typography.sizes.sm,
                  color: questionTheme.colors.error.main,
                }}
              >
                {error}
              </Typography>
            )}
          </Box>

          {/* Location Display */}
          {locationData?.valid && (
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 2,
                border: "1.5px solid",
                borderColor: questionTheme.colors.success.main,
                bgcolor: questionTheme.colors.success.light,
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                <CheckCircle size={20} color="#057642" />
                <Typography
                  sx={{
                    fontSize: questionTheme.typography.sizes.md,
                    fontWeight: questionTheme.typography.weights.semibold,
                    color: questionTheme.colors.success.main,
                  }}
                >
                  {locationData.city}, {locationData.state}
                </Typography>
              </Stack>
              <Typography
                sx={{
                  fontSize: questionTheme.typography.sizes.sm,
                  color: questionTheme.colors.text.secondary,
                  ml: 4.5,
                }}
              >
                {locationData.county} • {locationData.timezone}
              </Typography>
            </Paper>
          )}
        </Stack>
      </Box>
    </QuestionLayout>
  );
}
