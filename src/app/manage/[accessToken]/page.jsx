/** route: src/app/manage/[accessToken]/page.jsx */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Chip,
  Divider,
  Stack,
  Fade,
} from "@mui/material";
import {
  ArrowBack as ArrowBackIcon,
  DirectionsCar as CarIcon,
  Schedule as ClockIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";
import { ThemeProvider } from "@mui/material/styles";
import { linkedinTheme } from "@/theme/linkedinTheme";
import QuoteManager from "@/components/customer/QuoteManager";
import { getQuoteByToken } from "@/lib/quoteApi";

export default function QuoteManagementPage({ params }) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState(null);
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // Mark component as mounted to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Combined effect to resolve params and fetch quote
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        // Step 1: Resolve params
        const resolvedParams = await params;
        const token = resolvedParams.accessToken;
        
        if (!isMounted) return;
        
        setAccessToken(token);

        // Step 2: Fetch quote with resolved token
        const result = await getQuoteByToken(token);
        console.log("manage/[accessToken] = Fetched quote:", result);

        if (!isMounted) return;

        if (result.success) {
          setQuote(result.data.quote);
          console.log("result.success ===> ", result.data.quote);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error("Error loading quote:", err);
        if (isMounted) {
          setError("Failed to load quote. Please try again.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [params]);

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: <ClockIcon />,
        label: "Pending Review",
        color: "warning",
      },
      accepted: {
        icon: <CheckCircleIcon />,
        label: "Accepted",
        color: "success",
      },
      pickup_scheduled: {
        icon: <CheckCircleIcon />,
        label: "Pickup Scheduled",
        color: "success",
      },
      customer_cancelled: {
        icon: <CancelIcon />,
        label: "Cancelled",
        color: "error",
      },
      rescheduled: {
        icon: <WarningIcon />,
        label: "Rescheduled",
        color: "info",
      },
      expired: {
        icon: <WarningIcon />,
        label: "Expired",
        color: "default",
      },
    };

    return configs[status] || configs.pending;
  };

  // Show loading state during SSR and initial client render
  if (!mounted || loading) {
    return (
      <ThemeProvider theme={linkedinTheme}>
        <Box
          sx={{
            minHeight: "100vh",
            bgcolor: "background.default",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack spacing={2} alignItems="center">
            <CircularProgress size={48} />
            <Typography color="text.secondary">Loading your quote...</Typography>
          </Stack>
        </Box>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={linkedinTheme}>
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 30 }}>
          <Container maxWidth="sm">
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <CancelIcon
                  sx={{ fontSize: 64, color: "error.main", mb: 2 }}
                />
                <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                  Quote Not Found
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 4 }}>
                  {error}
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="center">
                  <Button
                    variant="outlined"
                    onClick={() => router.push("/manage")}
                  >
                    Try Again
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => router.push("/quote")}
                  >
                    Get New Quote
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </ThemeProvider>
    );
  }

  const statusConfig = getStatusConfig(quote.status);

  return (
    <ThemeProvider theme={linkedinTheme}>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
          <Fade in timeout={500}>
            <Box>
              {/* Back Button */}
              <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push("/manage")}
                sx={{ mb: 3, color: "text.secondary" }}
              >
                Back to Search
              </Button>

              {/* Header Section */}
              <Box sx={{ mb: 4 }}>
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems={{ xs: "flex-start", sm: "center" }}
                  justifyContent="space-between"
                >
                  <Box>
                    <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
                      Quote Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {quote.vehicleName} • Quote {quote.quoteId}
                    </Typography>
                  </Box>
                  <Chip
                    icon={statusConfig.icon}
                    label={statusConfig.label}
                    color={statusConfig.color}
                    sx={{
                      height: 40,
                      px: 1.5,
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      "& .MuiChip-icon": { fontSize: 20 },
                    }}
                  />
                </Stack>
              </Box>

              {/* Quote Overview Card */}
              <Card sx={{ mb: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                    <CarIcon color="primary" />
                    <Typography variant="h6" fontWeight={600}>
                      Quote Overview
                    </Typography>
                  </Stack>
                  <Divider sx={{ mb: 3 }} />
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: {
                        xs: "1fr",
                        sm: "repeat(3, 1fr)",
                      },
                      gap: 3,
                    }}
                  >
                    {/* Offer Amount */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h3"
                        color="success.main"
                        fontWeight={700}
                        sx={{ mb: 0.5 }}
                      >
                        ${quote.pricing.finalPrice.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Offer Amount
                      </Typography>
                    </Box>

                    {/* Created Date */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 0.5 }}
                      >
                        {new Date(quote.createdAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Created
                      </Typography>
                    </Box>

                    {/* Expiration Date */}
                    <Box sx={{ textAlign: "center" }}>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{ mb: 0.5 }}
                      >
                        {new Date(quote.expiresAt).toLocaleDateString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Expires
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>

              {/* Quote Manager Component */}
              <QuoteManager quote={quote} onQuoteUpdate={setQuote} />
            </Box>
          </Fade>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
