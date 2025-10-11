/** route: src/components/quote/PriceModal.jsx */
"use client";

import { 
  Dialog, 
  DialogTitle, 
  Typography, 
  Box, 
  Button, 
  Paper,
  Stack,
  Divider,
  IconButton,
} from "@mui/material";
import { 
  Close as CloseIcon,
  PersonAdd as PersonAddIcon,
  Login as LoginIcon,
  LocalOffer as LocalOfferIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { useVehicle } from "@/contexts/VehicleContext";

export default function PriceModal({ isOpen, onClose, onCreateAccount, onLogin }) {
  const vehicleState = useVehicle();
  const { vehicleDetails, pricing } = vehicleState;

  const vehicleName = `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;

  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 0 0 1px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.15)",
          maxWidth: "560px",
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ pb: 2, pt: 3, px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#000000",
              letterSpacing: "-0.02em",
            }}
          >
            🎉 Your Car's Value
          </Typography>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{ 
              color: "#666666",
              "&:hover": { 
                bgcolor: "#f3f2ef",
                color: "#000000",
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <Divider sx={{ borderColor: "#e0dfdc" }} />

      {/* Offer Card - Always Visible (No Scroll) */}
      <Box sx={{ px: 3, pt: 3, pb: 2 }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#f0f9f6",
            border: "2px solid #057642",
            borderRadius: 2.5,
            p: 3,
            textAlign: "center",
          }}
        >
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#000000", 
              mb: 2,
              fontSize: "1.063rem",
              fontWeight: 500,
              lineHeight: 1.5,
            }}
          >
            We'd love to buy your{" "}
            <Box component="span" sx={{ fontWeight: 700 }}>
              {vehicleName}
            </Box>
            {" "}for
          </Typography>

          <Typography
            variant="h3"
            sx={{
              color: "#057642",
              fontWeight: 800,
              fontSize: { xs: "3rem", sm: "3.5rem" },
              lineHeight: 1,
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            ${pricing.currentPrice?.toLocaleString()}
          </Typography>

          <Stack 
            direction="row" 
            spacing={1} 
            justifyContent="center" 
            alignItems="center"
            sx={{ color: "#057642" }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.938rem" }}>
              Free pickup
            </Typography>
            <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "#057642" }} />
            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.938rem" }}>
              Payment on the spot
            </Typography>
          </Stack>
        </Paper>

        {/* Instructions */}
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: "center", 
            color: "#666666",
            fontSize: "0.938rem",
            lineHeight: 1.6,
            px: 1,
            mt: 2,
          }}
        >
          Create an account or log in to get your official quote and manage your offer
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Stack spacing={1.5}>
          <Button
            onClick={onCreateAccount}
            variant="contained"
            fullWidth
            startIcon={<PersonAddIcon />}
            sx={{
              bgcolor: "#0a66c2",
              color: "#ffffff",
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#004182",
                boxShadow: "0 2px 8px rgba(10,102,194,0.3)",
              },
            }}
          >
            Create Account
          </Button>

          <Button
            onClick={onLogin}
            variant="outlined"
            fullWidth
            startIcon={<LoginIcon />}
            sx={{
              borderColor: "#0a66c2",
              color: "#0a66c2",
              py: 1.5,
              fontSize: "1rem",
              fontWeight: 600,
              textTransform: "none",
              borderRadius: 2,
              borderWidth: "2px",
              "&:hover": {
                borderColor: "#004182",
                bgcolor: "#edf3f8",
                borderWidth: "2px",
              },
            }}
          >
            Login
          </Button>

          <Button
            onClick={onClose}
            variant="text"
            fullWidth
            sx={{
              color: "#666666",
              py: 1.25,
              fontSize: "0.938rem",
              fontWeight: 500,
              textTransform: "none",
              "&:hover": {
                bgcolor: "#f3f2ef",
                color: "#000000",
              },
            }}
          >
            Cancel
          </Button>
        </Stack>
      </Box>

      <Divider sx={{ borderColor: "#e0dfdc", mx: 3 }} />

      {/* Information Panels - Fixed (No Scroll) */}
      <Box sx={{ px: 3, py: 3 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          {/* How did we reach this offer? */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              bgcolor: "#edf3f8",
              border: "1px solid #b9d6f2",
              borderRadius: 2,
              p: 2.5,
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#0a66c2",
                boxShadow: "0 2px 8px rgba(10,102,194,0.1)",
              },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start" mb={1}>
              <TrendingUpIcon sx={{ color: "#0a66c2", fontSize: 22, mt: 0.2 }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 700,
                  color: "#0a66c2",
                  fontSize: "0.938rem",
                  lineHeight: 1.4,
                }}
              >
                How did we reach ${pricing.currentPrice?.toLocaleString()}?
              </Typography>
            </Stack>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#000000",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                mb: 1.5,
              }}
            >
              The three main criteria we use to calculate our offers are market value, vehicle condition, and documentation (like title status).
            </Typography>
            <Typography
              component="button"
              onClick={(e) => e.preventDefault()}
              sx={{
                color: "#0a66c2",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "underline",
                border: "none",
                bgcolor: "transparent",
                cursor: "pointer",
                p: 0,
                "&:hover": {
                  color: "#004182",
                },
              }}
            >
              What affects an offer calculation?
            </Typography>
          </Paper>

          {/* What happens next? */}
          <Paper
            elevation={0}
            sx={{
              flex: 1,
              bgcolor: "#f0f9f6",
              border: "1px solid #c8e6d4",
              borderRadius: 2,
              p: 2.5,
              transition: "all 0.2s ease",
              "&:hover": {
                borderColor: "#057642",
                boxShadow: "0 2px 8px rgba(5,118,66,0.1)",
              },
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="flex-start" mb={1}>
              <ScheduleIcon sx={{ color: "#057642", fontSize: 22, mt: 0.2 }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 700,
                  color: "#057642",
                  fontSize: "0.938rem",
                  lineHeight: 1.4,
                }}
              >
                What happens next?
              </Typography>
            </Stack>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#000000",
                fontSize: "0.875rem",
                lineHeight: 1.6,
                mb: 1.5,
              }}
            >
              If you haven't already created an account, you'll do that. Then, you'll let us know how to pay and when to pick that car up. Easy peasy.
            </Typography>
            <Typography
              component="button"
              onClick={(e) => e.preventDefault()}
              sx={{
                color: "#057642",
                fontSize: "0.875rem",
                fontWeight: 600,
                textDecoration: "underline",
                border: "none",
                bgcolor: "transparent",
                cursor: "pointer",
                p: 0,
                "&:hover": {
                  color: "#024e2d",
                },
              }}
            >
              What are the next steps?
            </Typography>
          </Paper>
        </Stack>
      </Box>
    </Dialog>
  );
}
