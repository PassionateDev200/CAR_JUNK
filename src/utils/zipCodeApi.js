/** route: src/utils/zipCodeApi.js */
// ===== MODIFIED: Use internal API route instead of external API =====

const API_BASE_URL = "/api/zipcode";

// ===== MODIFIED: Updated to use proxy API route =====
export async function validateZipCode(zipCode) {
  try {
    const response = await fetch(`${API_BASE_URL}?zip=${zipCode}`);

    if (!response.ok) {
      const errorData = await response.json();
      return {
        valid: false,
        error: errorData.error || "Failed to validate ZIP code",
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("ZIP code validation error:", error);
    return {
      valid: false,
      error: "Failed to validate ZIP code",
    };
  }
}

export function getRegionAdjustment(locationData) {
  if (!locationData || !locationData.valid) return null;

  // Define pricing adjustments based on regions (updated for junk car pricing)
  const regionAdjustments = {
    // High-cost areas (major cities) - slightly higher offers for junk cars
    CA: { amount: 50, reason: "California market" },
    NY: { amount: 50, reason: "New York market" },
    WA: { amount: 30, reason: "Washington market" },
    OR: { amount: 20, reason: "Oregon market" },

    // Medium-cost areas
    TX: { amount: 15, reason: "Texas market" },
    FL: { amount: 15, reason: "Florida market" },
    IL: { amount: 10, reason: "Illinois market" },

    // Rural areas - standard pricing (no adjustment)
  };

  // Metropolitan area adjustments (smaller amounts for junk cars)
  const metroAdjustments = {
    "Los Angeles": 40,
    "San Francisco": 50,
    Seattle: 35,
    Portland: 25,
    "New York": 45,
    Chicago: 20,
    Miami: 20,
    Houston: 15,
    Dallas: 15,
    Atlanta: 10,
  };

  let adjustment = { amount: 0, reason: "Standard market" };

  // Check state-level adjustment
  if (regionAdjustments[locationData.state]) {
    adjustment = regionAdjustments[locationData.state];
  }

  // Check city-level adjustment (overrides state if higher)
  if (metroAdjustments[locationData.city]) {
    const cityAdjustment = metroAdjustments[locationData.city];
    if (cityAdjustment > adjustment.amount) {
      adjustment = {
        amount: cityAdjustment,
        reason: `${locationData.city} metropolitan area`,
      };
    }
  }

  return adjustment.amount > 0
    ? {
        type: "location_premium",
        amount: adjustment.amount,
        reason: adjustment.reason,
      }
    : null;
}
