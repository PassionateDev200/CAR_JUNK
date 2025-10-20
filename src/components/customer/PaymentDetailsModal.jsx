/** route: src/components/customer/PaymentDetailsModal.jsx */
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
  Stack,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  AccountBalance as AccountBalanceIcon,
  Warning as WarningIcon,
  Person as PersonIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";

export default function PaymentDetailsModal({ 
  open, 
  onClose, 
  onSubmit, 
  onBack,
  initialData = {},
  isSubmitting = false
}) {
  const [formData, setFormData] = useState({
    payeeName: initialData.payeeName || "",
  });
  
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.payeeName || formData.payeeName.trim().length < 2) {
      setError("Please enter a valid payee name.");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit(formData);
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
          <AccountBalanceIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Payment details
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Info Alert */}
          <Alert severity="info" icon={<WarningIcon />}>
            Who would you like us to make the check out to? You? Someone else?
          </Alert>

          {error && (
            <Alert severity="error" icon={<WarningIcon />}>
              {error}
            </Alert>
          )}

          {/* Payee Name */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Payee's full name
            </Typography>
            <TextField
              fullWidth
              placeholder="Payee's full name"
              value={formData.payeeName}
              onChange={(e) => handleInputChange("payeeName", e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
              Use 'john zee'
            </Typography>
          </Box>

          {/* Payment Info */}
          <Alert severity="success" icon={<CheckCircleIcon />}>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Payment at Pickup
            </Typography>
            <Typography variant="body2">
              You'll receive payment when we pick up your vehicle. We accept cash or check.
            </Typography>
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onBack}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          disabled={isSubmitting}
        >
          Back
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={isSubmitting}
          startIcon={isSubmitting ? <CircularProgress size={16} /> : <CheckCircleIcon />}
        >
          {isSubmitting ? "Submitting..." : "Complete Scheduling"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

