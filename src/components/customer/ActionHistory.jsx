/** route: src/components/customer/ActionHistory.jsx */
"use client";

import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import {
  History as HistoryIcon,
  Person as UserIcon,
  AdminPanelSettings as ShieldIcon,
  Block as BanIcon,
  Refresh as RotateIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ClockIcon,
} from "@mui/icons-material";

export default function ActionHistory({ actions = [] }) {
  const getActionConfig = (action) => {
    const configs = {
      cancelled: {
        icon: <BanIcon sx={{ fontSize: 18 }} />,
        label: "Cancelled",
        color: "error",
      },
      rescheduled: {
        icon: <RotateIcon sx={{ fontSize: 18 }} />,
        label: "Rescheduled",
        color: "info",
      },
      modified: {
        icon: <EditIcon sx={{ fontSize: 18 }} />,
        label: "Modified",
        color: "warning",
      },
      accepted: {
        icon: <CheckCircleIcon sx={{ fontSize: 18 }} />,
        label: "Accepted",
        color: "success",
      },
      pickup_scheduled: {
        icon: <ClockIcon sx={{ fontSize: 18 }} />,
        label: "Pickup Scheduled",
        color: "secondary",
      },
    };

    return (
      configs[action] || {
        icon: <HistoryIcon sx={{ fontSize: 18 }} />,
        label: action,
        color: "default",
      }
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <HistoryIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Action History
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ textAlign: "center", py: 4 }}>
            <HistoryIcon
              sx={{ fontSize: 64, color: "action.disabled", mb: 2 }}
            />
            <Typography color="text.secondary">
              No actions recorded yet
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  // Sort actions by timestamp (most recent first)
  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <Card>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <HistoryIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Action History
          </Typography>
        </Stack>
        <Divider sx={{ mb: 3 }} />
        
        <Stack spacing={3}>
          {sortedActions.map((action, index) => {
            const config = getActionConfig(action.action);
            
            return (
              <Box key={index}>
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  {/* Action Icon */}
                  <Box
                    sx={{
                      mt: 0.5,
                      color: `${config.color}.main`,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {config.icon}
                  </Box>

                  {/* Action Details */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Action Header */}
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                      mb={1}
                    >
                      <Chip
                        label={config.label}
                        color={config.color}
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(action.timestamp)}
                      </Typography>
                      {action.customerInitiated ? (
                        <Chip
                          icon={<UserIcon sx={{ fontSize: 14 }} />}
                          label="You"
                          variant="outlined"
                          size="small"
                          sx={{ height: 24, fontSize: "0.75rem" }}
                        />
                      ) : (
                        <Chip
                          icon={<ShieldIcon sx={{ fontSize: 14 }} />}
                          label="Admin"
                          variant="outlined"
                          size="small"
                          sx={{ height: 24, fontSize: "0.75rem" }}
                        />
                      )}
                    </Stack>

                    {/* Reason */}
                    {action.reason && (
                      <Typography
                        variant="body2"
                        color="text.primary"
                        sx={{ mb: 0.5 }}
                      >
                        <strong>Reason:</strong>{" "}
                        {action.reason.replace(/_/g, " ")}
                      </Typography>
                    )}

                    {/* Note */}
                    {action.note && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        <strong>Note:</strong> {action.note}
                      </Typography>
                    )}

                    {/* Details */}
                    {action.details && typeof action.details === "object" && (
                      <Box sx={{ mt: 1 }}>
                        {/* Reschedule Details */}
                        {action.action === "rescheduled" &&
                          action.details.originalDate && (
                            <Typography variant="body2" color="text.secondary">
                              <strong>Original:</strong>{" "}
                              {new Date(
                                action.details.originalDate
                              ).toLocaleDateString()}{" "}
                              at {action.details.originalTime}
                              <br />
                              <strong>New:</strong>{" "}
                              {new Date(
                                action.details.newDate
                              ).toLocaleDateString()}{" "}
                              at {action.details.newTime}
                            </Typography>
                          )}
                        
                        {/* Modification Details */}
                        {action.action === "modified" && (
                          <Typography variant="body2" color="text.secondary">
                            <strong>Updated:</strong>{" "}
                            {Object.keys(action.details).join(", ")}
                          </Typography>
                        )}
                      </Box>
                    )}
                  </Box>
                </Stack>

                {/* Divider between actions */}
                {index < sortedActions.length - 1 && <Divider sx={{ mt: 3 }} />}
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}
