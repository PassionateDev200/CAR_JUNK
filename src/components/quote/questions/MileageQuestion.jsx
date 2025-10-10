/** route: src/components/quote/questions/MileageQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Gauge, Info } from "lucide-react";

export default function MileageQuestion({
  vehicleDetails,
  currentAnswer,
  onAnswer,
  onPrevious,
  questionNumber,
  totalQuestions,
}) {
  const [mileage, setMileage] = useState("");
  const [unsureAboutMileage, setUnsureAboutMileage] = useState(false);
  const [mileageCategory, setMileageCategory] = useState("");
  const [error, setError] = useState("");

  // FIXED: Proper state initialization and synchronization
  useEffect(() => {
    try {
      if (currentAnswer) {
        if (typeof currentAnswer === "object") {
          // Handle object format: { mileage: 123456, unsure: false }
          if (currentAnswer.unsure || currentAnswer.mileage === "unsure") {
            setUnsureAboutMileage(true);
            setMileage("");
            setMileageCategory("unsure");
          } else if (currentAnswer.mileage) {
            setMileage(currentAnswer.mileage.toString());
            setUnsureAboutMileage(false);
            calculateMileageCategory(currentAnswer.mileage);
          }
        } else if (typeof currentAnswer === "string") {
          // Handle string format: "unsure" or "123456"
          if (currentAnswer === "unsure") {
            setUnsureAboutMileage(true);
            setMileage("");
            setMileageCategory("unsure");
          } else {
            setMileage(currentAnswer);
            setUnsureAboutMileage(false);
            calculateMileageCategory(parseInt(currentAnswer));
          }
        }
      } else {
        // Reset to initial state
        setMileage("");
        setUnsureAboutMileage(false);
        setMileageCategory("");
      }
      setError(""); // Clear any previous errors
    } catch (err) {
      console.error("Error initializing MileageQuestion state:", err);
      setError("Error loading previous answer");
    }
  }, [currentAnswer]);

  // FIXED: Simplified mileage calculation with proper error handling
  const calculateMileageCategory = (miles) => {
    try {
      if (!vehicleDetails.year || !miles || miles <= 0) {
        setMileageCategory("");
        return;
      }

      const currentYear = new Date().getFullYear();
      const vehicleAge = currentYear - parseInt(vehicleDetails.year);
      const averageMilesPerYear = 12000;
      const expectedMileage = Math.max(vehicleAge * averageMilesPerYear, 0);

      if (miles > expectedMileage + 50000) {
        setMileageCategory("high");
      } else if (miles < expectedMileage - 50000 && vehicleAge > 0) {
        setMileageCategory("low");
      } else {
        setMileageCategory("average");
      }
    } catch (err) {
      console.error("Error calculating mileage category:", err);
      setMileageCategory("");
    }
  };

  // FIXED: Updated to use new pricing system
  const getMileageAdjustment = (miles) => {
    try {
      if (!vehicleDetails.year || !miles || miles <= 0) {
        return { type: "mileage", amount: 0 };
      }

      const currentYear = new Date().getFullYear();
      const vehicleAge = currentYear - parseInt(vehicleDetails.year);
      const averageMilesPerYear = 12000;
      const expectedMileage = Math.max(vehicleAge * averageMilesPerYear, 0);

      if (miles > expectedMileage + 50000) {
        return { type: "mileage", amount: -100 }; // High mileage penalty
      } else if (miles < expectedMileage - 50000 && vehicleAge > 0) {
        return { type: "mileage", amount: 50 }; // Low mileage bonus
      } else {
        return { type: "mileage", amount: 0 }; // Average mileage
      }
    } catch (err) {
      console.error("Error calculating mileage adjustment:", err);
      return { type: "mileage", amount: 0 };
    }
  };

  // FIXED: Added Next button functionality
  const handleNext = () => {
    try {
      setError("");

      if (unsureAboutMileage) {
        onAnswer(
          { mileage: "unsure", unsure: true },
          { type: "mileage", amount: -75 } // Uncertainty penalty
        );
      } else if (mileage && parseInt(mileage.replace(/,/g, "")) > 0) {
        const miles = parseInt(mileage.replace(/,/g, ""));
        const adjustment = getMileageAdjustment(miles);
        onAnswer({ mileage: miles, unsure: false }, adjustment);
      } else {
        setError("Please enter a valid mileage or check 'I'm not sure'");
      }
    } catch (err) {
      console.error("Error handling next:", err);
      setError("Error processing mileage. Please try again.");
    }
  };

  // FIXED: Improved mileage formatting with error handling
  const formatMileage = (value) => {
    try {
      const digits = value.replace(/\D/g, "");
      return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (err) {
      return value;
    }
  };

  const handleMileageChange = (e) => {
    try {
      const formatted = formatMileage(e.target.value);
      setMileage(formatted);
      setError("");

      // Real-time category calculation
      if (formatted && !unsureAboutMileage) {
        const miles = parseInt(formatted.replace(/,/g, ""));
        if (miles > 0) {
          calculateMileageCategory(miles);
        }
      } else {
        setMileageCategory("");
      }
    } catch (err) {
      console.error("Error handling mileage change:", err);
    }
  };

  const handleUnsureToggle = (checked) => {
    try {
      setUnsureAboutMileage(checked);
      setError("");

      if (checked) {
        setMileage("");
        setMileageCategory("unsure");
      } else {
        setMileageCategory("");
      }
    } catch (err) {
      console.error("Error handling unsure toggle:", err);
    }
  };

  // FIXED: Safe calculation of expected mileage
  const getExpectedMileage = () => {
    try {
      if (!vehicleDetails.year) return "N/A";

      const currentYear = new Date().getFullYear();
      const vehicleAge = currentYear - parseInt(vehicleDetails.year);
      return Math.max(vehicleAge * 12000, 0).toLocaleString();
    } catch (err) {
      return "N/A";
    }
  };

  const getMileageInfo = () => {
    if (unsureAboutMileage) {
      return {
        text: "We'll estimate based on vehicle age",
        color: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        impact: "-$75 for uncertainty",
      };
    }

    switch (mileageCategory) {
      case "low":
        return {
          text: "Lower than average - increases value!",
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-200",
          impact: "+$50 bonus",
        };
      case "average":
        return {
          text: "About average for vehicle age",
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-200",
          impact: "No adjustment",
        };
      case "high":
        return {
          text: "Higher than average for vehicle age",
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          impact: "-$100 adjustment",
        };
      default:
        return null;
    }
  };

  const getVehicleDisplayName = () => {
    if (vehicleDetails.year && vehicleDetails.make && vehicleDetails.model) {
      return `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;
    }
    return "vehicle";
  };

  const mileageInfo = getMileageInfo();

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Gauge className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl text-gray-800">
            What's the mileage on your {getVehicleDisplayName()}?
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Don't worry about the exact number. We round to the nearest thousand,
          so you can too.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Question {questionNumber} of {totalQuestions}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert className="border-red-200 bg-red-50">
            <Info className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Mileage Input */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mileage" className="text-sm font-medium">
              Enter mileage (optional)
            </Label>
            <Input
              id="mileage"
              type="text"
              placeholder="e.g., 125,000"
              value={mileage}
              onChange={handleMileageChange}
              disabled={unsureAboutMileage}
              className="text-lg"
            />
          </div>

          {/* Unsure Checkbox */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="unsure"
              checked={unsureAboutMileage}
              onChange={(e) => handleUnsureToggle(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded"
            />
            <Label htmlFor="unsure" className="text-sm cursor-pointer">
              I'm not sure about the exact mileage
            </Label>
          </div>
        </div>

        {/* Mileage Category Info */}
        {mileageInfo && (
          <div
            className={`p-4 rounded-lg border ${mileageInfo.bg} ${mileageInfo.border}`}
          >
            <div className={`text-sm font-medium ${mileageInfo.color} mb-1`}>
              {mileageInfo.text}
            </div>
            {/* <div className="text-xs text-gray-600">
              Price Impact: {mileageInfo.impact}
            </div> */}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          {onPrevious ? (
            <Button variant="outline" onClick={onPrevious}>
              Previous
            </Button>
          ) : (
            <div></div>
          )}

          <Button
            onClick={handleNext}
            disabled={!mileage && !unsureAboutMileage}
            className="min-w-24"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
