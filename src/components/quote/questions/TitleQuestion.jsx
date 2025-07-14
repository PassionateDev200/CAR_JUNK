/** route: src/components/quote/questions/TitleQuestion.jsx */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, AlertCircle } from "lucide-react";

export default function TitleQuestion({
  vehicleDetails,
  currentAnswer,
  onAnswer,
  onPrevious,
  questionNumber,
  totalQuestions,
}) {
  const [selectedValue, setSelectedValue] = useState(currentAnswer || "");
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    setSelectedValue(currentAnswer || "");
  }, [currentAnswer]);

  const options = [
    {
      value: "clean_title",
      label: "Yes, it has a clean title",
      priceAdjustment: {
        type: "title",
        amount: 0,
      },
      description: "No stamps or notes indicating salvage or rebuilt status",
      isDisqualifying: false,
    },
    {
      value: "salvage_rebuilt",
      label: "No, it has a salvage or rebuilt title",
      priceAdjustment: {
        type: "title",
        amount: -150,
      },
      description: "Title shows salvage, rebuilt, or flood damage history",
      isDisqualifying: false,
    },
    {
      value: "no_title",
      label: "I don't have the title",
      priceAdjustment: null,
      description: "Title is lost, with lender, or not available",
      isDisqualifying: true,
    },
  ];

  const handleSelection = (value) => {
    const selectedOption = options.find((opt) => opt.value === value);
    setSelectedValue(value);

    // Show warning for disqualifying options but don't auto-advance
    if (selectedOption.isDisqualifying) {
      setShowWarning(true);
    } else {
      setShowWarning(false);
    }
  };

  const handleNext = () => {
    if (selectedValue) {
      const selectedOption = options.find((opt) => opt.value === selectedValue);

      if (selectedOption.isDisqualifying) {
        // For disqualifying answers, add a small delay to show the warning
        setTimeout(() => {
          onAnswer(selectedValue, selectedOption.priceAdjustment);
        }, 1500);
      } else {
        onAnswer(selectedValue, selectedOption.priceAdjustment);
      }
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
          <FileText className="h-6 w-6 text-blue-600" />
          <CardTitle className="text-xl text-gray-800">
            Does your {getVehicleDisplayName()} have a clean title?
          </CardTitle>
        </div>
        <p className="text-sm text-gray-600 max-w-md mx-auto">
          Unless your vehicle has a history of severe damage, it probably has a
          clean title. But it's easy to check. Look for a note or stamp on your
          title that says 'salvage' or 'rebuilt.'
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Question {questionNumber} of {totalQuestions}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {showWarning && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              We require a title to complete the purchase. We'll redirect you
              shortly.
            </AlertDescription>
          </Alert>
        )}

        {options.map((option) => (
          <div key={option.value} className="space-y-2">
            <Label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="title"
                value={option.value}
                checked={selectedValue === option.value}
                onChange={() => handleSelection(option.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{option.label}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {option.description}
                  {option.priceAdjustment &&
                    option.priceAdjustment.amount !== 0 && (
                      <div className="text-xs text-red-600 mt-1">
                        Price Impact: -$
                        {Math.abs(option.priceAdjustment.amount)} adjustment
                      </div>
                    )}
                  {option.priceAdjustment &&
                    option.priceAdjustment.amount === 0 && (
                      <div className="text-xs text-green-600 mt-1">
                        Price Impact: No adjustment needed
                      </div>
                    )}
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
