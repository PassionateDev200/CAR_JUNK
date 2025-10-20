/** route: src/components/customer/TitleSpecificsModal.jsx */
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
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Warning as WarningIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
  "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
  "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
  "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
  "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
  "Wisconsin", "Wyoming"
];

const VEHICLE_COLORS = [
  "Black", "White", "Silver", "Gray", "Red", "Blue", "Brown", "Green",
  "Beige", "Orange", "Gold", "Yellow", "Purple", "Other"
];

export default function TitleSpecificsModal({ open, onClose, onContinue, initialData = {}, vin }) {
  const [formData, setFormData] = useState({
    nameOnTitle: initialData.nameOnTitle || "",
    titleVin: initialData.titleVin || vin || "",
    titleIssueState: initialData.titleIssueState || "",
    vehicleColor: initialData.vehicleColor || "",
  });
  
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.nameOnTitle || formData.nameOnTitle.trim().length < 2) {
      setError("Please enter a valid name on title.");
      return false;
    }
    if (!formData.titleVin || formData.titleVin.trim().length < 10) {
      setError("Please enter a valid VIN (at least 10 characters).");
      return false;
    }
    if (!formData.titleIssueState) {
      setError("Please select the title issue state.");
      return false;
    }
    if (!formData.vehicleColor) {
      setError("Please select the vehicle color.");
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
          <DescriptionIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Title specifics
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          {/* Info Alert */}
          <Alert severity="info" icon={<WarningIcon />}>
            Make sure the info you enter matches the car title
          </Alert>

          {error && (
            <Alert severity="error" icon={<WarningIcon />}>
              {error}
            </Alert>
          )}

          {/* Name on Title */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Name(s) on title
            </Typography>
            <TextField
              fullWidth
              placeholder="Name(s) on title"
              value={formData.nameOnTitle}
              onChange={(e) => handleInputChange("nameOnTitle", e.target.value)}
              required
            />
            <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: "block", cursor: "pointer" }}>
              How do I enter the name(s) correctly?
            </Typography>
          </Box>

          {/* VIN */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              VIN
            </Typography>
            <TextField
              fullWidth
              placeholder="JTDJT923885212019"
              value={formData.titleVin}
              onChange={(e) => handleInputChange("titleVin", e.target.value.toUpperCase())}
              required
              inputProps={{ maxLength: 17, style: { textTransform: 'uppercase' } }}
            />
            <Typography variant="caption" color="primary" sx={{ mt: 0.5, display: "block", cursor: "pointer" }}>
              What is a VIN and how do I find it?
            </Typography>
          </Box>

          {/* Title Issue State */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Title issue state
            </Typography>
            <TextField
              fullWidth
              select
              value={formData.titleIssueState}
              onChange={(e) => handleInputChange("titleIssueState", e.target.value)}
              placeholder="Title issue state"
              required
            >
              {US_STATES.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </TextField>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
              Use 'Oregon'
            </Typography>
          </Box>

          {/* Vehicle Color */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Vehicle color
            </Typography>
            <TextField
              fullWidth
              select
              value={formData.vehicleColor}
              onChange={(e) => handleInputChange("vehicleColor", e.target.value)}
              placeholder="Vehicle color"
              required
            >
              {VEHICLE_COLORS.map((color) => (
                <MenuItem key={color} value={color}>
                  {color}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={onClose}
          variant="outlined"
        >
          Cancel
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

