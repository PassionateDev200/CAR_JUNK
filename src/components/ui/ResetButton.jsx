/** route: src/components/ui/ResetButton.jsx */
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { RotateCcw, AlertTriangle, Trash2, RefreshCw, Zap } from "lucide-react";
import {
  useVehicle,
  useVehicleDispatch,
  vehicleActions,
} from "@/contexts/VehicleContext";

export default function ResetButton({
  size = "default",
  variant = "outline",
  showConfirmation = true,
  position = "inline", // "inline", "fixed", "floating"
  className = "",
  style = "warning", // "warning", "danger", "branded"
}) {
  const vehicleState = useVehicle();
  const dispatch = useVehicleDispatch();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check if there's any data to reset
  const hasData =
    vehicleState.vehicleDetails.year ||
    vehicleState.vehicleDetails.make ||
    vehicleState.vehicleDetails.model ||
    vehicleState.vin ||
    Object.keys(vehicleState.conditionAnswers).some(
      (key) => vehicleState.conditionAnswers[key] !== null
    ) ||
    vehicleState.pricing.currentPrice > 0 ||
    vehicleState.sellerInfo.name ||
    vehicleState.sellerInfo.email ||
    vehicleState.sellerInfo.phone;

  const handleReset = () => {
    if (showConfirmation && hasData) {
      setShowConfirmDialog(true);
    } else {
      performReset();
    }
  };

  const performReset = () => {
    // Reset all context state
    dispatch(vehicleActions.resetVehicleData());

    // Clear localStorage
    localStorage.removeItem("vehicleQuoteData");

    // Reset to first step
    dispatch(vehicleActions.setCurrentStep(1));
    dispatch(vehicleActions.setCurrentQuestion(0));

    // Close confirmation dialog
    setShowConfirmDialog(false);

    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Analytics tracking
    if (window.gtag) {
      window.gtag("event", "quote_reset", {
        event_category: "engagement",
        event_label: "user_reset_quote",
      });
    }
  };

  // Style configurations for better recognition
  const getButtonStyles = () => {
    const baseStyles =
      "relative overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95";

    switch (style) {
      case "danger":
        return `${baseStyles} bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 shadow-lg hover:shadow-xl ${className}`;
      case "branded":
        return `${baseStyles} bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-xl ${className}`;
      default: // warning
        return `${baseStyles} bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 shadow-lg hover:shadow-xl ${className}`;
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case "fixed":
        return "fixed top-4 right-4 z-50";
      case "floating":
        return "fixed bottom-4 right-4 z-50 shadow-2xl hover:shadow-3xl";
      default:
        return "";
    }
  };

  const getIconAndText = () => {
    if (size === "sm") {
      return {
        icon: RotateCcw,
        text: "Reset",
      };
    }

    switch (style) {
      case "danger":
        return {
          icon: Trash2,
          text: "Clear All Data",
        };
      case "branded":
        return {
          icon: Zap,
          text: "Start Fresh",
        };
      default:
        return {
          icon: RefreshCw,
          text: "Start Over",
        };
    }
  };

  const { icon: IconComponent, text } = getIconAndText();

  return (
    <>
      <Button
        onClick={handleReset}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        size={size}
        className={`${getButtonStyles()} ${getPositionStyles()}`}
        disabled={!hasData}
        title="Reset all data and start over"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

        {/* Pulsing effect when data exists */}
        {hasData && (
          <div className="absolute inset-0 bg-white/20 rounded animate-pulse"></div>
        )}

        <IconComponent
          className={`${size === "sm" ? "h-3 w-3" : "h-4 w-4"} mr-2 ${
            isHovered ? "animate-spin" : ""
          }`}
        />
        <span className="relative z-10 font-bold">{text}</span>

        {/* Warning indicator */}
        {hasData && size !== "sm" && (
          <AlertTriangle className="h-3 w-3 ml-2 animate-bounce" />
        )}
      </Button>

      {/* Enhanced Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-lg border-2 border-red-200">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
            </div>
            <DialogTitle className="text-2xl font-bold text-red-600">
              ⚠️ Are you absolutely sure?
            </DialogTitle>
            <DialogDescription className="text-gray-600 text-lg">
              This will permanently delete <strong>ALL</strong> your entered
              information and start completely over.
              <br />
              <span className="text-red-600 font-medium">
                This action cannot be undone!
              </span>
            </DialogDescription>
          </DialogHeader>

          {/* Enhanced "What will be lost" section */}
          {hasData && (
            <div className="bg-red-50 border-2 border-red-200 p-6 rounded-lg my-6">
              <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                <Trash2 className="h-5 w-5 mr-2" />
                This will permanently delete:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="text-sm text-red-700 space-y-2">
                  {(vehicleState.vehicleDetails.year ||
                    vehicleState.vehicleDetails.make ||
                    vehicleState.vehicleDetails.model) && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Vehicle: {vehicleState.vehicleDetails.year}{" "}
                      {vehicleState.vehicleDetails.make}{" "}
                      {vehicleState.vehicleDetails.model}
                    </li>
                  )}
                  {vehicleState.vin && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      VIN number
                    </li>
                  )}
                  {Object.keys(vehicleState.conditionAnswers).some(
                    (key) => vehicleState.conditionAnswers[key] !== null
                  ) && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      All condition answers (
                      {
                        Object.keys(vehicleState.conditionAnswers).filter(
                          (key) => vehicleState.conditionAnswers[key] !== null
                        ).length
                      }{" "}
                      questions)
                    </li>
                  )}
                </ul>
                <ul className="text-sm text-red-700 space-y-2">
                  {vehicleState.pricing.currentPrice > 0 && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Current offer ($
                      {vehicleState.pricing.currentPrice?.toLocaleString()})
                    </li>
                  )}
                  {(vehicleState.sellerInfo.name ||
                    vehicleState.sellerInfo.email) && (
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                      Contact information
                    </li>
                  )}
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                    All progress and saved data
                  </li>
                </ul>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-4 mt-8">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="px-8 py-3 border-2 border-gray-300 hover:border-gray-400 font-medium"
            >
              ← Keep My Data
            </Button>
            <Button
              onClick={performReset}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Yes, Delete Everything
            </Button>
          </div>

          {/* Extra safety text */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              💡 Tip: You can also go back and edit individual answers instead
              of starting over
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
