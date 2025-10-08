/** route: src/contexts/VehicleContext.jsx */

"use client";

import { createContext, useContext, useReducer, useEffect, useState, useRef } from "react";
import axios from "@/lib/axios";

// Initial state
const initialState = {
  // Basic vehicle information
  vehicleDetails: {
    year: "",
    make: "",
    model: "",
    trim: "",
  },
  vin: "",
  zipCode: "",
  locationData: null,

  // Condition assessment answers
  conditionAnswers: {
    zipcode: null,
    ownership: null,
    title: null,
    wheels_tires: null,
    battery: null,
    key: null,
    drivability: null,
    engine_transmission: null,
    mileage: null,
    exterior_damage: null,
    missing_parts: null,
    mirrors_glass_lights: null,
    catalytic_converter: null,
    airbags: null,
    interior: null,
    flood_fire: null,
    // Sub-question answers
    wheels_tires_location: [],
    exterior_damage_location: [],
    missing_parts_location: [],
    mirrors_glass_lights_location: [],
  },

  // Individual question pricing - NEW STRUCTURE
  questionPricing: {
    title: 0,
    wheels_tires: 0,
    wheels_tires_damage_areas: 0,
    battery: 0,
    key: 0,
    drivability: 0,
    engine_transmission: 0,
    mileage: 0,
    exterior_damage: 0,
    missing_parts: 0,
    mirrors_glass_lights: 0,
    catalytic_converter: 0,
    airbags: 0,
    interior: 0,
    flood_fire: 0,
  },

  // Pricing information
  pricing: {
    basePrice: 0,
    currentPrice: 0,
    finalPrice: 0,
  },

  // Current step tracking
  currentStep: 1,
  currentQuestionIndex: 0,
  completedSteps: [],

  // Seller information
  sellerInfo: {
    name: "",
    email: "",
    phone: "",
    address: "",
  },

  // Offer information
  quoteId: null,
  offerStatus: null,
  submissionStatus: {
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  },
};

// Action types
const ACTIONS = {
  SET_VEHICLE_DETAILS: "SET_VEHICLE_DETAILS",
  SET_VIN: "SET_VIN",
  SET_CONDITION_ANSWER: "SET_CONDITION_ANSWER",
  SET_PRICING: "SET_PRICING",
  SET_QUESTION_PRICING: "SET_QUESTION_PRICING", // NEW ACTION
  SET_CURRENT_STEP: "SET_CURRENT_STEP",
  SET_CURRENT_QUESTION: "SET_CURRENT_QUESTION",
  MARK_STEP_COMPLETED: "MARK_STEP_COMPLETED",
  SET_SELLER_INFO: "SET_SELLER_INFO",
  SET_SUBMISSION_STATUS: "SET_SUBMISSION_STATUS",
  RESET_VEHICLE_DATA: "RESET_VEHICLE_DATA",
  RESET_WITH_OPTIONS: "RESET_WITH_OPTIONS", // FIXED: Added missing action
  LOAD_SAVED_DATA: "LOAD_SAVED_DATA",
};

// Helper function to calculate total price
function calculateTotalPrice(basePrice, questionPricing) {
  const adjustmentTotal = Object.values(questionPricing).reduce(
    (sum, value) => sum + value,
    0
  );
  return Math.max(basePrice + adjustmentTotal, 300); // Minimum $300
}

