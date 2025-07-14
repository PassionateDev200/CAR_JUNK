/** route: src/components/quote/questions/ZipCodeQuestion.jsx */
"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { validateZipCode, getRegionAdjustment } from "@/utils/zipCodeApi";
import { useVehicle } from "@/contexts/VehicleContext";

export default function ZipCodeQuestion({
  vehicleDetails,
  currentAnswer,
  onAnswer,
  onPrevious,
  questionNumber,
  totalQuestions,
}) {
  const vehicleState = useVehicle();
  const [zipCode, setZipCode] = useState(currentAnswer?.zipCode || "");
  const [locationData, setLocationData] = useState(
    currentAnswer?.locationData || null
  );
  const [error, setError] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (currentAnswer?.zipCode) {
      setZipCode(currentAnswer.zipCode);
      setLocationData(currentAnswer.locationData);
    }
  }, [currentAnswer]);

  const handleZipValidation = async (zip) => {
    if (zip.length === 5) {
      setIsValidating(true);
      setError("");

      try {
        const result = await validateZipCode(zip);
        if (result.valid) {
          setLocationData(result);
          setError("");
        } else {
          setLocationData(null);
          setError(
            result.error ||
              "Invalid ZIP code. Please enter a valid 5-digit ZIP code."
          );
        }
      } catch (err) {
        setLocationData(null);
        setError("Unable to validate ZIP code. Please try again.");
        console.error("ZIP validation error:", err);
      } finally {
        setIsValidating(false);
      }
    } else {
      setLocationData(null);
      setError("");
    }
  };

  const handleSubmit = () => {
    if (!zipCode) {
      setError("Please enter a ZIP code");
      return;
    }

    if (zipCode.length !== 5) {
      setError("Please enter a valid 5-digit ZIP code");
      return;
    }

    if (!locationData || !locationData.valid) {
      setError("Please wait for ZIP code validation");
      return;
    }

    const locationAdjustment = getRegionAdjustment(locationData);
    setError("");
    onAnswer({ zipCode, locationData }, locationAdjustment);
  };

  const handleZipChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 5);
    setZipCode(value);
    setError("");

    if (value.length === 5) {
      handleZipValidation(value);
    } else {
      setLocationData(null);
    }
  };

  const getVehicleDisplayName = () => {
    if (vehicleDetails.year && vehicleDetails.make && vehicleDetails.model) {
      return `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;
    } else if (vehicleDetails.make) {
      return vehicleDetails.make;
    }
    return "vehicle";
  };

  return (
    <div className="space-y-6">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          <MapPin className="h-6 w-6 text-blue-600" />
          Where will we pick up your {getVehicleDisplayName()}?
        </CardTitle>
        <p className="text-sm text-gray-600 mb-4">
          Enter the ZIP code where your {vehicleDetails.make || "vehicle"} will
          be parked when we come to get it
        </p>
        <p className="text-xs text-gray-500">
          (This info helps us determine the offer amount.)
        </p>
        <p className="text-sm text-gray-600">
          Question {questionNumber} of {totalQuestions}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="max-w-md mx-auto space-y-4">
          <div>
            <Label htmlFor="zipcode" className="text-sm font-medium">
              ZIP Code
            </Label>
            <div className="relative">
              <Input
                id="zipcode"
                type="text"
                value={zipCode}
                onChange={handleZipChange}
                placeholder="Enter 5-digit ZIP code"
                className={`text-lg p-4 text-center pr-12 ${
                  error
                    ? "border-red-500"
                    : locationData?.valid
                    ? "border-green-500"
                    : ""
                }`}
                maxLength={5}
              />

              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                {isValidating && (
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                )}
                {!isValidating && locationData?.valid && (
                  <CheckCircle className="h-5 w-5 text-green-600" />
                )}
                {!isValidating && error && (
                  <AlertCircle className="h-5 w-5 text-red-600" />
                )}
              </div>
            </div>

            {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
          </div>

          {locationData?.valid && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                <div className="font-medium">
                  {locationData.city}, {locationData.state}
                </div>
                <div className="text-sm">
                  {locationData.county} • {locationData.timezone}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between items-center">
            {onPrevious && (
              <Button variant="outline" onClick={onPrevious}>
                Previous
              </Button>
            )}

            <Button
              onClick={handleSubmit}
              disabled={
                !zipCode ||
                zipCode.length !== 5 ||
                !locationData?.valid ||
                isValidating
              }
              className={`${
                !onPrevious ? "mx-auto" : "ml-auto"
              } bg-blue-600 hover:bg-blue-700`}
            >
              {isValidating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Validating...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
}
