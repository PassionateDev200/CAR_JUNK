/** route:  src/components/customer/RescheduleDialog.jsx*/
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stack,
  Grid,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Schedule as ClockIcon,
} from "@mui/icons-material";
import { reschedulePickup } from "@/lib/quoteApi";

export default function RescheduleDialog({
  open,
  onOpenChange,
  quote,
  onActionComplete,
  loading,
  setLoading,
}) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const reasons = [
    {
      value: "schedule_conflict",
      label: "Schedule conflict",
      description: "I have a conflicting appointment",
    },
    {
      value: "weather_concerns",
      label: "Weather concerns",
      description: "Weather conditions are not suitable",
    },
    {
      value: "location_change",
      label: "Location change",
      description: "I need to change the pickup location",
    },
    {
      value: "personal_emergency",
      label: "Personal emergency",
      description: "An unexpected personal situation arose",
    },
    {
      value: "vehicle_accessibility",
      label: "Vehicle accessibility",
      description: "Issues accessing the vehicle at scheduled time",
    },
    {
      value: "other",
      label: "Other",
      description: "Please specify in the notes below",
    },
  ];

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ];

  const handleReschedule = async () => {
    if (!newDate || !newTime || !reason) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate date is in the future
    const selectedDate = new Date(newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setError("Please select a future date");
      return;
    }

    if (reason === "other" && !note.trim()) {
      setError("Please provide details for 'Other' reason");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await reschedulePickup(
        quote.accessToken,
        newDate,
        newTime,
        reason,
        note
      );

      if (result.success) {
        onActionComplete(result.data.quote);
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to reschedule pickup. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setNewDate("");
      setNewTime("");
      setReason("");
      setNote("");
      setError("");
      onOpenChange(false);
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <RefreshIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Reschedule Pickup
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Current Pickup Info */}
          {quote.pickupDetails &&
            (quote.pickupDetails.scheduledDate ||
              quote.pickupDetails.scheduledTime) && (
              <Alert severity="info" icon={<ClockIcon />}>
                <Typography variant="body2">
                  <strong>Current pickup:</strong>{" "}
                  {quote.pickupDetails.scheduledDate &&
                    new Date(
                      quote.pickupDetails.scheduledDate
                    ).toLocaleDateString()}{" "}
                  {quote.pickupDetails.scheduledTime &&
                    `at ${quote.pickupDetails.scheduledTime}`}
                </Typography>
              </Alert>
            )}

          {/* New Date Selection */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              New Pickup Date *
            </Typography>
            <TextField
              fullWidth
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              inputProps={{ min: minDate }}
            />
          </Box>

          {/* New Time Selection */}
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{ mb: 1.5, fontWeight: 600, fontSize: "0.875rem" }}
            >
              Preferred Time Slot *
            </FormLabel>
            <RadioGroup value={newTime} onChange={(e) => setNewTime(e.target.value)}>
              <Grid container spacing={1}>
                {timeSlots.map((slot) => (
                  <Grid item xs={6} key={slot}>
                    <FormControlLabel
                      value={slot}
                      control={<Radio size="small" />}
                      label={slot}
                    />
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </FormControl>

          {/* Reason Selection */}
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{ mb: 1.5, fontWeight: 600, fontSize: "0.875rem" }}
            >
              Reason for Rescheduling *
            </FormLabel>
            <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
              {reasons.map((reasonOption) => (
                <Box
                  key={reasonOption.value}
                  sx={{
                    mb: 1.5,
                    pb: 1.5,
                    borderBottom:
                      reasonOption.value !== reasons[reasons.length - 1].value
                        ? "1px solid"
                        : "none",
                    borderColor: "divider",
                  }}
                >
                  <FormControlLabel
                    value={reasonOption.value}
                    control={<Radio />}
                    label={
                      <Box>
                        <Typography variant="body2" fontWeight={500}>
                          {reasonOption.label}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          {reasonOption.description}
                        </Typography>
                      </Box>
                    }
                  />
                </Box>
              ))}
            </RadioGroup>
          </FormControl>

          {/* Additional Notes */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Additional Notes (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Any specific instructions or additional information..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </Box>

          {error && (
            <Alert severity="error">
              <Typography variant="body2">{error}</Typography>
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={loading} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleReschedule}
          disabled={loading || !newDate || !newTime || !reason}
          variant="contained"
        >
          {loading ? "Rescheduling..." : "Reschedule Pickup"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
