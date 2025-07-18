/** route:  src/components/customer/RescheduleDialog.jsx*/
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar, Clock, RotateCcw } from "lucide-react";
import { reschedulePickup } from "@/lib/quoteApi";

export default function RescheduleDialog({
  open,
  onOpenChange,
  quote,
  onActionComplete,
  loading,
  setLoading,
}) {
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const reasons = [
    {
      value: "schedule_conflict",
      label: "Schedule conflict",
      description: "I have a conflicting appointment",
    },
    {
      value: "weather_concerns",
      label: "Weather concerns",
      description: "Weather conditions are not suitable",
    },
    {
      value: "location_change",
      label: "Location change",
      description: "I need to change the pickup location",
    },
    {
      value: "personal_emergency",
      label: "Personal emergency",
      description: "An unexpected personal situation arose",
    },
    {
      value: "vehicle_accessibility",
      label: "Vehicle accessibility",
      description: "Issues accessing the vehicle at scheduled time",
    },
    {
      value: "other",
      label: "Other",
      description: "Please specify in the notes below",
    },
  ];

  const timeSlots = [
    "8:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 2:00 PM",
    "2:00 PM - 4:00 PM",
    "4:00 PM - 6:00 PM",
    "6:00 PM - 8:00 PM",
  ];

  const handleReschedule = async () => {
    if (!newDate || !newTime || !reason) {
      setError("Please fill in all required fields");
      return;
    }

    // Validate date is in the future
    const selectedDate = new Date(newDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setError("Please select a future date");
      return;
    }

    if (reason === "other" && !note.trim()) {
      setError("Please provide details for 'Other' reason");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await reschedulePickup(
        quote.accessToken,
        newDate,
        newTime,
        reason,
        note
      );

      if (result.success) {
        onActionComplete(result.data.quote);
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to reschedule pickup. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setNewDate("");
      setNewTime("");
      setReason("");
      setNote("");
      setError("");
      onOpenChange(false);
    }
  };

  // Get minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-blue-600" />
            Reschedule Pickup
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Pickup Info */}
          {quote.pickupDetails &&
            (quote.pickupDetails.scheduledDate ||
              quote.pickupDetails.scheduledTime) && (
              <Alert className="border-blue-200 bg-blue-50">
                <Clock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  <strong>Current pickup:</strong>{" "}
                  {quote.pickupDetails.scheduledDate &&
                    new Date(
                      quote.pickupDetails.scheduledDate
                    ).toLocaleDateString()}{" "}
                  {quote.pickupDetails.scheduledTime &&
                    `at ${quote.pickupDetails.scheduledTime}`}
                </AlertDescription>
              </Alert>
            )}

          {/* New Date Selection */}
          <div>
            <Label htmlFor="newDate" className="text-base font-medium">
              New Pickup Date *
            </Label>
            <Input
              id="newDate"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              min={minDate}
              className="mt-2"
            />
          </div>

          {/* New Time Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Preferred Time Slot *
            </Label>
            <RadioGroup value={newTime} onValueChange={setNewTime}>
              <div className="grid grid-cols-2 gap-3">
                {timeSlots.map((slot) => (
                  <div key={slot} className="flex items-center space-x-2">
                    <RadioGroupItem value={slot} id={slot} />
                    <Label htmlFor={slot} className="cursor-pointer">
                      {slot}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </div>

          {/* Reason Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Reason for Rescheduling *
            </Label>
            <RadioGroup value={reason} onValueChange={setReason}>
              {reasons.map((reasonOption) => (
                <div
                  key={reasonOption.value}
                  className="flex items-start space-x-3"
                >
                  <RadioGroupItem
                    value={reasonOption.value}
                    id={reasonOption.value}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={reasonOption.value}
                      className="font-medium cursor-pointer"
                    >
                      {reasonOption.label}
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">
                      {reasonOption.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Additional Notes */}
          <div>
            <Label htmlFor="note" className="text-base font-medium">
              Additional Notes (Optional)
            </Label>
            <Textarea
              id="note"
              placeholder="Any specific instructions or additional information..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleReschedule}
            disabled={loading || !newDate || !newTime || !reason}
          >
            {loading ? "Rescheduling..." : "Reschedule Pickup"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
