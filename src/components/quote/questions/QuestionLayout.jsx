/** Reusable LinkedIn-style layout for question components */
"use client";

import { Box, Paper, Typography, Stack, Button } from "@mui/material";
import { questionTheme } from "@/theme/questionTheme";

export default function QuestionLayout({
  icon: Icon,
  title,
  description,
  questionNumber,
  totalQuestions,
  children,
  onPrevious,
  onNext,
  nextDisabled = false,
  nextLabel = "Next",
  showPrevious = true,
}) {
  return (
    <Box sx={{ width: "100%", maxWidth: "900px", mx: "auto" }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: questionTheme.borderRadius.md,
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
            bgcolor: questionTheme.colors.background.primary,
          }}
        >
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="center"
            sx={{ mb: 2.5 }}
          >
            {Icon && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  bgcolor: questionTheme.colors.primary.light,
                  color: questionTheme.colors.primary.main,
                }}
              >
                <Icon size={22} />
              </Box>
            )}
          </Stack>

          <Typography
            variant="h5"
            sx={{
              fontSize: questionTheme.typography.sizes.xl,
              fontWeight: questionTheme.typography.weights.semibold,
              color: questionTheme.colors.text.primary,
              lineHeight: 1.4,
              mb: 2,
              px: 2,
            }}
          >
            {title}
          </Typography>

          {description && (
            <Typography
              variant="body2"
              sx={{
                fontSize: questionTheme.typography.sizes.md,
                color: questionTheme.colors.text.secondary,
                lineHeight: 1.6,
                maxWidth: "600px",
                mx: "auto",
                mb: 2,
              }}
            >
              {description}
            </Typography>
          )}

          <Typography
            variant="caption"
            sx={{
              fontSize: questionTheme.typography.sizes.sm,
              color: questionTheme.colors.text.tertiary,
              fontWeight: questionTheme.typography.weights.medium,
              display: "block",
              mt: 1,
            }}
          >
            Question {questionNumber} of {totalQuestions}
          </Typography>
        </Box>

        {/* Content */}
        <Box sx={{ p: 4 }}>{children}</Box>

        {/* Footer with Navigation */}
        <Box
          sx={{
            px: 4,
            pb: 4,
            pt: 2,
            borderTop: `1px solid ${questionTheme.colors.border.primary}`,
            bgcolor: questionTheme.colors.background.secondary,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {showPrevious && onPrevious ? (
              <Button
                variant="outlined"
                onClick={onPrevious}
                sx={{
                  minWidth: 120,
                  borderColor: questionTheme.colors.border.primary,
                  color: questionTheme.colors.text.primary,
                  bgcolor: questionTheme.colors.background.primary,
                  "&:hover": {
                    bgcolor: questionTheme.colors.background.hover,
                    borderColor: questionTheme.colors.border.focus,
                  },
                }}
              >
                Previous
              </Button>
            ) : (
              <Box /> // Spacer
            )}

            <Button
              variant="contained"
              onClick={onNext}
              disabled={nextDisabled}
              sx={{
                minWidth: 140,
                bgcolor: questionTheme.colors.primary.main,
                color: "#ffffff",
                fontWeight: questionTheme.typography.weights.semibold,
                "&:hover": {
                  bgcolor: questionTheme.colors.primary.hover,
                },
                "&:disabled": {
                  bgcolor: questionTheme.colors.background.hover,
                  color: questionTheme.colors.text.tertiary,
                },
              }}
            >
              {nextLabel}
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}

