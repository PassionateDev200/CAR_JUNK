/** route:  src/components/customer/QuoteManager.jsx*/

"use client";

import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Typography,
  Stack,
  Divider,
  Alert,
  AlertTitle,
  Chip,
} from "@mui/material";
import {
  DirectionsCar as CarIcon,
  Event as CalendarIcon,
  Person as UserIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Block as BlockIcon,
} from "@mui/icons-material";

import CancelDialog from "./CancelDialog";
import RescheduleDialog from "./RescheduleDialog";
import ScheduleDialog from "./ScheduleDialog";
import UpdateInfoDialog from "./UpdateInfoDialog";
import ActionHistory from "./ActionHistory";

export default function QuoteManager({ quote, onQuoteUpdate }) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      pending: "warning",
      accepted: "success",
      pickup_scheduled: "success",
      customer_cancelled: "error",
      rescheduled: "info",
      expired: "default",
    };
    return colors[status] || "default";
  };

  const handleActionComplete = (updatedQuote) => {
    console.log("handleActionComplete ===> ", updatedQuote);
    onQuoteUpdate(updatedQuote);
    setActionLoading(false);
    setShowCancelDialog(false);
    setShowRescheduleDialog(false);
    setShowScheduleDialog(false);
    setShowUpdateDialog(false);
  };

  const canCancelQuote = () => {
    const nonCancellableStatuses = [
      "customer_cancelled",
      "cancelled",
      "expired",
      "completed",
    ];
    const isNotExpired = !isExpired;
    return !nonCancellableStatuses.includes(quote.status) && isNotExpired;
  };

  const canRescheduleQuote = () => {
    const reschedulableStatuses = [
      "accepted",
      "pickup_scheduled",
      "rescheduled",
    ];
    const isNotExpired = !isExpired;
    return reschedulableStatuses.includes(quote.status) && isNotExpired;
  };

  const canSchedulePickup = () => {
    const schedulableStatuses = ["accepted"];
    const isNotExpired = !isExpired;
    const hasNoScheduledPickup = !quote.pickupDetails?.scheduledDate;
    return (
      schedulableStatuses.includes(quote.status) &&
      isNotExpired &&
      hasNoScheduledPickup
    );
  };

  const isExpired = new Date() > new Date(quote.expiresAt);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Status Alerts */}
      {isExpired && (
        <Alert severity="error" icon={<CancelIcon />}>
          <AlertTitle sx={{ fontWeight: 600 }}>Quote Expired</AlertTitle>
          This quote has expired. Please get a new quote if you're still
          interested.
        </Alert>
      )}

      {quote.status === "customer_cancelled" && (
        <Alert severity="info" icon={<BlockIcon />}>
          <AlertTitle sx={{ fontWeight: 600 }}>Quote Cancelled</AlertTitle>
          This quote has been cancelled. You can get a new quote if you change
          your mind.
        </Alert>
      )}

      {/* Vehicle Information Card */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <CarIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Vehicle Information
            </Typography>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="caption" color="text.secondary" display="block">
                Vehicle
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {quote.vehicleName}
              </Typography>
            </Box>
            {quote.vin && (
              <Box>
                <Typography variant="caption" color="text.secondary" display="block">
                  VIN
                </Typography>
                <Typography
                  variant="body2"
                  fontWeight={500}
                  sx={{ fontFamily: "monospace", fontSize: "0.875rem" }}
                >
                  {quote.vin}
                </Typography>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Customer Information Card */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <UserIcon color="primary" />
              <Typography variant="h6" fontWeight={600}>
                Contact Information
              </Typography>
            </Stack>
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setShowUpdateDialog(true)}
              disabled={
                !["pending", "accepted", "pickup_scheduled"].includes(
                  quote.status
                )
              }
            >
              Update
            </Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <UserIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body1">{quote.customer.name}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <EmailIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body1">{quote.customer.email}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body1">{quote.customer.phone}</Typography>
            </Stack>
            {quote.customer.address && (
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                <Typography variant="body1">{quote.customer.address}</Typography>
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Pickup Details Card */}
      {quote.pickupDetails &&
        (quote.pickupDetails.scheduledDate ||
          quote.pickupDetails.scheduledTime) && (
          <Card>
            <CardContent sx={{ p: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <CalendarIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Pickup Details
                </Typography>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
                  gap: 2,
                }}
              >
                {quote.pickupDetails.scheduledDate && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Scheduled Date
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {new Date(
                        quote.pickupDetails.scheduledDate
                      ).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
                {quote.pickupDetails.scheduledTime && (
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Scheduled Time
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {quote.pickupDetails.scheduledTime}
                    </Typography>
                  </Box>
                )}
                {quote.pickupDetails.specialInstructions && (
                  <Box sx={{ gridColumn: { sm: "1 / -1" } }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Special Instructions
                    </Typography>
                    <Typography variant="body1" fontWeight={500}>
                      {quote.pickupDetails.specialInstructions}
                    </Typography>
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

      {/* Action Buttons Card */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Available Actions
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {/* Cancel Quote Button */}
            {canCancelQuote() && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<BlockIcon />}
                onClick={() => setShowCancelDialog(true)}
                disabled={actionLoading}
                sx={{ minWidth: { sm: 160 } }}
              >
                Cancel Quote
              </Button>
            )}

            {/* Schedule/Reschedule Pickup Button */}
            <Button
              variant="contained"
              startIcon={<CalendarIcon />}
              onClick={() => setShowScheduleDialog(true)}
              disabled={actionLoading}
              sx={{ minWidth: { sm: 180 } }}
            >
              {quote.pickupDetails?.scheduledDate
                ? "Reschedule Pickup"
                : "Schedule Pickup"}
            </Button>

            {/* No actions available message */}
            {!canCancelQuote() &&
              !canRescheduleQuote() &&
              !canSchedulePickup() && (
                <Alert severity="info" sx={{ flex: 1 }}>
                  No actions available for this quote in its current status.
                </Alert>
              )}
          </Stack>
        </CardContent>
      </Card>

      {/* Action History */}
      <ActionHistory actions={quote.customerActions.actionHistory} />

      {/* Action Dialogs */}
      <CancelDialog
        open={showCancelDialog}
        onOpenChange={setShowCancelDialog}
        quote={quote}
        onActionComplete={handleActionComplete}
        loading={actionLoading}
        setLoading={setActionLoading}
      />

      <ScheduleDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        quote={quote}
        onActionComplete={handleActionComplete}
        loading={actionLoading}
        setLoading={setActionLoading}
      />

      <RescheduleDialog
        open={showRescheduleDialog}
        onOpenChange={setShowRescheduleDialog}
        quote={quote}
        onActionComplete={handleActionComplete}
        loading={actionLoading}
        setLoading={setActionLoading}
      />

      <UpdateInfoDialog
        open={showUpdateDialog}
        onOpenChange={setShowUpdateDialog}
        quote={quote}
        onActionComplete={handleActionComplete}
        loading={actionLoading}
        setLoading={setActionLoading}
      />
    </Box>
  );
}
