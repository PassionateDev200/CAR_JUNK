/** route: src/app/login/page.jsx */
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
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  ArrowBack as ArrowBackIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import axios from "@/lib/axios";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Please enter a valid email address");
      }

      // Login using AuthContext (this updates the global auth state)
      const response = await authLogin(formData.email, formData.password);

      // Handle pending quote if exists
      const pendingQuote = sessionStorage.getItem("pendingQuote");
      
      if (pendingQuote && redirect === "quote") {
        const quoteData = JSON.parse(pendingQuote);
        
        // Submit quote with authenticated user
        const quoteResponse = await axios.post("/api/quote", {
          ...quoteData,
          customer: {
            ...quoteData.customer,
            email: formData.email,
          },
        });
        
        sessionStorage.removeItem("pendingQuote");
        router.push(`/manage/${quoteResponse.data.accessToken}`);
      } else {
        // Normal login redirect
        router.push("/manage");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.error || 
        error.message || 
        "Invalid email or password. Please try again."
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

        {/* Login Card */}
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
              Welcome Back
            </Typography>
            <Typography variant="body1" sx={{ color: "#666666" }}>
              Sign in to manage your quotes and offers
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

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              {/* Email Field */}
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
                autoFocus
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

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleChange("password", e.target.value)}
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

              {/* Forgot Password Link */}
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  component={Link}
                  href="/forgot-password"
                  sx={{
                    color: "#0a66c2",
                    fontSize: "0.938rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Forgot password?
                </Typography>
              </Box>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={isSubmitting}
                startIcon={isSubmitting ? null : <LoginIcon />}
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
                  "Sign In"
                )}
              </Button>
            </Stack>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 4, borderColor: "#e0dfdc" }}>
            <Typography variant="body2" sx={{ color: "#666666", px: 2 }}>
              New to PNW Cash For Cars?
            </Typography>
          </Divider>

          {/* Register Link */}
          <Button
            component={Link}
            href={redirect ? `/register?redirect=${redirect}` : "/register"}
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
            Create an Account
          </Button>
        </Paper>

        {/* Footer */}
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            color: "#666666",
            mt: 3,
            fontSize: "0.875rem",
          }}
        >
          By signing in, you agree to our{" "}
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
      </Container>
    </Box>
  );
}


