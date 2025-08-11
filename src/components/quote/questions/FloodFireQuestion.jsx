/** route: src/components/quote/questions/FloodFireQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Flame, Info } from "lucide-react";
// ✅ REMOVED: useVehicle import (not needed)

export default function FloodFireQuestion({
  vehicleDetails,
  currentAnswer,
  onAnswer,
  onPrevious,
  questionNumber,
  totalQuestions,
}) {
  // ✅ REMOVED: vehicleState = useVehicle() (not needed)
  const [selectedValue, setSelectedValue] = useState(currentAnswer || "");

  useEffect(() => {
    setSelectedValue(currentAnswer || "");
  }, [currentAnswer]);

  const options = [
    {
      value: "no_flood_fire",
      label: "No, thank goodness",
      priceAdjustment: {
        type: "flood_fire", // ✅ UPDATED: Changed from "flood_fire_damage" to match question ID
        amount: 0, // ✅ ADDED: Explicit amount for good condition
      },
      description: "Vehicle has never been involved in flood or fire incidents",
      impact: "No adjustment needed", // ✅ ADDED: Impact description
      severity: "good",
    },
    {
      value: "flood_fire_damage",
      label: "Yes, it has been in a flood or fire",
      priceAdjustment: {
        type: "flood_fire", // ✅ UPDATED: Changed from "flood_fire_damage" to match question ID
        amount: -200,
      },
      description: "Vehicle has experienced flood or fire damage at some point",
      impact: "-$200 adjustment", // ✅ ADDED: Impact description
      severity: "poor",
    },
  ];

  // ✅ UPDATED: Modified to only update selection, not auto-advance
  const handleSelection = (value) => {
    setSelectedValue(value);
    // Don't call onAnswer immediately - wait for Next button
  };

  // ✅ ADDED: New Next button functionality
  const handleNext = () => {
    if (selectedValue) {
      const selectedOption = options.find((opt) => opt.value === selectedValue);
      onAnswer(selectedValue, selectedOption.priceAdjustment);
    }
  };

  const getVehicleDisplayName = () => {
    if (vehicleDetails.year && vehicleDetails.make && vehicleDetails.model) {
      return `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;
    }
    return vehicleDetails.make || "vehicle";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Flame className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl text-gray-800">
            Has your {getVehicleDisplayName()} been in a flood or fire?
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          It's terrible, but it happens. And it impacts the offer. Just let us
          know if it's been involved in an incident resulting in fire or water
          damage, inside or out.
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Question {questionNumber} of {totalQuestions}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {options.map((option) => (
          <div key={option.value} className="space-y-2">
            <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="flood_fire"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleSelection(option.value)} // ✅ UPDATED: Only updates selection
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {option.description}
                  {/* {option.priceAdjustment && (
                    <div
                      className={`text-xs mt-1 ${
                        option.priceAdjustment.amount === 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      Price Impact: {option.impact}
                    </div>
                  )} */}
                </div>
              </div>
            </Label>
          </div>
        ))}

        {/* ✅ ADDED: Informational alert for flood/fire damage */}
        {selectedValue === "flood_fire_damage" && (
          <Alert className="border-amber-200 bg-amber-50">
            <Info className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-700">
              Flood and fire damage significantly impacts vehicle value due to
              extensive hidden damage to electrical systems, metals, and safety
              components. We still purchase these vehicles but at adjusted
              pricing to account for the damage.
            </AlertDescription>
          </Alert>
        )}

        {/* ✅ ADDED: Navigation buttons with Next button */}
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
            disabled={!selectedValue}
            className="min-w-24"
          >
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
