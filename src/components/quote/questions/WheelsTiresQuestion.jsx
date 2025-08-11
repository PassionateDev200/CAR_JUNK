/** route: src/components/quote/questions/WheelsTiresQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";

export default function WheelsTiresQuestion({
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
      value: "all_inflated_attached",
      label: "Yes, all are inflated and attached",
      priceAdjustment: {
        type: "wheels_tires",
        amount: 0,
      },
      description: "All 4 wheels/tires are properly attached and inflated",
      impact: "No adjustment needed",
    },
    {
      value: "one_or_more_flat",
      label: "No, one or more are flat",
      priceAdjustment: {
        type: "wheels_tires",
        amount: -50,
      },
      description: "Some tires are flat but wheels are attached",
      impact: "-$50 adjustment",
    },
    {
      value: "one_or_more_missing",
      label: "No, one or more are missing",
      priceAdjustment: {
        type: "wheels_tires",
        amount: -100,
      },
      description: "Some wheels or tires are completely missing",
      impact: "-$100 adjustment",
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
    } else if (vehicleDetails.make && vehicleDetails.model) {
      return `${vehicleDetails.make} ${vehicleDetails.model}`;
    }
    return "vehicle";
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center pb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Settings className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl text-gray-800">
            Do all the wheels and tires on your {getVehicleDisplayName()} look
            good?
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          No biggie either way, we're just trying to select the best truck to
          pick 'er up
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
                name="wheels_tires"
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
                    <div className="text-xs text-blue-600 mt-1">
                      Price Impact: {option.impact}
                    </div>
                  )} */}
                </div>
              </div>
            </Label>
          </div>
        ))}

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
