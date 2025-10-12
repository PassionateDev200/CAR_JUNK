/**route: src/components/customer/UpdateInfoDialog.jsx */
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
} from "@mui/material";
import {
  Person as UserIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { updateContactInfo } from "@/lib/quoteApi";

export default function UpdateInfoDialog({
  open,
  onOpenChange,
  quote,
  onActionComplete,
  loading,
  setLoading,
}) {
  const [formData, setFormData] = useState({
    name: quote.customer.name || "",
    email: quote.customer.email || "",
    phone: quote.customer.phone || "",
    address: quote.customer.address || "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    // Validate required fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError("Name, email, and phone are required");
      return;
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    // Check if any changes were made
    const hasChanges = Object.keys(formData).some(
      (key) => formData[key] !== (quote.customer[key] || "")
    );

    if (!hasChanges) {
      setError("No changes were made to update");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await updateContactInfo(quote.accessToken, formData);

      if (result.success) {
        onActionComplete(result.data.quote);
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to update information. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: quote.customer.name || "",
        email: quote.customer.email || "",
        phone: quote.customer.phone || "",
        address: quote.customer.address || "",
      });
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
          <EditIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Update Contact Information
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Name Field */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Full Name *
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <UserIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Email Field */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Email Address *
            </Typography>
            <TextField
              fullWidth
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Phone Field */}
          <Box>
            <Typography variant="body2" fontWeight={600} gutterBottom>
              Phone Number *
            </Typography>
            <TextField
              fullWidth
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
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
        <Button onClick={handleUpdate} disabled={loading} variant="contained">
          {loading ? "Updating..." : "Update Information"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
