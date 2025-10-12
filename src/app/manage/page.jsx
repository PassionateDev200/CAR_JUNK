/** route: src/app/manage/page.jsx */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  InputAdornment,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";
import {
  VpnKey as VpnKeyIcon,
  Email as EmailIcon,
  Search as SearchIcon,
  DirectionsCar as DirectionsCarIcon,
  HelpOutline as HelpOutlineIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from "@mui/icons-material";
import axios from "axios";
import {
  validateAndNormalizeAccessToken,
  validateQuoteId,
  normalizeToken,
  sanitizeAccessToken,
  VALIDATION_CONSTANTS,
} from "@/lib/quoteAccess.client";

export default function ManageQuotePage() {
  const router = useRouter();
  const [tabValue, setTabValue] = useState(0);
  
  // Quick Access (Tab 0)
  const [accessToken, setAccessToken] = useState("");
  const [tokenErrors, setTokenErrors] = useState([]);
  
  // Email Lookup (Tab 1)
  const [email, setEmail] = useState("");
  const [quoteId, setQuoteId] = useState("");
  const [quoteIdErrors, setQuoteIdErrors] = useState([]);
  
  // Common states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle Direct Access with 6-character token
  const handleDirectAccess = async (e) => {
    e.preventDefault();

    if (!accessToken.trim()) {
      setError("Please enter your access token");
      setTokenErrors(["Access token is required"]);
      return;
    }

    const validation = validateAndNormalizeAccessToken(accessToken);
    if (!validation.isValid) {
      setError("Invalid access token format");
      setTokenErrors(validation.errors);
      return;
    }

    setLoading(true);
    setError("");
    setTokenErrors([]);

    try {
      router.push(`/manage/${validation.normalizedToken}`);
    } catch (err) {
      setError("Failed to access quote. Please try again.");
      setLoading(false);
    }
  };

  // Handle Email + Quote ID Lookup
  const handleEmailQuoteAccess = async (e) => {
    e.preventDefault();
    setError("");
    setQuoteIdErrors([]);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!quoteId.trim()) {
      setError("Please enter your Quote ID");
      setQuoteIdErrors(["Quote ID is required"]);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    const normalizedQuoteId = normalizeToken(quoteId);
    if (!validateQuoteId(normalizedQuoteId)) {
      setError("Invalid Quote ID format");
      setQuoteIdErrors([
        normalizedQuoteId.length !== 6
          ? `Quote ID must be exactly 6 characters (currently ${normalizedQuoteId.length})`
          : "Quote ID can only contain letters A-Z and numbers 0-9",
      ]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/quote/lookup", {
        email: email.trim().toLowerCase(),
        quoteId: normalizedQuoteId,
      });
      const { accessToken } = response.data;
      if (accessToken) {
        router.push(`/manage/${accessToken}`);
      } else {
        throw new Error("Access token not found in response");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Quote not found. Please check your email and Quote ID.");
      } else if (err.response?.status === 410) {
        setError(
          "This quote has expired. Please get a new quote if you're still interested."
        );
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to find quote. Please try again or contact support.");
      }
      setLoading(false);
    }
  };

  // Handle Access Token Input
  const handleAccessTokenChange = (e) => {
    const input = e.target.value;
    const sanitized = sanitizeAccessToken(input);
    setAccessToken(sanitized);
    if (tokenErrors.length > 0) setTokenErrors([]);
    if (error && error.includes("access token")) setError("");
  };

  // Handle Quote ID Input
  const handleQuoteIdChange = (e) => {
    const input = e.target.value;
    const sanitized = sanitizeAccessToken(input);
    setQuoteId(sanitized);
    if (quoteIdErrors.length > 0) setQuoteIdErrors([]);
    if (error && error.includes("Quote ID")) setError("");
  };

  // Validation Feedback Component
  const ValidationFeedback = ({ errors, isValid, value }) => {
    if (!value || value.length === 0) return null;
    return (
      <Box sx={{ mt: 1 }}>
        {isValid ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CheckCircleIcon sx={{ fontSize: 16, color: "#057642" }} />
            <Typography variant="body2" sx={{ color: "#057642", fontSize: "0.813rem" }}>
              Valid format
            </Typography>
          </Box>
        ) : (
          <Stack spacing={0.5}>
            {errors.map((error, index) => (
              <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ErrorIcon sx={{ fontSize: 16, color: "#dc2626" }} />
                <Typography variant="body2" sx={{ color: "#dc2626", fontSize: "0.813rem" }}>
                  {error}
                </Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f2ef",
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <DirectionsCarIcon sx={{ fontSize: 48, color: "#0a66c2", mb: 2 }} />
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#000000",
              mb: 1.5,
              fontSize: { xs: "2rem", md: "2.5rem" },
              letterSpacing: "-0.02em",
            }}
          >
            Manage Your Quote
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#666666",
              maxWidth: "600px",
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            Access your quote to schedule pickup, cancel, or update your information.
          </Typography>
        </Box>

        {/* Main Card */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: "#e0dfdc",
            bgcolor: "#ffffff",
            boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.08)",
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <Tabs
            value={tabValue}
            onChange={(e, newValue) => setTabValue(newValue)}
            sx={{
              borderBottom: "1px solid #e0dfdc",
              px: 2,
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                color: "#666666",
                minHeight: 56,
                "&.Mui-selected": {
                  color: "#0a66c2",
                },
              },
              "& .MuiTabs-indicator": {
                bgcolor: "#0a66c2",
                height: 3,
              },
            }}
          >
            <Tab icon={<VpnKeyIcon />} iconPosition="start" label="Quick Access" />
            <Tab icon={<SearchIcon />} iconPosition="start" label="Find My Quote" />
          </Tabs>

          {/* Tab Panels */}
          <Box sx={{ p: 4 }}>
            {/* Tab 0: Quick Access */}
            {tabValue === 0 && (
              <form onSubmit={handleDirectAccess}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#000000" }}>
                      Access Token
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666666", mb: 2 }}>
                      Enter the 6-character access token from your confirmation email
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., A7K9M2"
                      value={accessToken}
                      onChange={handleAccessTokenChange}
                      inputProps={{ 
                        maxLength: VALIDATION_CONSTANTS.ACCESS_TOKEN_LENGTH,
                        style: { 
                          fontFamily: "monospace", 
                          fontSize: "1.125rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKeyIcon sx={{ color: "#666666" }} />
                          </InputAdornment>
                        ),
                      }}
                      error={tokenErrors.length > 0}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f9fafb",
                          "&:hover": {
                            bgcolor: "#ffffff",
                          },
                          "&.Mui-focused": {
                            bgcolor: "#ffffff",
                          },
                          "&.Mui-error": {
                            "& fieldset": {
                              borderColor: "#dc2626",
                            },
                          },
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography variant="caption" sx={{ color: "#666666" }}>
                        6 characters (letters & numbers only)
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            accessToken.length === VALIDATION_CONSTANTS.ACCESS_TOKEN_LENGTH
                              ? "#057642"
                              : accessToken.length > VALIDATION_CONSTANTS.ACCESS_TOKEN_LENGTH
                              ? "#dc2626"
                              : "#666666",
                          fontWeight: 600,
                        }}
                      >
                        {accessToken.length}/{VALIDATION_CONSTANTS.ACCESS_TOKEN_LENGTH}
                      </Typography>
                    </Box>
                    <ValidationFeedback
                      errors={tokenErrors}
                      isValid={
                        accessToken.length > 0 &&
                        validateAndNormalizeAccessToken(accessToken).isValid
                      }
                      value={accessToken}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={
                      loading ||
                      (accessToken.length > 0 &&
                        !validateAndNormalizeAccessToken(accessToken).isValid)
                    }
                    sx={{
                      bgcolor: "#0a66c2",
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "#004182",
                      },
                      "&:disabled": {
                        bgcolor: "#e0dfdc",
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Access My Quote"}
                  </Button>
                </Stack>
              </form>
            )}

            {/* Tab 1: Find by Email */}
            {tabValue === 1 && (
              <form onSubmit={handleEmailQuoteAccess}>
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#000000" }}>
                      Email & Quote ID
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#666666", mb: 2 }}>
                      Use your email and Quote ID to find your quote
                    </Typography>
                  </Box>

                  {/* Email Field */}
                  <TextField
                    fullWidth
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error && error.includes("email")) setError("");
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon sx={{ color: "#666666" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                        bgcolor: "#f9fafb",
                        "&:hover": {
                          bgcolor: "#ffffff",
                        },
                        "&.Mui-focused": {
                          bgcolor: "#ffffff",
                        },
                      },
                    }}
                  />

                  {/* Quote ID Field */}
                  <Box>
                    <TextField
                      fullWidth
                      label="Quote ID"
                      placeholder="e.g., X4B8N6"
                      value={quoteId}
                      onChange={handleQuoteIdChange}
                      inputProps={{
                        maxLength: VALIDATION_CONSTANTS.QUOTE_ID_LENGTH,
                        style: {
                          fontFamily: "monospace",
                          fontSize: "1.125rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#666666" }} />
                          </InputAdornment>
                        ),
                      }}
                      error={quoteIdErrors.length > 0}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: "#f9fafb",
                          "&:hover": {
                            bgcolor: "#ffffff",
                          },
                          "&.Mui-focused": {
                            bgcolor: "#ffffff",
                          },
                        },
                      }}
                    />
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography variant="caption" sx={{ color: "#666666" }}>
                        6 characters from confirmation email
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          color:
                            quoteId.length === VALIDATION_CONSTANTS.QUOTE_ID_LENGTH
                              ? "#057642"
                              : quoteId.length > VALIDATION_CONSTANTS.QUOTE_ID_LENGTH
                              ? "#dc2626"
                              : "#666666",
                          fontWeight: 600,
                        }}
                      >
                        {quoteId.length}/{VALIDATION_CONSTANTS.QUOTE_ID_LENGTH}
                      </Typography>
                    </Box>
                    <ValidationFeedback
                      errors={quoteIdErrors}
                      isValid={
                        quoteId.length > 0 && validateQuoteId(normalizeToken(quoteId))
                      }
                      value={quoteId}
                    />
                  </Box>

                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={
                      loading ||
                      !email.trim() ||
                      !quoteId.trim() ||
                      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                      !validateQuoteId(normalizeToken(quoteId))
                    }
                    sx={{
                      bgcolor: "#0a66c2",
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      textTransform: "none",
                      borderRadius: 2,
                      "&:hover": {
                        bgcolor: "#004182",
                      },
                      "&:disabled": {
                        bgcolor: "#e0dfdc",
                      },
                    }}
                  >
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Find My Quote"}
                  </Button>
                </Stack>
              </form>
            )}

            {/* Error Alert */}
            {error && (
              <Alert
                severity="error"
                sx={{
                  mt: 3,
                  borderRadius: 2,
                  border: "1px solid #fecaca",
                  bgcolor: "#fef2f2",
                }}
                onClose={() => setError("")}
              >
                {error}
              </Alert>
            )}
          </Box>
        </Paper>

        {/* Help Section */}
        <Paper
          elevation={0}
          sx={{
            mt: 4,
            p: 4,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "#e0dfdc",
            bgcolor: "#ffffff",
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start" mb={3}>
            <HelpOutlineIcon sx={{ fontSize: 28, color: "#0a66c2", mt: 0.5 }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: "#000000" }}>
                Need Help?
              </Typography>
              <Typography variant="body2" sx={{ color: "#666666", lineHeight: 1.6 }}>
                Can't find your access information? Here's what to do:
              </Typography>
            </Box>
          </Stack>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <Box sx={{ pl: 2 }}>
              <Typography variant="body2" sx={{ color: "#000000", mb: 0.5 }}>
                • Check your email for the quote confirmation
              </Typography>
              <Typography variant="body2" sx={{ color: "#000000", mb: 0.5 }}>
                • Look for subject line: "Your Cash Offer from PNW Cash For Cars"
              </Typography>
              <Typography variant="body2" sx={{ color: "#000000", mb: 0.5 }}>
                • The 6-character access token is in the email body
              </Typography>
              <Typography variant="body2" sx={{ color: "#000000" }}>
                • Quote ID is also 6 characters (letters and numbers only)
              </Typography>
            </Box>
          </Stack>

          <Divider sx={{ my: 3, borderColor: "#e0dfdc" }} />

          {/* Format Examples */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#edf3f8",
              border: "1px solid #b9d6f2",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: "#0a66c2" }}>
              Format Examples:
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" sx={{ color: "#000000", fontWeight: 500 }}>
                  Access Token:
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#ffffff",
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    fontFamily: "monospace",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#0a66c2",
                    letterSpacing: "0.1em",
                  }}
                >
                  A7K9M2
                </Paper>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography variant="body2" sx={{ color: "#000000", fontWeight: 500 }}>
                  Quote ID:
                </Typography>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#ffffff",
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    fontFamily: "monospace",
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "#0a66c2",
                    letterSpacing: "0.1em",
                  }}
                >
                  X4B8N6
                </Paper>
              </Box>
            </Stack>
          </Paper>

          <Divider sx={{ my: 3, borderColor: "#e0dfdc" }} />

          {/* Contact Support */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" sx={{ color: "#666666", mb: 2 }}>
              Still need assistance?
            </Typography>
            <Button
              variant="outlined"
              size="small"
              href="/contact"
              sx={{
                borderColor: "#e0dfdc",
                color: "#0a66c2",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                "&:hover": {
                  borderColor: "#0a66c2",
                  bgcolor: "#edf3f8",
                },
              }}
            >
              Contact Support
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
