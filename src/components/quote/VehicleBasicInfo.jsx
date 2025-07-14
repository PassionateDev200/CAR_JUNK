/** route: src/components/quote/VehicleBasicInfo.jsx */
"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sparkles,
  Car,
  Zap,
  Shield,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import ModernSearchableDropdown from "./ModernSearchableDropdown";
import { decodeVIN } from "@/lib/vinDecoder";
import {
  getMakesByYear,
  getModelsByMakeYear,
  getTrimsByModel,
} from "@/utils/carQueryApi";
import {
  useVehicle,
  useVehicleDispatch,
  vehicleActions,
} from "@/contexts/VehicleContext";

const vehicleData = {
  years: Array.from({ length: 85 }, (_, i) => 2025 - i),
};

export default function VehicleBasicInfo({ onComplete, onPricingUpdate }) {
  // Get state and dispatch from context
  const vehicleState = useVehicle();
  const dispatch = useVehicleDispatch();

  // Get current data from context
  const { vehicleDetails, vin } = vehicleState;

  // Local state for form handling
  const [isVinMode, setIsVinMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dynamic data states
  const [availableMakes, setAvailableMakes] = useState([]);
  const [availableModels, setAvailableModels] = useState([]);
  const [availableTrims, setAvailableTrims] = useState([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [loadingTrims, setLoadingTrims] = useState(false);

  // VIN decode bypass ref
  const vinDecodeInProgress = useRef({
    year: false,
    make: false,
    model: false,
  });

  // Load makes when year changes
  useEffect(() => {
    if (vinDecodeInProgress.current.year) {
      vinDecodeInProgress.current.year = false;
      return;
    }
    if (vehicleDetails.year) {
      loadMakes(vehicleDetails.year);
      dispatch(
        vehicleActions.setVehicleDetails({
          ...vehicleDetails,
          make: "",
          model: "",
          trim: "",
        })
      );
      setAvailableModels([]);
      setAvailableTrims([]);
    }
  }, [vehicleDetails.year]);

  // Load models when make changes
  useEffect(() => {
    if (vinDecodeInProgress.current.make) {
      vinDecodeInProgress.current.make = false;
      return;
    }
    if (vehicleDetails.year && vehicleDetails.make) {
      loadModels(vehicleDetails.make, vehicleDetails.year);
      dispatch(
        vehicleActions.setVehicleDetails({
          ...vehicleDetails,
          model: "",
          trim: "",
        })
      );
      setAvailableTrims([]);
    }
  }, [vehicleDetails.make, vehicleDetails.year]);

  // Load trims when model changes
  useEffect(() => {
    if (vinDecodeInProgress.current.model) {
      vinDecodeInProgress.current.model = false;
      return;
    }
    if (vehicleDetails.year && vehicleDetails.make && vehicleDetails.model) {
      loadTrims(vehicleDetails.make, vehicleDetails.model, vehicleDetails.year);
      dispatch(
        vehicleActions.setVehicleDetails({
          ...vehicleDetails,
          trim: "",
        })
      );
    }
  }, [vehicleDetails.model, vehicleDetails.make, vehicleDetails.year]);

  const loadMakes = async (year) => {
    setLoadingMakes(true);
    try {
      const makes = await getMakesByYear(year);
      setAvailableMakes(makes.map((make) => make.make_display));
    } catch (error) {
      console.error("Error loading makes:", error);
      setError("Failed to load vehicle makes");
    } finally {
      setLoadingMakes(false);
    }
  };

  const loadModels = async (make, year) => {
    setLoadingModels(true);
    try {
      const models = await getModelsByMakeYear(make, year);
      setAvailableModels(models.map((model) => model.model_name));
    } catch (error) {
      console.error("Error loading models:", error);
      setError("Failed to load vehicle models");
    } finally {
      setLoadingModels(false);
    }
  };

  const loadTrims = async (make, model, year) => {
    setLoadingTrims(true);
    try {
      const trims = await getTrimsByModel(make, model, year);
      setAvailableTrims(trims.map((trim) => trim.model_trim));
    } catch (error) {
      console.error("Error loading trims:", error);
    } finally {
      setLoadingTrims(false);
    }
  };

  const handleVehicleDetailChange = (field, value) => {
    dispatch(
      vehicleActions.setVehicleDetails({
        ...vehicleDetails,
        [field]: value,
      })
    );
    setError("");
  };

  const handleVinChange = (value) => {
    dispatch(vehicleActions.setVin(value.toUpperCase()));
    setError("");
  };

  const handleVinDecode = async () => {
    if (!vin || vin.length !== 17) {
      setError("Please enter a valid 17-character VIN");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/decode-vin?vin=${vin}`);
      const result = await response.json();

      console.log("VIN decode result:", result);

      if (result.success) {
        // Set all flags before updating state
        vinDecodeInProgress.current = {
          year: true,
          make: true,
          model: true,
        };

        const decodedDetails = {
          year: result.year?.toString() || "",
          make: result.make || "",
          model: result.model || "",
          trim: result.trim || "",
        };

        dispatch(vehicleActions.setVehicleDetails(decodedDetails));

        // Show success message with source info
        const sourceMessage = result.source ? ` (via ${result.source})` : "";
        setError(""); // Clear any previous errors

        // If it's partial data, show a warning but proceed
        if (result.isPartial) {
          setError(
            `Partial VIN decode${sourceMessage}. Please verify the details below.`
          );
        }

        // Calculate base price and update pricing
        const basePrice = calculateBasePrice(decodedDetails);
        onPricingUpdate([{ type: "base_price", amount: basePrice }]);

        // Complete the step
        onComplete({
          vehicleDetails: decodedDetails,
          vin: vin,
        });
      } else {
        // Handle specific error types
        handleVinDecodeError(result);
      }
    } catch (error) {
      console.error("VIN decode fetch error:", error);
      setError(
        "Network error. Please check your connection and try again, or use manual entry."
      );
    } finally {
      setLoading(false);
    }
  };

  // New function to handle VIN decode errors
  const handleVinDecodeError = (result) => {
    const { errorType, error, suggestions, vin: failedVin } = result;

    switch (errorType) {
      case "DECODE_FAILED":
        setError(
          <div className="space-y-2">
            <p className="font-medium text-red-800">
              Unable to decode VIN: {failedVin}
            </p>
            <p className="text-sm text-red-700">This could be because:</p>
            <ul className="text-xs text-red-600 list-disc list-inside space-y-1">
              {suggestions?.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
            <p className="text-sm text-red-700 mt-2">
              <strong>Solution:</strong> Please use manual entry below to
              continue.
            </p>
          </div>
        );
        break;

      case "INCOMPLETE_DATA":
        setError(
          "VIN decoded but some vehicle details are missing. Please verify information manually."
        );
        break;

      case "SERVICE_ERROR":
        setError(
          "VIN decoding service is temporarily unavailable. Please try manual entry or try again later."
        );
        break;

      default:
        setError(error || "Failed to decode VIN. Please try manual entry.");
    }
  };

  const handleManualEntry = () => {
    if (!vehicleDetails.year || !vehicleDetails.make || !vehicleDetails.model) {
      setError("Please fill in all required fields");
      return;
    }

    // Calculate base price and update pricing
    const basePrice = calculateBasePrice(vehicleDetails);
    onPricingUpdate([{ type: "base_price", amount: basePrice }]);

    onComplete({ vehicleDetails: vehicleDetails, vin: vin });
  };

  // Calculate base price for junk cars (realistic pricing)
  const calculateBasePrice = (vehicleData) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - parseInt(vehicleData.year);

    // Base pricing for junk cars: $400-$600 range
    let basePrice = 600; // Starting base for newer cars

    // Age-based pricing (most cars are pre-2020)
    if (age >= 20) {
      basePrice = 400; // Very old cars: $400
    } else if (age >= 10) {
      basePrice = 500; // 10-20 years old: $500
    } else if (age >= 5) {
      basePrice = 600; // 5-10 years old: $600
    } else {
      basePrice = 800; // Less than 5 years: $800 (rare for junk cars)
    }

    // Premium makes adjustment (smaller for junk cars)
    const premiumMakes = [
      "BMW",
      "MERCEDES",
      "AUDI",
      "LEXUS",
      "ACURA",
      "INFINITI",
    ];
    if (premiumMakes.includes(vehicleData.make?.toUpperCase())) {
      basePrice += 200; // Only $200 premium for luxury brands in junk condition
    }

    // High-demand makes get slight boost
    const popularMakes = ["TOYOTA", "HONDA", "FORD", "CHEVROLET", "NISSAN"];
    if (popularMakes.includes(vehicleData.make?.toUpperCase())) {
      basePrice += 100; // Popular brands hold value better
    }

    // Truck/SUV premium (parts are more valuable)
    const truckSuvKeywords = [
      "TRUCK",
      "SUV",
      "PICKUP",
      "F-150",
      "SILVERADO",
      "RAM",
      "TAHOE",
      "SUBURBAN",
    ];
    if (
      truckSuvKeywords.some(
        (keyword) =>
          vehicleData.model?.toUpperCase().includes(keyword) ||
          vehicleData.trim?.toUpperCase().includes(keyword)
      )
    ) {
      basePrice += 150; // Trucks/SUVs worth more for parts
    }

    return Math.max(basePrice, 300); // Minimum $300 (even for worst condition)
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-8">
        {/* ORIGINAL TOGGLE BUTTONS - EXACT STYLING */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setIsVinMode(false)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                !isVinMode
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Sparkles className="w-4 h-4 inline mr-2" />
              MAKE & MODEL
            </button>
            <button
              onClick={() => setIsVinMode(true)}
              className={`px-6 py-3 rounded-lg text-sm font-medium transition-colors ${
                isVinMode
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Zap className="w-4 h-4 inline mr-2" />
              PLATE OR VIN
            </button>
          </div>
        </div>

        {!isVinMode ? (
          <div className="space-y-6">
            {/* ORIGINAL HEADER STYLING */}
            <div className="text-center mb-8">
              <Car className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Select your vehicle details for an accurate quote
              </h3>
              <p className="text-gray-600">
                Choose your vehicle's year, make, and model to get started
              </p>
            </div>

            {/* ORIGINAL DROPDOWN GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ModernSearchableDropdown
                value={vehicleDetails.year}
                onChange={(value) => handleVehicleDetailChange("year", value)}
                options={vehicleData.years}
                placeholder="Select year"
                label="Year"
              />

              <ModernSearchableDropdown
                value={vehicleDetails.make}
                onChange={(value) => handleVehicleDetailChange("make", value)}
                options={availableMakes}
                placeholder="Select make"
                label="Make"
                disabled={!vehicleDetails.year}
                loading={loadingMakes}
              />

              <ModernSearchableDropdown
                value={vehicleDetails.model}
                onChange={(value) => handleVehicleDetailChange("model", value)}
                options={availableModels}
                placeholder="Select model"
                label="Model"
                disabled={!vehicleDetails.make}
                loading={loadingModels}
              />

              <ModernSearchableDropdown
                value={vehicleDetails.trim}
                onChange={(value) => handleVehicleDetailChange("trim", value)}
                options={availableTrims}
                placeholder="Select trim (optional)"
                label="Trim (Optional)"
                disabled={!vehicleDetails.model}
                loading={loadingTrims}
              />
            </div>

            {/* ORIGINAL VEHICLE CONFIRMATION CARD */}
            {vehicleDetails.year &&
              vehicleDetails.make &&
              vehicleDetails.model && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h4 className="font-bold text-green-900">
                      Perfect! Vehicle identified
                    </h4>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Year</p>
                      <p className="text-lg font-bold text-gray-900">
                        {vehicleDetails.year}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Make</p>
                      <p className="text-lg font-bold text-gray-900">
                        {vehicleDetails.make}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Model</p>
                      <p className="text-lg font-bold text-gray-900">
                        {vehicleDetails.model}
                      </p>
                    </div>
                    {vehicleDetails.trim && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">
                          Trim
                        </p>
                        <p className="text-lg font-bold text-gray-900">
                          {vehicleDetails.trim}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

            {/* ORIGINAL ORANGE BUTTON - EXACT STYLING */}
            <Button
              onClick={handleManualEntry}
              className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
              disabled={
                !vehicleDetails.year ||
                !vehicleDetails.make ||
                !vehicleDetails.model
              }
            >
              <Sparkles className="mr-2 h-5 w-5" />
              GET MY INSTANT OFFER
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        ) : (
          /* ORIGINAL VIN MODE STYLING */
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                We'll automatically identify your vehicle details
              </h3>
              <p className="text-gray-600">
                Enter your VIN for the most accurate vehicle information
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VIN (17 characters)
                </label>
                <Input
                  type="text"
                  value={vin}
                  onChange={(e) => handleVinChange(e.target.value)}
                  placeholder="Enter your 17-character VIN"
                  maxLength={17}
                  className="w-full text-lg p-4"
                />
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Find your VIN on dashboard, door frame, or registration
                </p>
              </div>

              <Button
                onClick={handleVinDecode}
                disabled={loading || vin.length !== 17}
                className="w-full bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-bold py-4 rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Decoding VIN...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-5 w-5" />
                    DECODE VIN & GET OFFER
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* ORIGINAL ERROR DISPLAY */}
        {/* ENHANCED ERROR DISPLAY */}
        {error && (
          <Alert className="mt-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {typeof error === "string" ? error : error}
            </AlertDescription>
          </Alert>
        )}

        {/* ALTERNATIVE ACTION BUTTONS WHEN VIN FAILS */}
        {error && vin.length === 17 && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-medium text-blue-800 mb-2">
              Alternative Options:
            </h4>
            <div className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsVinMode(false);
                  setError("");
                }}
                className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                Switch to Manual Entry
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleVinDecode}
                disabled={loading}
                className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
              >
                {loading ? "Retrying..." : "Try VIN Again"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
