/** route: src/components/quote/questions/VehicleQuadrantSelector.jsx */
"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVehicle } from "@/contexts/VehicleContext";

export default function VehicleQuadrantSelector({
  title,
  onSelectionComplete,
  vehicleDetails,
  questionNumber,
  totalQuestions,
}) {
  const vehicleState = useVehicle();
  const [selectedQuadrants, setSelectedQuadrants] = useState([]);

  const quadrants = [
    { id: "front_left", label: "Front Left", position: "top-0 left-0" },
    { id: "front_right", label: "Front Right", position: "top-0 right-0" },
    { id: "rear_left", label: "Rear Left", position: "bottom-0 left-0" },
    { id: "rear_right", label: "Rear Right", position: "bottom-0 right-0" },
  ];

  const toggleQuadrant = (quadrantId) => {
    setSelectedQuadrants((prev) =>
      prev.includes(quadrantId)
        ? prev.filter((id) => id !== quadrantId)
        : [...prev, quadrantId]
    );
  };

  const handleSubmit = () => {
    console.log(
      "VehicleQuadrantSelector == handleSubmit == selectedQuadrants ===>",
      selectedQuadrants
    );
    onSelectionComplete(selectedQuadrants);
  };

  const getVehicleDisplayName = () => {
    if (vehicleDetails.year && vehicleDetails.make && vehicleDetails.model) {
      return `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;
    }
    return vehicleDetails.make || "vehicle";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-sm text-gray-600">
          Question {questionNumber} of {totalQuestions}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Select all areas that apply by clicking on the car diagram
        </p>
      </div>

      <Card className="mx-auto max-w-md">
        <CardContent className="p-6">
          {/* Enhanced Car Diagram */}
          <div className="relative w-full h-64 bg-gradient-to-b from-gray-100 to-gray-200 rounded-lg border-2 border-gray-300">
            {/* Car Body */}
            <div className="absolute inset-4 bg-gradient-to-b from-blue-300 to-blue-400 rounded-lg border-2 border-blue-500 shadow-inner">
              {/* Car Details */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-sm"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-3 bg-red-500 rounded-sm"></div>

              {/* Quadrant Selection Areas */}
              {quadrants.map((quadrant) => (
                <button
                  key={quadrant.id}
                  onClick={() => toggleQuadrant(quadrant.id)}
                  className={`absolute w-1/2 h-1/2 border-2 border-white transition-all duration-300 ${
                    quadrant.position
                  } ${
                    selectedQuadrants.includes(quadrant.id)
                      ? "bg-red-500 bg-opacity-80 scale-95 shadow-lg"
                      : "bg-transparent hover:bg-red-200 hover:bg-opacity-50"
                  }`}
                  title={quadrant.label}
                >
                  <span className="sr-only">{quadrant.label}</span>
                  {/* Visual indicator for selected areas */}
                  {selectedQuadrants.includes(quadrant.id) && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            {/* Car Labels */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
              FRONT
            </div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700">
              REAR
            </div>
          </div>

          {/* Selection Summary */}
          {selectedQuadrants.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Selected areas:
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedQuadrants.map((id) => {
                  const quadrant = quadrants.find((q) => q.id === id);
                  return (
                    <span
                      key={id}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium border border-red-200"
                    >
                      {quadrant.label}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-sm font-medium text-blue-800 mb-1">
              📋 How to Select
            </h4>
            <ul className="text-xs text-blue-700 space-y-1">
              <li>• Click on any area of the car diagram</li>
              <li>• Multiple areas can be selected</li>
              <li>• Click again to deselect an area</li>
              <li>• Red areas show your selections</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-center">
        <Button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 px-8 py-3"
        >
          {selectedQuadrants.length > 0
            ? `Continue with ${selectedQuadrants.length} area${
                selectedQuadrants.length !== 1 ? "s" : ""
              } selected`
            : "Continue (No areas affected)"}
        </Button>
      </div>
    </div>
  );
}
