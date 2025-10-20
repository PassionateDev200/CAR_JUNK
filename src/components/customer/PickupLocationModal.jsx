/** route: src/components/customer/PickupLocationModal.jsx */
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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Grid,
} from "@mui/material";
import {
  LocationOn as LocationIcon,
  Phone as PhoneIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import axios from "axios";

export default function PickupLocationModal({ 
  open, 
  onClose, 
  onContinue, 
  onBack,
  initialData = {} 
}) {
  const [formData, setFormData] = useState({
    addressType: initialData.addressType || "residence",
    street: initialData.street || "",
    city: initialData.city || "",
    state: initialData.state || "",
    zipCode: initialData.zipCode || "",
    instructions: initialData.instructions || "",
    contactName: initialData.contactName || "",
    contactPhone: initialData.contactPhone || "",
  });
  
  const [error, setError] = useState("");
  const [addressVerifying, setAddressVerifying] = useState(false);
  const [addressVerified, setAddressVerified] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);

  const handleInputChange = async (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
    
    // Reset address verification when address changes
    if (["street", "city", "state", "zipCode"].includes(field)) {
      setAddressVerified(false);
    }
    
    // Auto-populate city and state from ZIP code
    if (field === "zipCode" && value.length === 5) {
      await fetchCityStateFromZip(value);
    }
  };

  const fetchCityStateFromZip = async (zipCode) => {
    setZipLoading(true);
    try {
      const response = await axios.get(`/api/zipcode?zip=${zipCode}`);
      if (response.data.city && response.data.state) {
        setFormData((prev) => ({
          ...prev,
          city: response.data.city,
          state: response.data.state,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch city/state from ZIP code:", err);
    } finally {
      setZipLoading(false);
    }
  };

  const verifyAddress = async () => {
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      setError("Please enter a complete address (Street, City, State, ZIP)");
      return;
    }

    setAddressVerifying(true);
    setError("");

    try {
      const fullAddress = `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}`;
      const response = await axios.post("/api/verify-address", {
        address: fullAddress,
      });

      if (response.data.verified) {
        setAddressVerified(true);
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

  const validateForm = () => {
    if (!formData.street || !formData.city || !formData.state || !formData.zipCode) {
      setError("Please enter a complete pickup address.");
      return false;
    }
    if (!formData.contactName || formData.contactName.trim().length < 2) {
      setError("Please enter a valid contact name.");
      return false;
    }
    if (!formData.contactPhone || formData.contactPhone.trim().length < 8) {
      setError("Please enter a valid phone number.");
      return false;
    }
    if (!addressVerified) {
      setError("Please verify your pickup address before continuing.");
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
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle>
        <Stack direction="row" spacing={1} alignItems="center">
          <LocationIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Pickup location
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

          {/* Address Type */}
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              What type of address is this?
            </Typography>
            <FormControl component="fieldset">
              <RadioGroup
                row
                value={formData.addressType}
                onChange={(e) => handleInputChange("addressType", e.target.value)}
              >
                <FormControlLabel
                  value="residence"
                  control={<Radio />}
                  label="Residence"
                />
                <FormControlLabel
                  value="business"
                  control={<Radio />}
                  label="Business"
                />
              </RadioGroup>
            </FormControl>
          </Box>

          {/* Street Address */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Street Address
            </Typography>
            <TextField
              fullWidth
              placeholder="Street Address"
              value={formData.street}
              onChange={(e) => handleInputChange("street", e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* City, State, ZIP */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                City
              </Typography>
              <TextField
                fullWidth
                placeholder="Portland"
                value={formData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                State
              </Typography>
              <TextField
                fullWidth
                placeholder="OR"
                value={formData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" fontWeight={500} gutterBottom>
                ZIP code
              </Typography>
              <TextField
                fullWidth
                placeholder="97205"
                value={formData.zipCode}
                onChange={(e) => handleInputChange("zipCode", e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon sx={{ color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                  endAdornment: zipLoading ? (
                    <InputAdornment position="end">
                      <CircularProgress size={16} />
                    </InputAdornment>
                  ) : null,
                }}
              />
            </Grid>
          </Grid>

          {/* Special Instructions */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Instructions (optional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Additional details to help us find your car, like a cross street, gate code, building number or apartment number."
              value={formData.instructions}
              onChange={(e) => handleInputChange("instructions", e.target.value)}
              inputProps={{ maxLength: 500 }}
            />
          </Box>

          {/* Contact Name */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Contact name
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              This is the primary name on your account and all future offers.
            </Typography>
            <TextField
              fullWidth
              placeholder="Contact name"
              value={formData.contactName}
              onChange={(e) => handleInputChange("contactName", e.target.value)}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationIcon sx={{ color: "text.secondary" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* Contact Phone */}
          <Box>
            <Typography variant="body2" fontWeight={500} gutterBottom>
              Contact phone number
            </Typography>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 1 }}>
              This phone number will be tied to your account and all future offers.
            </Typography>
            <TextField
              fullWidth
              placeholder="1231231233"
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

          {/* Verify Address Button */}
          <Button
            fullWidth
            variant={addressVerified ? "outlined" : "contained"}
            color={addressVerified ? "success" : "primary"}
            onClick={verifyAddress}
            disabled={
              addressVerifying ||
              !formData.street ||
              !formData.zipCode
            }
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
              sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
            >
              <CheckCircleIcon sx={{ fontSize: 14 }} />
              Address verified and ready for pickup
            </Typography>
          )}
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

