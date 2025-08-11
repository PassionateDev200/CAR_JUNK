// src/lib/quoteAccess.client.js

// Validate 6-character access token format
export function validateAccessToken(token) {
  if (!token || typeof token !== "string") return false;
  if (token.length !== 6) return false;
  const validTokenPattern = /^[A-Z0-9]{6}$/;
  return validTokenPattern.test(token);
}

export function validateQuoteId(quoteId) {
  if (!quoteId || typeof quoteId !== "string") return false;
  if (quoteId.length !== 6) return false;
  const validQuoteIdPattern = /^[A-Z0-9]{6}$/;
  return validQuoteIdPattern.test(quoteId);
}

export function normalizeToken(token) {
  if (!token || typeof token !== "string") return "";
  return token.trim().toUpperCase();
}

export function validateAndNormalizeAccessToken(token) {
  const normalizedToken = normalizeToken(token);
  return {
    isValid: validateAccessToken(normalizedToken),
    normalizedToken: normalizedToken,
    errors: getTokenValidationErrors(normalizedToken),
  };
}

export function getTokenValidationErrors(token) {
  const errors = [];
  if (!token || typeof token !== "string") {
    errors.push("Access token is required");
    return errors;
  }
  if (token.length === 0) {
    errors.push("Access token cannot be empty");
  } else if (token.length < 6) {
    errors.push(
      `Access token is too short (${token.length} characters, needs 6)`
    );
  } else if (token.length > 6) {
    errors.push(
      `Access token is too long (${token.length} characters, needs 6)`
    );
  }
  const invalidChars = token.match(/[^A-Z0-9]/g);
  if (invalidChars) {
    errors.push(
      `Invalid characters found: ${[...new Set(invalidChars)].join(
        ", "
      )}. Only letters A-Z and numbers 0-9 are allowed.`
    );
  }
  return errors;
}

export function sanitizeAccessToken(token) {
  if (!token || typeof token !== "string") return "";
  return token
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .substring(0, 6);
}

export const VALIDATION_CONSTANTS = {
  ACCESS_TOKEN_LENGTH: 6,
  QUOTE_ID_LENGTH: 6,
};
