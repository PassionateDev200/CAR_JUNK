/** route: src/components/quote/questions/ExteriorDamageQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

export default function ExteriorDamageQuestion({
  vehicleDetails,
  currentAnswer,
  onAnswer,
  onPrevious,
  questionNumber,
  totalQuestions,
}) {
  const [selectedValue, setSelectedValue] = useState(currentAnswer || "");

  useEffect(() => {
    setSelectedValue(currentAnswer || "");
  }, [currentAnswer]);

  const options = [
    {
      value: "no_major_damage",
      label: "No, nothing major, just a few dings and scratches",
      priceAdjustment: {
        type: "exterior_damage", // Updated to match question ID
        amount: 0,
      },
      description:
        "Normal wear and tear - small scratches, door dings, minor scuffs",
      impact: "No adjustment needed",
      severity: "good",
    },
    {
      value: "has_damage",
      label: "Yes, it has some rust or exterior damage",
      priceAdjustment: {
        type: "exterior_damage", // Updated to match question ID
        amount: -75,
      },
      description:
        "Visible damage larger than a baseball - dents, rust, collision damage",
      impact: "-$75 adjustment (+ location selector)",
      severity: "moderate",
    },
  ];

  const handleSelection = (value) => {
    setSelectedValue(value);
    // Don't call onAnswer immediately - wait for Next button
  };

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
          <Shield className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl text-gray-800">
            Does your {getVehicleDisplayName()} have any exterior damage?
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Most used cars have a little wear and tear, but small blemishes won't
          affect your offer. Just let us know if the outside of your car has any
          damage bigger than a baseball.
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
                name="exterior_damage"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleSelection(option.value)}
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

        {selectedValue === "has_damage" && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              After clicking continue, you'll be able to select which areas of
              your vehicle have damage. This helps us provide the most accurate
              pricing.
            </div>
          </div>
        )}

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
