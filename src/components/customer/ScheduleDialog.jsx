/** route:  src/components/customer/ScheduleDialog.jsx*/
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Clock, AlertCircle, MapPin, Phone } from "lucide-react";
import axios from "axios";

export default function ScheduleDialog({
  open,
  onOpenChange,
  quote,
  onActionComplete,
  loading,
  setLoading,
}) {
  // Check if there's already a scheduled pickup
  const hasExistingSchedule = quote?.pickupDetails?.scheduledDate;
  const isRescheduling = hasExistingSchedule && quote?.status === "pickup_scheduled";
  const [formData, setFormData] = useState({
    scheduledDate: "",
    scheduledTime: "",
    timeSlot: "flexible",
    specialInstructions: "",
    contactPhone: quote?.customer?.phone || "",
    pickupAddress: quote?.customer?.address || "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  // Update state field
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  // Form validation
  const validateForm = () => {
    if (!formData.scheduledDate || !formData.scheduledTime) {
      setError("Please select both a pickup date and time.");
      return false;
    }
    if (!formData.contactPhone || formData.contactPhone.trim().length < 8) {
      setError("Please enter a valid phone number.");
      return false;
    }
    if (!formData.pickupAddress || formData.pickupAddress.trim().length < 8) {
      setError("Please enter a valid pickup address.");
      return false;
    }
    // Date in the future
    const selectedDate = new Date(formData.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setError("Pickup date cannot be in the past.");
      return false;
    }
    return true;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/quote/schedule-pickup", {
        accessToken: quote.accessToken,
        scheduledDate: formData.scheduledDate,
        scheduledTime: formData.scheduledTime,
        timeSlot: formData.timeSlot,
        specialInstructions: formData.specialInstructions,
        contactPhone: formData.contactPhone,
        pickupAddress: formData.pickupAddress,
      });

      if (response.data.success) {
        // Pass the updated quote data to parent component
        if (onActionComplete && response.data.quote) {
          onActionComplete(response.data.quote);
        }
        
        // Show success message based on whether it's a reschedule or new schedule
        if (response.data.isReschedule) {
          console.log("✅ Pickup rescheduled successfully");
        } else {
          console.log("✅ Pickup scheduled successfully");
        }
        
        onOpenChange(false); // close modal first
      } else {
        setError(response.data.error || "Failed to schedule pickup.");
      }
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to schedule pickup. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Generate time slots
  const timeSlots = [
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];
  // Date range: tomorrow to +30d
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];

  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);
  const maxDateString = maxDate.toISOString().split("T")[0];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            {isRescheduling ? "Reschedule Pickup" : "Schedule Pickup"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="scheduledDate">Pickup Date *</Label>
            <Input
              id="scheduledDate"
              type="date"
              min={minDate}
              max={maxDateString}
              value={formData.scheduledDate}
              onChange={(e) =>
                handleInputChange("scheduledDate", e.target.value)
              }
              required
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="scheduledTime">Pickup Time *</Label>
            <Select
              value={formData.scheduledTime}
              onValueChange={(value) =>
                handleInputChange("scheduledTime", value)
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pickup time" />
              </SelectTrigger>
              <SelectContent>
                {timeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Flexibility */}
          <div className="space-y-2">
            <Label htmlFor="timeSlot">Time Flexibility</Label>
            <Select
              value={formData.timeSlot}
              onValueChange={(value) => handleInputChange("timeSlot", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flexible">Flexible (±30 minutes)</SelectItem>
                <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                <SelectItem value="afternoon">
                  Afternoon (12PM - 6PM)
                </SelectItem>
                <SelectItem value="evening">Evening (6PM - 8PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="contactPhone">Contact Phone *</Label>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <Input
                id="contactPhone"
                placeholder="e.g. (555) 123-4567"
                value={formData.contactPhone}
                onChange={(e) =>
                  handleInputChange("contactPhone", e.target.value)
                }
                required
                maxLength={20}
              />
            </div>
          </div>

          {/* Pickup Address */}
          <div className="space-y-2">
            <Label htmlFor="pickupAddress">Pickup Address *</Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <Input
                id="pickupAddress"
                placeholder="Street, City, State, ZIP"
                value={formData.pickupAddress}
                onChange={(e) =>
                  handleInputChange("pickupAddress", e.target.value)
                }
                required
                maxLength={200}
              />
            </div>
          </div>

          {/* Special Instructions */}
          <div className="space-y-2">
            <Label htmlFor="specialInstructions">
              Special Instructions (Optional)
            </Label>
            <Textarea
              id="specialInstructions"
              placeholder="Any special instructions for pickup (e.g., gate code, parking location, etc.)"
              value={formData.specialInstructions}
              onChange={(e) =>
                handleInputChange("specialInstructions", e.target.value)
              }
              rows={3}
              maxLength={500}
            />
            <p className="text-xs text-gray-500">
              {formData.specialInstructions.length}/500 characters
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isRescheduling ? "Rescheduling..." : "Scheduling..."}
                </div>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  {isRescheduling ? "Reschedule Pickup" : "Schedule Pickup"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
