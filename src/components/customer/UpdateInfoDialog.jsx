/**route: src/components/customer/UpdateInfoDialog.jsx */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { User, Mail, Phone, MapPin, Edit } from "lucide-react";
import { updateContactInfo } from "@/lib/quoteApi";

export default function UpdateInfoDialog({
  open,
  onOpenChange,
  quote,
  onActionComplete,
  loading,
  setLoading,
}) {
  const [formData, setFormData] = useState({
    name: quote.customer.name || "",
    email: quote.customer.email || "",
    phone: quote.customer.phone || "",
    address: quote.customer.address || "",
  });
  const [error, setError] = useState("");

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    // Validate required fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim()
    ) {
      setError("Name, email, and phone are required");
      return;
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    // Validate phone format
    const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(formData.phone)) {
      setError("Please enter a valid phone number");
      return;
    }

    // Check if any changes were made
    const hasChanges = Object.keys(formData).some(
      (key) => formData[key] !== (quote.customer[key] || "")
    );

    if (!hasChanges) {
      setError("No changes were made to update");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await updateContactInfo(quote.accessToken, formData);

      if (result.success) {
        onActionComplete(result.data.quote);
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to update information. Please try again.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        name: quote.customer.name || "",
        email: quote.customer.email || "",
        phone: quote.customer.phone || "",
        address: quote.customer.address || "",
      });
      setError("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5 text-blue-600" />
            Update Contact Information
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="flex items-center gap-2 mb-2">
              <User className="h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>

          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
              <Phone className="h-4 w-4" />
              Phone Number *
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
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
          <Button onClick={handleUpdate} disabled={loading}>
            {loading ? "Updating..." : "Update Information"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
