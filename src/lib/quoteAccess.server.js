/**
 * Server-only Quote Access utilities
 * This file can safely import Node.js modules like 'express-rate-limit'
 * because it should **only** be used in API routes/middleware on the server.
 */

import rateLimit from "express-rate-limit";

// =====================
// Rate-limiting configs
// =====================

// Limit customer actions (cancel/reschedule/update) to prevent abuse
export const customerActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 actions per window
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit GET/manage quote requests
export const quoteAccessLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // limit each IP to 30 lookups per window
  message: {
    error: "Too many quote access requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limit token validation attempts
export const tokenValidationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // allow more since it's simple validation
  message: {
    error: "Too many token validation attempts, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// =====================
// Server-side validators
// =====================

// Validate customer action against current quote state
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

// Sanitize arbitrary input strings
export function sanitizeInput(input) {
  if (typeof input !== "string") return input;

  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .replace(/[\x00-\x1f\x7f]/g, "")
    .trim();
}

// Sanitize access token specifically
export function sanitizeAccessToken(token) {
  if (!token || typeof token !== "string") return "";
  return token
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .substring(0, 6);
}

// Validate cancellation reason against allowed set
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

// Validate reschedule reason against allowed set
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

// Validate and sanitize contact info updates server-side
export function validateContactUpdate(updates) {
  const errors = [];
  const sanitized = {};

  if (updates.name) {
    const name = sanitizeInput(updates.name);
    if (name.length < 2) {
      errors.push("Name must be at least 2 characters long");
    } else if (name.length > 100) {
      errors.push("Name must be less than 100 characters");
    } else {
      sanitized.name = name;
    }
  }

  if (updates.email) {
    const email = sanitizeInput(updates.email).toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("Invalid email format");
    } else {
      sanitized.email = email;
    }
  }

  if (updates.phone) {
    const phone = sanitizeInput(updates.phone).replace(/\D/g, "");
    if (phone.length < 10) {
      errors.push("Phone number must be at least 10 digits");
    } else if (phone.length > 15) {
      errors.push("Phone number must be less than 15 digits");
    } else {
      sanitized.phone = phone;
    }
  }

  if (updates.address) {
    const address = sanitizeInput(updates.address);
    if (address.length > 200) {
      errors.push("Address must be less than 200 characters");
    } else {
      sanitized.address = address;
    }
  }

  return { isValid: errors.length === 0, errors, sanitized };
}

// Validate pickup schedule details server-side
export function validatePickupSchedule(scheduleData) {
  const errors = [];

  if (!scheduleData.date) {
    errors.push("Pickup date is required");
  } else {
    const pickupDate = new Date(scheduleData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pickupDate < today) {
      errors.push("Pickup date cannot be in the past");
    }

    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    if (pickupDate > maxDate) {
      errors.push("Pickup date cannot be more than 30 days in the future");
    }
  }

  if (!scheduleData.time) {
    errors.push("Pickup time is required");
  }

  const validTimeSlots = ["morning", "afternoon", "evening", "flexible"];
  if (
    scheduleData.timeSlot &&
    !validTimeSlots.includes(scheduleData.timeSlot)
  ) {
    errors.push("Invalid time slot selected");
  }

  if (
    scheduleData.specialInstructions &&
    scheduleData.specialInstructions.length > 500
  ) {
    errors.push("Special instructions must be less than 500 characters");
  }

  return { isValid: errors.length === 0, errors };
}

// Simple check for suspicious payloads
export function detectSuspiciousActivity(input) {
  if (!input || typeof input !== "string") return false;

  const suspiciousPatterns = [
    /script/gi,
    /javascript/gi,
    /vbscript/gi,
    /onload/gi,
    /onerror/gi,
    /eval\(/gi,
    /document\./gi,
    /window\./gi,
    /<iframe/gi,
    /<object/gi,
    /<embed/gi,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(input));
}

// Central constants for validation/sanitization
export const VALIDATION_CONSTANTS = {
  ACCESS_TOKEN_LENGTH: 6,
  QUOTE_ID_LENGTH: 6,
  MAX_NAME_LENGTH: 100,
  MIN_NAME_LENGTH: 2,
  MAX_ADDRESS_LENGTH: 200,
  MAX_SPECIAL_INSTRUCTIONS_LENGTH: 500,
  MIN_PHONE_DIGITS: 10,
  MAX_PHONE_DIGITS: 15,
  MAX_PICKUP_DAYS_AHEAD: 30,
};
