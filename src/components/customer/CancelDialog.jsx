/** route: src/components/customer/CancelDialog.jsx */
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stack,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material";
import { cancelQuote } from "@/lib/quoteApi";
import { useVehicleDispatch, vehicleActions } from "@/contexts/VehicleContext";

export default function CancelDialog({
  open,
  onOpenChange,
  quote,
  onActionComplete,
  loading,
  setLoading,
}) {
  const dispatch = useVehicleDispatch();
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const reasons = [
    {
      value: "changed_mind",
      label: "Changed my mind",
      description: "I've decided not to sell at this time",
    },
    {
      value: "found_better_offer",
      label: "Found a better offer",
      description: "I received a higher offer elsewhere",
    },
    {
      value: "vehicle_sold_elsewhere",
      label: "Sold vehicle elsewhere",
      description: "I already sold the vehicle to someone else",
    },
    {
      value: "family_decision",
      label: "Family decision",
      description: "My family decided to keep the vehicle",
    },
    {
      value: "financial_reasons",
      label: "Financial reasons",
      description: "My financial situation has changed",
    },
    {
      value: "timing_issues",
      label: "Timing issues",
      description: "The timing doesn't work for me anymore",
    },
    {
      value: "other",
      label: "Other",
      description: "Please specify in the notes below",
    },
  ];

  const handleCancel = async () => {
    if (!reason) {
      setError("Please select a reason for cancellation");
      return;
    }

    if (reason === "other" && !note.trim()) {
      setError("Please provide details for 'Other' reason");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("CancelDialog: quote ===> ", quote);
      const result = await cancelQuote(quote.accessToken, reason, note);

      if (result.success) {
        // Reset all vehicle data and clear localStorage
        dispatch(vehicleActions.resetVehicleData());
        
        // Clear localStorage explicitly
        localStorage.removeItem("vehicleQuoteData");
        localStorage.removeItem("vehicleQuoteTimestamp");
        
        // Reset to first step
        dispatch(vehicleActions.setCurrentStep(1));
        dispatch(vehicleActions.setCurrentQuestion(0));
        
        // Scroll to top for better UX
        window.scrollTo({ top: 0, behavior: "smooth" });
        
        // Call the action complete handler
        onActionComplete(result.data.quote);
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to cancel quote. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason("");
      setNote("");
      setError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <CancelIcon color="error" />
          <Typography variant="h6" fontWeight={600}>
            Cancel Quote
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Warning Alert */}
          <Alert severity="error" icon={<WarningIcon />}>
            <AlertTitle sx={{ fontWeight: 600 }}>Warning</AlertTitle>
            Cancelling this quote cannot be undone. You'll need to start a new
            quote process if you change your mind.
          </Alert>

          {/* Reason Selection */}
          <FormControl component="fieldset">
            <FormLabel
              component="legend"
              sx={{ mb: 2, fontWeight: 600, fontSize: "1rem" }}
            >
              Why are you cancelling this quote?
            </FormLabel>
            <RadioGroup value={reason} onChange={(e) => setReason(e.target.value)}>
              {reasons.map((reasonOption) => (
                <Box
                  key={reasonOption.value}
                  sx={{
                    mb: 2,
                    pb: 2,
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
                        <Typography variant="body1" fontWeight={500}>
                          {reasonOption.label}
                        </Typography>
                        <Typography
                          variant="body2"
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
            <Typography variant="body1" fontWeight={600} gutterBottom>
              Additional Notes (Optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Any additional comments or feedback..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              variant="outlined"
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
          Keep Quote
        </Button>
        <Button
          onClick={handleCancel}
          disabled={loading || !reason}
          variant="contained"
          color="error"
        >
          {loading ? "Cancelling..." : "Cancel Quote"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
