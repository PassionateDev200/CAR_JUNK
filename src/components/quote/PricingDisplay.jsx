/** route: src/components/quote/PricingDisplay.jsx */

"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  Fade,
  Grid,
  Chip,
} from "@mui/material";
import {
  CheckCircle,
  Email,
  Phone,
  Person,
  DirectionsCar,
  AttachMoney,
  Schedule,
  Verified,
  TrendingUp,
  LocalOffer,
} from "@mui/icons-material";
import {
  useVehicle,
  useVehicleDispatch,
  vehicleActions,
} from "@/contexts/VehicleContext";
import axios from "@/lib/axios";

export default function PricingDisplay() {
  const vehicleState = useVehicle();
  const dispatch = useVehicleDispatch();

  const {
    vehicleDetails,
    vin,
    pricing,
    questionPricing,
    conditionAnswers,
    zipCode,
    locationData,
    sellerInfo: contextSellerInfo,
  } = vehicleState;

  const [sellerInfo, setSellerInfo] = useState({
    name: contextSellerInfo.name || "",
    email: contextSellerInfo.email || "",
    phone: contextSellerInfo.phone || "",
    address: contextSellerInfo.address || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [quoteId, setQuoteId] = useState("");
  const [accessToken, setAccessToken] = useState("");

  // Update local state when context seller info changes (e.g., after login)
  useEffect(() => {
    // Only update if context has email and local state doesn't (prevents overwriting user edits)
    setSellerInfo((prev) => {
      // If context has email and we don't have one yet, use context values
      if (contextSellerInfo.email && !prev.email) {
        return {
          name: contextSellerInfo.name || prev.name,
          email: contextSellerInfo.email,
          phone: contextSellerInfo.phone || prev.phone,
          address: contextSellerInfo.address || prev.address,
        };
      }
      return prev;
    });
  }, [contextSellerInfo.email, contextSellerInfo.name, contextSellerInfo.phone, contextSellerInfo.address]);

  const handleInputChange = (field, value) => {
    setSellerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      // Validate required fields
      if (!sellerInfo.name || !sellerInfo.email || !sellerInfo.phone) {
        throw new Error("Please fill in all required fields");
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(sellerInfo.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Prepare quote data
      const quoteData = {
        vehicleDetails,
        vin,
        pricing: {
          ...pricing,
          finalPrice: pricing.currentPrice,
        },
        questionPricing,
        conditionAnswers,
        customer: sellerInfo,
        zipCode,
        locationData,
      };

      // Submit quote
      const response = await axios.post("/api/quote", quoteData);
      const result = response.data;

      // Update context with submission status
      dispatch(
        vehicleActions.setSubmissionStatus({
          isSubmitted: true,
          isSubmitting: false,
          error: null,
        })
      );

      setQuoteId(result.quoteId);
      setAccessToken(result.accessToken);
      setSubmissionSuccess(true);
    } catch (error) {
      console.error("Error submitting quote:", error);
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to submit quote";
      setSubmissionError(errorMessage);

      dispatch(
        vehicleActions.setSubmissionStatus({
          isSubmitted: false,
          isSubmitting: false,
          error: errorMessage,
        })
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const vehicleName = `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;

  // Success screen - LinkedIn style
  if (submissionSuccess) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              borderRadius: 2,
              border: "1px solid",
              borderColor: "divider",
              textAlign: "center",
            }}
          >
            {/* Success Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: "success.main",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <CheckCircle sx={{ fontSize: 48, color: "white" }} />
            </Box>

            {/* Success Message */}
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Final offer Submitted Successfully!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              We've received your quote and sent a confirmation email to your inbox.
            </Typography>

            {/* Offer Amount Card */}
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#f3f6f8",
                border: "2px solid",
                borderColor: "success.main",
                mb: 4,
                py: 4,
                px: 3,
                borderRadius: 2,
              }}
            >
              <Typography variant="h2" fontWeight={700} color="success.main">
                ${pricing.currentPrice.toLocaleString()}
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                Your offer for {vehicleName}
              </Typography>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={2}
                justifyContent="center"
              >
                <Chip
                  icon={<Verified />}
                  label={`Quote ID: ${quoteId}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  icon={<Schedule />}
                  label="Valid for 7 days"
                  color="success"
                  variant="outlined"
                />
              </Stack>
            </Paper>

            {/* Email Confirmation Box */}
            <Alert
              severity="info"
              icon={<Email />}
              sx={{
                mb: 4,
                textAlign: "left",
                "& .MuiAlert-message": { width: "100%" },
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                Check Your Email
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                We've sent a confirmation to <strong>{sellerInfo.email}</strong> with:
              </Typography>
              <Box component="ul" sx={{ mt: 1, mb: 0, pl: 2 }}>
                <Typography component="li" variant="body2" color="text.secondary">
                  Your quote details and access link
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Instructions to manage your quote
                </Typography>
                <Typography component="li" variant="body2" color="text.secondary">
                  Contact information for questions
                </Typography>
              </Box>
            </Alert>

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Schedule />}
                onClick={() => (window.location.href = `/manage/${accessToken}`)}
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  bgcolor: "#0a66c2",
                  "&:hover": {
                    bgcolor: "#004182",
                  },
                }}
              >
                Schedule Pickup Now
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => (window.location.href = "/")}
                sx={{
                  py: 1.5,
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: 600,
                  borderRadius: 2,
                  borderColor: "#e0dfdc",
                  color: "#666666",
                  "&:hover": {
                    borderColor: "#0a66c2",
                    bgcolor: "#edf3f8",
                  },
                }}
              >
                Get Another Quote
              </Button>
            </Stack>
          </Paper>
        </Fade>
      </Container>
    );
  }

  // Main form - LinkedIn style
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box>
        {/* Main Content */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          {/* Offer Display */}
          <Box
            sx={{
              textAlign: "center",
              mb: 4,
              pb: 4,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="h5"
              fontWeight={600}
              gutterBottom
              color="text.secondary"
            >
              We'd love to buy your
            </Typography>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              {vehicleName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              for
            </Typography>
            
            {/* Price with icon */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: "primary.main",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mr: 2,
                }}
              >
                <AttachMoney sx={{ fontSize: 40, color: "white" }} />
              </Box>
              <Typography variant="h2" fontWeight={700} color="primary.main">
                {pricing.currentPrice.toLocaleString()}
              </Typography>
            </Box>
            
            <Chip 
              icon={<LocalOffer />} 
              label="Final Offer Amount" 
              color="primary" 
              variant="outlined" 
            />
          </Box>

          {/* Contact Form */}
          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center" mb={3}>
              <Person sx={{ color: "primary.main", fontSize: 28 }} />
              <Typography variant="h5" fontWeight={600}>
                Your Information
              </Typography>
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Name Field */}
                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={sellerInfo.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1.5, color: "action.active" }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Email Field */}
                <TextField
                  fullWidth
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={sellerInfo.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1.5, color: "action.active" }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Phone Field */}
                <TextField
                  fullWidth
                  type="tel"
                  label="Phone Number"
                  placeholder="Enter your phone number"
                  value={sellerInfo.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1.5, color: "action.active" }} />,
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />

                {/* Error Alert */}
                {submissionError && (
                  <Alert severity="error" sx={{ borderRadius: 2 }}>
                    {submissionError}
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: "none",
                    fontSize: "1.125rem",
                    fontWeight: 600,
                    mt: 2,
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 2 }} color="inherit" />
                      Submitting...
                    </>
                  ) : (
                    `Get My $${pricing.currentPrice.toLocaleString()} Offer`
                  )}
                </Button>

                {/* Terms */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ pt: 1 }}
                >
                  By submitting, you agree to our terms and conditions. We'll send you a
                  confirmation email with your quote details.
                </Typography>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
