/** route: src/components/quote/questions/InteriorQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Armchair } from "lucide-react";

export default function InteriorQuestion({
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
      value: "good_condition",
      label: "No, all interior parts are there and in good condition",
      priceAdjustment: {
        type: "interior", // Updated to match question ID
        amount: 0,
      },
      description:
        "Seats, dashboard, and interior components are intact and functional",
      impact: "No adjustment needed",
      severity: "good",
    },
    {
      value: "damaged_missing",
      label: "Yes, some interior parts are damaged or missing",
      priceAdjustment: {
        type: "interior", // Updated to match question ID
        amount: -75,
      },
      description:
        "Interior has significant damage, missing parts, or major wear",
      impact: "-$75 adjustment",
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
          <Armchair className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl text-gray-800">
            Are any interior parts of your {getVehicleDisplayName()} damaged or
            missing?
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Think about the seats, airbags, and dashboard. Don't worry about small
          scratches or spots. We just need to know if there are any serious rips
          or tears.
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
                name="interior"
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
