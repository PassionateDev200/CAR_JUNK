/** route: src/components/customer/PickupSchedulingModal.jsx */
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
  Box,
  Typography,
  MenuItem,
  Stack,
  Grid,
} from "@mui/material";
import {
  Event as CalendarIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

export default function PickupSchedulingModal({ 
  open, 
  onClose, 
  onContinue, 
  onBack,
  initialData = {} 
}) {
  const [formData, setFormData] = useState({
    scheduledDate: initialData.scheduledDate || "",
    pickupWindow: initialData.pickupWindow || "",
  });
  
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
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

  const validateForm = () => {
    if (!formData.scheduledDate || !formData.pickupWindow) {
      setError("Please select both a pickup date and time window.");
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

  const handleContinue = () => {
    if (!validateForm()) return;
    onContinue(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            Pickup scheduling
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {error && (
            <Alert severity="error" icon={<WarningIcon />}>
              {error}
            </Alert>
          )}

          {/* Date and Time Window */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" fontWeight={600} gutterBottom>
                Pickup Time
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
            </Grid>
          </Grid>

          {/* Info Box */}
          <Alert severity="info">
            <Typography variant="body2">
              We'll confirm your pickup time 24 hours before the scheduled date.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onBack}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
        >
          Back
        </Button>
        <Button
          onClick={handleContinue}
          variant="contained"
          endIcon={<ArrowForwardIcon />}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}

