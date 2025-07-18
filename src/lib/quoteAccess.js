/** route: src/lib/quoteAccess.js */
import rateLimit from "express-rate-limit";

// Validate access token format
export function validateAccessToken(token) {
  // Check if token exists and has valid format
  if (!token || typeof token !== "string") {
    return false;
  }

  // Check length (should be 16 characters)
  if (token.length !== 16) {
    return false;
  }

  // Check if token contains only valid characters (alphanumeric)
  const validTokenPattern = /^[a-zA-Z0-9]{16}$/;
  return validTokenPattern.test(token);
}

// Rate limiting for customer actions
export const customerActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for quote access
export const quoteAccessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per windowMs
  message: {
    error: "Too many quote access requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Validate customer action permissions
export function validateActionPermissions(quote, action) {
  if (!quote || !action) {
    return { valid: false, error: "Invalid quote or action" };
  }

  switch (action) {
    case "cancel":
      if (!quote.canCustomerCancel()) {
        return {
          valid: false,
          error: "Quote cannot be cancelled in current status",
        };
      }
      break;

    case "reschedule":
      if (!quote.canCustomerReschedule()) {
        return {
          valid: false,
          error: "Quote cannot be rescheduled in current status",
        };
      }
      break;

    case "update":
      if (!["pending", "accepted", "pickup_scheduled"].includes(quote.status)) {
        return {
          valid: false,
          error: "Quote cannot be updated in current status",
        };
      }
      break;

    default:
      return { valid: false, error: "Invalid action type" };
  }

  return { valid: true };
}

// Input sanitization helpers
export function sanitizeInput(input) {
  if (typeof input !== "string") {
    return input;
  }

  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+=/gi, "") // Remove event handlers
    .trim();
}

// Validate cancellation reason
export function validateCancellationReason(reason) {
  const validReasons = [
    "changed_mind",
    "found_better_offer",
    "vehicle_sold_elsewhere",
    "family_decision",
    "financial_reasons",
    "timing_issues",
    "other",
  ];

  return validReasons.includes(reason);
}

// Validate reschedule reason
export function validateRescheduleReason(reason) {
  const validReasons = [
    "schedule_conflict",
    "weather_concerns",
    "location_change",
    "personal_emergency",
    "vehicle_accessibility",
    "other",
  ];

  return validReasons.includes(reason);
}
