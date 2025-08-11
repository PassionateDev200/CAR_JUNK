/** route: src/components/quote/questions/MissingPartsQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

export default function MissingPartsQuestion({
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
      value: "all_parts_attached",
      label: "Yes, all exterior parts and panels are attached",
      priceAdjustment: {
        type: "missing_parts", // Updated to match question ID
        amount: 0,
      },
      description:
        "All doors, bumpers, panels securely attached as from factory",
      impact: "No adjustment needed",
      severity: "good",
    },
    {
      value: "missing_parts",
      label:
        "No, at least one exterior part or panel is broken, loose, or missing",
      priceAdjustment: {
        type: "missing_parts", // Updated to match question ID
        amount: -100,
      },
      description:
        "Some exterior components are damaged, loose, or completely missing",
      impact: "-$100 adjustment (+ location selector)",
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
          <AlertTriangle className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl text-gray-800">
            Are all exterior parts and panels attached to your{" "}
            {getVehicleDisplayName()}?
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          We're talking just as secure as when it left the factory, or a sturdy
          aftermarket replacement— Nothing loose, hanging or missing
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
                name="missing_parts"
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

        {selectedValue === "missing_parts" && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-800">
              After clicking continue, you'll be able to select which areas have
              missing or loose parts. This helps us provide the most accurate
              pricing and plan the pickup properly.
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