// Reducer function
function vehicleReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_VEHICLE_DETAILS:
      return {
        ...state,
        vehicleDetails: { ...state.vehicleDetails, ...action.payload },
      };

    case ACTIONS.SET_VIN:
      return {
        ...state,
        vin: action.payload,
      };

    case ACTIONS.SET_CONDITION_ANSWER:
      console.log(
        "VehicleContext = SET_CONDITION_ANSWER = action.payload ==> ",
        action.payload
      );
      return {
        ...state,
        conditionAnswers: {
          ...state.conditionAnswers,
          [action.payload.questionId]: action.payload.answer,
        },
      };

    case ACTIONS.SET_PRICING:
      const updatedPricing = { ...state.pricing, ...action.payload };
      // Recalculate current price when base price changes
      if (action.payload.basePrice !== undefined) {
        updatedPricing.currentPrice = calculateTotalPrice(
          action.payload.basePrice,
          state.questionPricing
        );
      }
      return {
        ...state,
        pricing: updatedPricing,
      };

    case ACTIONS.SET_QUESTION_PRICING:
      const { questionId, amount } = action.payload;

      console.log(
        "VehicleContext = SET_QUESTION_PRICING = action.payload ==> ",
        action.payload
      );

      const newQuestionPricing = {
        ...state.questionPricing,
        [questionId]: amount,
      };
      console.log(
        "VehicleContext == newQuestionPricing ==> ",
        newQuestionPricing
      );
      return {
        ...state,
        questionPricing: newQuestionPricing,
        pricing: {
          ...state.pricing,
          currentPrice: calculateTotalPrice(
            state.pricing.basePrice,
            newQuestionPricing
          ),
        },
      };

    case ACTIONS.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload,
      };

    case ACTIONS.SET_CURRENT_QUESTION:
      return {
        ...state,
        currentQuestionIndex: action.payload,
      };

    case ACTIONS.MARK_STEP_COMPLETED:
      const completedSteps = [...state.completedSteps];
      if (!completedSteps.includes(action.payload)) {
        completedSteps.push(action.payload);
      }
      return {
        ...state,
        completedSteps,
      };

    case ACTIONS.SET_SELLER_INFO:
      return {
        ...state,
        sellerInfo: { ...state.sellerInfo, ...action.payload },
      };

    case ACTIONS.SET_SUBMISSION_STATUS:
      return {
        ...state,
        submissionStatus: { ...state.submissionStatus, ...action.payload },
      };

    case ACTIONS.RESET_VEHICLE_DATA:
      // Clear localStorage when resetting
      if (typeof window !== "undefined") {
        localStorage.removeItem("vehicleQuoteData");
        localStorage.removeItem("vehicleQuoteTimestamp");
      }
      return {
        ...initialState,
      };

    case ACTIONS.RESET_WITH_OPTIONS:
      const options = action.payload || {};
      const resetState = { ...initialState };

      // Allow selective reset based on options
      if (options.keepVehicleDetails) {
        resetState.vehicleDetails = state.vehicleDetails;
      }
      if (options.keepSellerInfo) {
        resetState.sellerInfo = state.sellerInfo;
      }

      // Clear localStorage when resetting
      if (typeof window !== "undefined") {
        localStorage.removeItem("vehicleQuoteData");
        localStorage.removeItem("vehicleQuoteTimestamp");
      }

      return resetState;

    case ACTIONS.LOAD_SAVED_DATA:
      // Ensure questionPricing exists in loaded data
      const loadedData = action.payload;
      if (!loadedData.questionPricing) {
        loadedData.questionPricing = initialState.questionPricing;
      }
      return {
        ...state,
        ...loadedData,
      };

    default:
      return state;
  }
}

// Create contexts
const VehicleContext = createContext();
const VehicleDispatchContext = createContext();

