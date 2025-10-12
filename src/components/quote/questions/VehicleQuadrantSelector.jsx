/** route: src/components/quote/questions/VehicleQuadrantSelector.jsx */
"use client";

import { useState } from "react";
import { Box, Paper, Button, Typography, Stack, Chip, Alert } from "@mui/material";
import { CheckCircle } from "lucide-react";
import { questionTheme } from "@/theme/questionTheme";

export default function VehicleQuadrantSelector({
  title,
  onSelectionComplete,
  vehicleDetails,
  questionNumber,
  totalQuestions,
}) {
  const [selectedQuadrants, setSelectedQuadrants] = useState([]);

  const quadrants = [
    { id: "front_left", label: "Front Left", position: "top-0 left-0" },
    { id: "front_right", label: "Front Right", position: "top-0 right-0" },
    { id: "rear_left", label: "Rear Left", position: "bottom-0 left-0" },
    { id: "rear_right", label: "Rear Right", position: "bottom-0 right-0" },
  ];

  const toggleQuadrant = (quadrantId) => {
    setSelectedQuadrants((prev) =>
      prev.includes(quadrantId)
        ? prev.filter((id) => id !== quadrantId)
        : [...prev, quadrantId]
    );
  };

  const handleSubmit = () => {
    console.log(
      "VehicleQuadrantSelector == handleSubmit == selectedQuadrants ===>",
      selectedQuadrants
    );
    onSelectionComplete(selectedQuadrants);
  };

  const getVehicleDisplayName = () => {
    if (vehicleDetails.year && vehicleDetails.make && vehicleDetails.model) {
      return `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;
    }
    return vehicleDetails.make || "vehicle";
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "900px", mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: `1px solid ${questionTheme.colors.border.primary}`,
          bgcolor: questionTheme.colors.background.primary,
          boxShadow: questionTheme.shadows.card,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            pt: 5,
            px: 3,
            pb: 4,
            borderBottom: `1px solid ${questionTheme.colors.border.primary}`,
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontSize: questionTheme.typography.sizes.xl,
              fontWeight: questionTheme.typography.weights.semibold,
              color: questionTheme.colors.text.primary,
              lineHeight: 1.4,
              mb: 2,
            }}
          >
            {title}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              fontSize: questionTheme.typography.sizes.sm,
              color: questionTheme.colors.text.tertiary,
              fontWeight: questionTheme.typography.weights.medium,
              display: "block",
            }}
          >
            Question {questionNumber} of {totalQuestions}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              fontSize: questionTheme.typography.sizes.md,
              color: questionTheme.colors.text.secondary,
              mt: 2,
            }}
          >
            Select all areas that apply by clicking on the car diagram
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>
          <Stack spacing={4} alignItems="center">
            {/* Car Diagram */}
            <Paper
              elevation={0}
              sx={{
                position: "relative",
                width: "100%",
                maxWidth: "500px",
                height: "320px",
                background: "linear-gradient(to bottom, #f3f4f6, #e5e7eb)",
                borderRadius: 3,
                border: "2px solid #d1d5db",
                overflow: "hidden",
              }}
            >
              {/* Car Body */}
              <Box
                sx={{
                  position: "absolute",
                  inset: "16px",
                  background: "linear-gradient(to bottom, #93c5fd, #60a5fa)",
                  borderRadius: 3,
                  border: "2px solid #3b82f6",
                  boxShadow: "inset 0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {/* Windshield */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "64px",
                    height: "16px",
                    bgcolor: "#1f2937",
                    borderRadius: 0.5,
                  }}
                />

                {/* Tail Lights */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 8,
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "48px",
                    height: "12px",
                    bgcolor: "#ef4444",
                    borderRadius: 0.5,
                  }}
                />

                {/* Quadrant Selection Areas */}
                {quadrants.map((quadrant) => {
                  const isSelected = selectedQuadrants.includes(quadrant.id);
                  const positionStyles = {
                    "top-0 left-0": { top: 0, left: 0 },
                    "top-0 right-0": { top: 0, right: 0 },
                    "bottom-0 left-0": { bottom: 0, left: 0 },
                    "bottom-0 right-0": { bottom: 0, right: 0 },
                  };

                  return (
                    <Box
                      key={quadrant.id}
                      component="button"
                      onClick={() => toggleQuadrant(quadrant.id)}
                      sx={{
                        position: "absolute",
                        width: "50%",
                        height: "50%",
                        border: "2px solid white",
                        bgcolor: isSelected
                          ? "rgba(239, 68, 68, 0.8)"
                          : "transparent",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: isSelected
                            ? "rgba(239, 68, 68, 0.9)"
                            : "rgba(239, 68, 68, 0.3)",
                        },
                        ...positionStyles[quadrant.position],
                      }}
                      title={quadrant.label}
                    >
                      {isSelected && (
                        <Box
                          sx={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            width: 40,
                            height: 40,
                            bgcolor: "white",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                          }}
                        >
                          <CheckCircle size={24} color="#dc2626" />
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>

              {/* Car Labels */}
              <Typography
                sx={{
                  position: "absolute",
                  top: 4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "0.688rem",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                FRONT
              </Typography>
              <Typography
                sx={{
                  position: "absolute",
                  bottom: 4,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: "0.688rem",
                  fontWeight: 700,
                  color: "#374151",
                }}
              >
                REAR
              </Typography>
            </Paper>

            {/* Selection Summary */}
            {selectedQuadrants.length > 0 && (
              <Box sx={{ width: "100%" }}>
                <Typography
                  sx={{
                    fontSize: questionTheme.typography.sizes.md,
                    fontWeight: questionTheme.typography.weights.semibold,
                    color: questionTheme.colors.text.primary,
                    mb: 2,
                  }}
                >
                  Selected areas:
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {selectedQuadrants.map((id) => {
                    const quadrant = quadrants.find((q) => q.id === id);
                    return (
                      <Chip
                        key={id}
                        label={quadrant.label}
                        sx={{
                          bgcolor: "#fef2f2",
                          color: "#dc2626",
                          borderColor: "#fecaca",
                          fontWeight: 600,
                          fontSize: "0.813rem",
                          border: "1px solid",
                        }}
                      />
                    );
                  })}
                </Stack>
              </Box>
            )}

            {/* Instructions */}
            <Alert
              severity="info"
              sx={{
                width: "100%",
                borderRadius: 2,
                bgcolor: "#e3f0ff",
                border: "1px solid #b9d6f2",
                "& .MuiAlert-message": {
                  width: "100%",
                },
              }}
            >
              <Typography
                sx={{
                  fontSize: questionTheme.typography.sizes.md,
                  fontWeight: questionTheme.typography.weights.semibold,
                  color: "#0a66c2",
                  mb: 1,
                }}
              >
                📋 How to Select
              </Typography>
              <Box
                component="ul"
                sx={{
                  m: 0,
                  pl: 2,
                  fontSize: questionTheme.typography.sizes.sm,
                  color: "#0a66c2",
                  "& li": { mb: 0.5 },
                }}
              >
                <li>Click on any area of the car diagram</li>
                <li>Multiple areas can be selected</li>
                <li>Click again to deselect an area</li>
                <li>Red areas show your selections</li>
              </Box>
            </Alert>
          </Stack>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            px: 4,
            pb: 4,
            pt: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              minWidth: 200,
              bgcolor: questionTheme.colors.primary.main,
              color: "#ffffff",
              fontWeight: questionTheme.typography.weights.semibold,
              fontSize: questionTheme.typography.sizes.md,
              "&:hover": {
                bgcolor: questionTheme.colors.primary.hover,
              },
            }}
          >
            {selectedQuadrants.length > 0
              ? `Continue with ${selectedQuadrants.length} area${
                  selectedQuadrants.length !== 1 ? "s" : ""
                } selected`
              : "Continue (No areas affected)"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
