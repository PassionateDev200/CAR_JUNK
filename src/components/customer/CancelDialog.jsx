/** route: src/components/customer/CancelDialog.jsx */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { AlertTriangle, XCircle } from "lucide-react";
import { cancelQuote } from "@/lib/quoteApi";

export default function CancelDialog({
  open,
  onOpenChange,
  quote,
  onActionComplete,
  loading,
  setLoading,
}) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  const reasons = [
    {
      value: "changed_mind",
      label: "Changed my mind",
      description: "I've decided not to sell at this time",
    },
    {
      value: "found_better_offer",
      label: "Found a better offer",
      description: "I received a higher offer elsewhere",
    },
    {
      value: "vehicle_sold_elsewhere",
      label: "Sold vehicle elsewhere",
      description: "I already sold the vehicle to someone else",
    },
    {
      value: "family_decision",
      label: "Family decision",
      description: "My family decided to keep the vehicle",
    },
    {
      value: "financial_reasons",
      label: "Financial reasons",
      description: "My financial situation has changed",
    },
    {
      value: "timing_issues",
      label: "Timing issues",
      description: "The timing doesn't work for me anymore",
    },
    {
      value: "other",
      label: "Other",
      description: "Please specify in the notes below",
    },
  ];

  const handleCancel = async () => {
    if (!reason) {
      setError("Please select a reason for cancellation");
      return;
    }

    if (reason === "other" && !note.trim()) {
      setError("Please provide details for 'Other' reason");
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("CancelDialog: quote ===> ", quote);
      const result = await cancelQuote(quote.accessToken, reason, note);

      if (result.success) {
        onActionComplete(result.data.quote);
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to cancel quote. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setReason("");
      setNote("");
      setError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Cancel Quote
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Warning Alert */}
          <Alert className="border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              <strong>Warning:</strong> Cancelling this quote cannot be undone.
              You'll need to start a new quote process if you change your mind.
            </AlertDescription>
          </Alert>

          {/* Reason Selection */}
          <div>
            <Label className="text-base font-medium mb-3 block">
              Why are you cancelling this quote?
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
              placeholder="Any additional comments or feedback..."
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
            Keep Quote
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={loading || !reason}
          >
            {loading ? "Cancelling..." : "Cancel Quote"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
