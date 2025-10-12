/** route: src/app/register/page.jsx */
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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
  IconButton,
  Stack,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import axios from "@/lib/axios";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Validate
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error("Please fill in all required fields");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Password validation
      if (formData.password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!agreedToTerms) {
        throw new Error("Please agree to the Terms of Service");
      }

      // Register API call
      const response = await axios.post("/api/auth/register", {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      // Handle pending quote if exists
      const pendingQuote = sessionStorage.getItem("pendingQuote");
      
      if (pendingQuote && redirect === "quote") {
        const quoteData = JSON.parse(pendingQuote);
        
        // Submit quote with authenticated user
        const quoteResponse = await axios.post("/api/quote", {
          ...quoteData,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
        });
        
        sessionStorage.removeItem("pendingQuote");
        router.push(`/manage/${quoteResponse.data.accessToken}`);
      } else {
        // Normal registration redirect
        router.push("/manage");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError(
        error.response?.data?.error || 
        error.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f3f2ef",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* Back to Home Link */}
        <Box sx={{ mb: 3 }}>
          <Button
            component={Link}
            href="/"
            startIcon={<ArrowBackIcon />}
            sx={{
              color: "#666666",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#e0dfdc",
              },
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Register Card */}
        <Paper
          elevation={0}
          sx={{
            p: 5,
            borderRadius: 2,
            border: "1px solid",
            borderColor: "#e0dfdc",
            bgcolor: "#ffffff",
            boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 2px 4px rgba(0,0,0,.08)",
          }}
        >
          {/* Logo/Brand */}
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#000000",
                mb: 1,
                letterSpacing: "-0.02em",
              }}
            >
              Create Your Account
            </Typography>
            <Typography variant="body1" sx={{ color: "#666666" }}>
              Get started with PNW Cash For Cars
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, borderRadius: 2 }}
              onClose={() => setError("")}
            >
              {error}
            </Alert>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Name Field */}
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                required
                autoFocus
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "#666666", fontSize: 22 }} />
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

              {/* Email Field */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#666666", fontSize: 22 }} />
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

              {/* Phone Field */}
              <TextField
                fullWidth
                label="Phone Number (Optional)"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "#666666", fontSize: 22 }} />
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

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
                helperText="Minimum 6 characters"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#666666", fontSize: 22 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        size="small"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ fontSize: 22 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 22 }} />
                        )}
                      </IconButton>
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

              {/* Confirm Password Field */}
              <TextField
                fullWidth
                label="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#666666", fontSize: 22 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        size="small"
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff sx={{ fontSize: 22 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 22 }} />
                        )}
                      </IconButton>
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

              {/* Terms Checkbox */}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    sx={{
                      color: "#0a66c2",
                      "&.Mui-checked": {
                        color: "#0a66c2",
                      },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: "#666666" }}>
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      style={{ color: "#0a66c2", textDecoration: "none" }}
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      style={{ color: "#0a66c2", textDecoration: "none" }}
                    >
                      Privacy Policy
                    </Link>
                  </Typography>
                }
              />

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                startIcon={isSubmitting ? null : <PersonAddIcon />}
                sx={{
                  bgcolor: "#0a66c2",
                  color: "#ffffff",
                  py: 1.75,
                  fontSize: "1.063rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  boxShadow: "none",
                  "&:hover": {
                    bgcolor: "#004182",
                    boxShadow: "0 2px 8px rgba(10,102,194,0.3)",
                  },
                  "&:disabled": {
                    bgcolor: "#e0dfdc",
                    color: "#999999",
                  },
                }}
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Create Account"
                )}
              </Button>
            </Stack>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 4, borderColor: "#e0dfdc" }}>
            <Typography variant="body2" sx={{ color: "#666666", px: 2 }}>
              Already have an account?
            </Typography>
          </Divider>

          {/* Login Link */}
          <Button
            component={Link}
            href={redirect ? `/login?redirect=${redirect}` : "/login"}
            variant="outlined"
            fullWidth
            sx={{
              borderColor: "#e0dfdc",
              color: "#000000",
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              borderWidth: "2px",
              "&:hover": {
                borderColor: "#0a66c2",
                bgcolor: "#edf3f8",
                borderWidth: "2px",
              },
            }}
          >
            Sign In Instead
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}


