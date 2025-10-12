/** route:  src/components/customer/ScheduleDialog.jsx*/
"use client";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  AlertTitle,
  Box,
  Typography,
  MenuItem,
  Stack,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Event as CalendarIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";
import axios from "axios";

export default function ScheduleDialog({
  open,
  onOpenChange,
  quote,
  onActionComplete,
  loading,
  setLoading,
}) {
  // Check if there's already a scheduled pickup
  const hasExistingSchedule = quote?.pickupDetails?.scheduledDate;
  const isRescheduling = hasExistingSchedule && quote?.status === "pickup_scheduled";
  
  const [formData, setFormData] = useState({
    scheduledDate: "",
    pickupWindow: "",
    specialInstructions: "",
    contactPhone: quote?.customer?.phone || quote?.sellerInfo?.phone || "",
    pickupAddress: quote?.customer?.address || quote?.sellerInfo?.address || "",
  });
  
  const [error, setError] = useState("");
  const [addressVerifying, setAddressVerifying] = useState(false);
  const [addressVerified, setAddressVerified] = useState(false);

  // Update state field
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
    // Reset address verification when address changes
    if (field === "pickupAddress") {
      setAddressVerified(false);
    }
  };

  // Address verification function
  const verifyAddress = async () => {
    if (!formData.pickupAddress || formData.pickupAddress.trim().length < 10) {
      setError("Please enter a complete address (Street, City, State, ZIP)");
      return;
    }

    setAddressVerifying(true);
    setError("");

    try {
      const response = await axios.post("/api/verify-address", {
        address: formData.pickupAddress,
      });

      if (response.data.verified) {
        setAddressVerified(true);
        // Optionally update with normalized address
        if (response.data.normalizedAddress) {
          setFormData((prev) => ({
            ...prev,
            pickupAddress: response.data.normalizedAddress,
          }));
        }
      } else {
        setError(response.data.error || "Address could not be verified. Please check and try again.");
        setAddressVerified(false);
      }
    } catch (err) {
      setError("Failed to verify address. Please check the address format.");
      setAddressVerified(false);
    } finally {
      setAddressVerifying(false);
    }
  };

  // Form validation
  const validateForm = () => {
    if (!formData.scheduledDate || !formData.pickupWindow) {
      setError("Please select both a pickup date and time window.");
      return false;
    }
    if (!formData.contactPhone || formData.contactPhone.trim().length < 8) {
      setError("Please enter a valid phone number.");
      return false;
    }
    if (!formData.pickupAddress || formData.pickupAddress.trim().length < 10) {
      setError("Please enter a complete pickup address.");
      return false;
    }
    if (!addressVerified) {
      setError("Please verify your pickup address before scheduling.");
      return false;
    }
    // Date in the future
    const selectedDate = new Date(formData.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Pickup date cannot be in the past.");
      return false;
    }
    return true;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/quote/schedule-pickup", {
        accessToken: quote.accessToken,
        scheduledDate: formData.scheduledDate,
        pickupWindow: formData.pickupWindow,
        specialInstructions: formData.specialInstructions,
        contactPhone: formData.contactPhone,
        pickupAddress: formData.pickupAddress,
      });

      if (response.data.success) {
        // Pass the updated quote data to parent component
        if (onActionComplete && response.data.quote) {
          onActionComplete(response.data.quote);
        }
        
        // Show success message based on whether it's a reschedule or new schedule
        if (response.data.isReschedule) {
          console.log("✅ Pickup rescheduled successfully");
        } else {
          console.log("✅ Pickup scheduled successfully");
        }
        
        onOpenChange(false); // close modal first
      } else {
        setError(response.data.error || "Failed to schedule pickup.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to schedule pickup. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Define pickup time windows
  const pickupWindows = [
    {
      value: "morning",
      label: "Morning (8:00 AM - 12:00 PM)",
    },
    {
      value: "afternoon",
      label: "Afternoon (12:00 PM - 4:00 PM)",
    },
    {
      value: "evening",
      label: "Evening (4:00 PM - 9:00 PM)",
    },
  ];

  // Date range: tomorrow to +30d
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <CalendarIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            {isRescheduling ? "Reschedule Pickup" : "Schedule Pickup"}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={3}>
            {error && (
              <Alert severity="error" icon={<WarningIcon />}>
                {error}
              </Alert>
            )}

            {/* Date */}
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Pickup Date *
              </Typography>
              <TextField
                fullWidth
                type="date"
                inputProps={{
                  min: minDate,
                  max: maxDateString,
                }}
                value={formData.scheduledDate}
                onChange={(e) => handleInputChange("scheduledDate", e.target.value)}
                required
              />
            </Box>

            {/* Pickup Time Window */}
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Pickup Time Window *
              </Typography>
              <TextField
                fullWidth
                select
                value={formData.pickupWindow}
                onChange={(e) => handleInputChange("pickupWindow", e.target.value)}
                placeholder="Select pickup window"
                required
              >
                {pickupWindows.map((window) => (
                  <MenuItem key={window.value} value={window.value}>
                    {window.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            {/* Phone */}
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Contact Phone *
              </Typography>
              <TextField
                fullWidth
                placeholder="e.g. (555) 123-4567"
                value={formData.contactPhone}
                onChange={(e) => handleInputChange("contactPhone", e.target.value)}
                required
                inputProps={{ maxLength: 20 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PhoneIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {/* Pickup Address */}
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Pickup Address *
              </Typography>
              <TextField
                fullWidth
                placeholder="Street, City, State, ZIP"
                value={formData.pickupAddress}
                onChange={(e) => handleInputChange("pickupAddress", e.target.value)}
                required
                inputProps={{ maxLength: 200 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderColor: addressVerified ? "success.main" : undefined,
                  },
                }}
              />
              <Button
                fullWidth
                variant={addressVerified ? "outlined" : "text"}
                color={addressVerified ? "success" : "primary"}
                onClick={verifyAddress}
                disabled={
                  addressVerifying ||
                  !formData.pickupAddress ||
                  formData.pickupAddress.length < 10
                }
                sx={{ mt: 1 }}
                startIcon={
                  addressVerifying ? (
                    <CircularProgress size={16} />
                  ) : addressVerified ? (
                    <CheckCircleIcon />
                  ) : (
                    <LocationIcon />
                  )
                }
              >
                {addressVerifying
                  ? "Verifying..."
                  : addressVerified
                  ? "Address Verified"
                  : "Verify Address"}
              </Button>
              {addressVerified && (
                <Typography
                  variant="caption"
                  color="success.main"
                  sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 1 }}
                >
                  <CheckCircleIcon sx={{ fontSize: 14 }} />
                  Address verified and ready for pickup
                </Typography>
              )}
            </Box>

            {/* Special Instructions */}
            <Box>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Special Instructions (Optional)
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="Any special instructions for pickup (e.g., gate code, parking location, etc.)"
                value={formData.specialInstructions}
                onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                inputProps={{ maxLength: 500 }}
              />
              <Typography variant="caption" color="text.secondary">
                {formData.specialInstructions.length}/500 characters
              </Typography>
            </Box>
          </Stack>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={() => onOpenChange(false)}
          disabled={loading}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          variant="contained"
          startIcon={loading ? <CircularProgress size={16} /> : <CalendarIcon />}
        >
          {loading
            ? isRescheduling
              ? "Rescheduling..."
              : "Scheduling..."
            : isRescheduling
            ? "Reschedule Pickup"
            : "Schedule Pickup"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