// Provider component
export function VehicleProvider({ children }) {
  const [state, dispatch] = useReducer(vehicleReducer, initialState);
  const [isResetting, setIsResetting] = useState(false);
  const lastSaveTime = useRef(0);

  // Bootstrap session: fetch /api/auth/me to restore sellerInfo on refresh
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const resp = await axios.get("/api/auth/me");
        const data = resp.data;
        if (isMounted && data?.authenticated && data.user?.email) {
          dispatch(
            vehicleActions.setSellerInfo({
              name: state.sellerInfo.name || "",
              email: data.user.email,
              phone: state.sellerInfo.phone || "",
              address: state.sellerInfo.address || "",
            })
          );
        }
      } catch {}
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  // Load saved data from localStorage on mount and check for expiration
  useEffect(() => {
    const savedData = localStorage.getItem("vehicleQuoteData");
    const savedTimestamp = localStorage.getItem("vehicleQuoteTimestamp");
    
    if (savedData && savedTimestamp) {
      try {
        const parsedData = JSON.parse(savedData);
        const timestamp = parseInt(savedTimestamp);
        const now = Date.now();
        const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
        
        // Check if data is older than 30 minutes
        if (now - timestamp > thirtyMinutes) {
          console.log("Quote data expired (older than 30 minutes), clearing localStorage");
          localStorage.removeItem("vehicleQuoteData");
          localStorage.removeItem("vehicleQuoteTimestamp");
          return; // Don't load expired data
        }
        
        dispatch({ type: ACTIONS.LOAD_SAVED_DATA, payload: parsedData });
      } catch (error) {
        console.error("Error loading saved vehicle data:", error);
        // Clear corrupted data
        localStorage.removeItem("vehicleQuoteData");
        localStorage.removeItem("vehicleQuoteTimestamp");
      }
    }
  }, []);

  // Save data to localStorage whenever state changes (debounced)
  // Skip saving if we're in the middle of a reset to prevent infinite loops
  useEffect(() => {
    if (isResetting) return;
    
    const now = Date.now();
    // Prevent saving too frequently (at least 1 second between saves)
    if (now - lastSaveTime.current < 1000) return;
    
    const timeoutId = setTimeout(() => {
      try {
      localStorage.setItem("vehicleQuoteData", JSON.stringify(state));
        lastSaveTime.current = Date.now();
        
        // Save timestamp only if it doesn't exist (first time saving)
        if (!localStorage.getItem("vehicleQuoteTimestamp")) {
          localStorage.setItem("vehicleQuoteTimestamp", Date.now().toString());
        }
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [state, isResetting]);

  // Periodic cleanup check every 5 minutes
  useEffect(() => {
    let cleanupInterval;
    
    try {
      cleanupInterval = setInterval(() => {
        try {
          const savedTimestamp = localStorage.getItem("vehicleQuoteTimestamp");
          if (savedTimestamp && !isResetting) {
            const timestamp = parseInt(savedTimestamp);
            const now = Date.now();
            const thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
            
            // Check if data is older than 30 minutes
            if (now - timestamp > thirtyMinutes) {
              console.log("Periodic cleanup: Quote data expired, clearing localStorage");
              setIsResetting(true);
              localStorage.removeItem("vehicleQuoteData");
              localStorage.removeItem("vehicleQuoteTimestamp");
              // Reset the state to initial state
              dispatch({ type: ACTIONS.RESET_VEHICLE_DATA });
              // Reset the flag after a short delay
              setTimeout(() => setIsResetting(false), 100);
            }
          }
        } catch (error) {
          console.error("Error in periodic cleanup:", error);
        }
      }, 5 * 60 * 1000); // Check every 5 minutes
    } catch (error) {
      console.error("Error setting up cleanup interval:", error);
    }

    return () => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
      }
    };
  }, [dispatch, isResetting]);

  return (
    <VehicleContext.Provider value={state}>
      <VehicleDispatchContext.Provider value={dispatch}>
        {children}
      </VehicleDispatchContext.Provider>
    </VehicleContext.Provider>
  );
}

// Custom hooks
export function useVehicle() {
  const context = useContext(VehicleContext);
  if (context === undefined) {
    throw new Error("useVehicle must be used within a VehicleProvider");
  }
  return context;
}

export function useVehicleDispatch() {
  const context = useContext(VehicleDispatchContext);
  if (context === undefined) {
    throw new Error("useVehicleDispatch must be used within a VehicleProvider");
  }
  return context;
}

// Action creators (helper functions)
export const vehicleActions = {
  setVehicleDetails: (details) => ({
    type: ACTIONS.SET_VEHICLE_DETAILS,
    payload: details,
  }),

  setVin: (vin) => ({
    type: ACTIONS.SET_VIN,
    payload: vin,
  }),

  setConditionAnswer: (questionId, answer) => ({
    type: ACTIONS.SET_CONDITION_ANSWER,
    payload: { questionId, answer },
  }),

  setPricing: (pricing) => ({
    type: ACTIONS.SET_PRICING,
    payload: pricing,
  }),

  // NEW ACTION CREATOR
  setQuestionPricing: (questionId, amount) => ({
    type: ACTIONS.SET_QUESTION_PRICING,
    payload: { questionId, amount },
  }),

  setCurrentStep: (step) => ({
    type: ACTIONS.SET_CURRENT_STEP,
    payload: step,
  }),

  setCurrentQuestion: (index) => ({
    type: ACTIONS.SET_CURRENT_QUESTION,
    payload: index,
  }),

  markStepCompleted: (step) => ({
    type: ACTIONS.MARK_STEP_COMPLETED,
    payload: step,
  }),

  setSellerInfo: (info) => ({
    type: ACTIONS.SET_SELLER_INFO,
    payload: info,
  }),

  setSubmissionStatus: (status) => ({
    type: ACTIONS.SET_SUBMISSION_STATUS,
    payload: status,
  }),

  resetVehicleData: () => ({
    type: ACTIONS.RESET_VEHICLE_DATA,
  }),

  // Enhanced reset with options
  resetWithOptions: (options = {}) => ({
    type: ACTIONS.RESET_WITH_OPTIONS,
    payload: options,
  }),
};
