/** route: src/utils/carQueryApi.js */

import axios from "axios";

// ===== MODIFIED: Use internal API routes instead of external APIs =====
const API_BASE_URL = "/api/vehicle-data";

// ===== MODIFIED: Updated to use proxy API routes =====
export async function getMakesByYear(year) {
  try {
    const response = await axios.get(`${API_BASE_URL}/makes?year=${year}`);
    return response.data.Makes || [];
  } catch (error) {
    console.error("Error fetching makes:", error);
    return [];
  }
}

// ===== MODIFIED: Updated to use proxy API routes =====
export async function getModelsByMakeYear(make, year) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/models?make=${make}&year=${year}`
    );
    return response.data.Models || [];
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
}

// ===== MODIFIED: Updated to use proxy API routes =====
export async function getTrimsByModel(make, model, year) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/trims?make=${make}&model=${model}&year=${year}`
    );
    return response.data.Trims || [];
  } catch (error) {
    console.error("Error fetching trims:", error);
    return [];
  }
}
