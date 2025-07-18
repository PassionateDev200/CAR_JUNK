/** route: src/lib/quoteApi.js */

import axios from "axios";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("API Request Error:", error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error("API Response Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Get quote by access token
export async function getQuoteByToken(accessToken) {
  try {
    const response = await api.get(`/api/quote/manage/${accessToken}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to fetch quote",
    };
  }
}

// Cancel quote
export async function cancelQuote(accessToken, reason, note = "") {
  try {
    const response = await api.post("/api/quote/manage/cancel", {
      accessToken,
      reason,
      note,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to cancel quote",
    };
  }
}

// Reschedule pickup
export async function reschedulePickup(
  accessToken,
  newDate,
  newTime,
  reason,
  note = ""
) {
  try {
    const response = await api.post("/api/quote/manage/reschedule", {
      accessToken,
      newDate,
      newTime,
      reason,
      note,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to reschedule pickup",
    };
  }
}

// Update contact information
export async function updateContactInfo(accessToken, updates) {
  try {
    const response = await api.post("/api/quote/manage/update", {
      accessToken,
      updates,
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.error || "Failed to update contact info",
    };
  }
}

export default api;
