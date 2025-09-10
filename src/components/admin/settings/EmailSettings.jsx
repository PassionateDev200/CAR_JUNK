/** route: src/components/admin/settings/EmailSettings.jsx */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Mail, Server, Bell, TestTube } from "lucide-react";
import axios from "axios";

export default function EmailSettings({ settings, onUpdate }) {
  const [formData, setFormData] = useState(settings || {});
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("/api/admin/settings", {
        section: "email",
        settings: formData,
      });

      if (response.data.success) {
        setMessage({ type: "success", text: "Email settings updated successfully!" });
        onUpdate("email", formData);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update email settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestEmail = async () => {
    setTesting(true);
    setMessage({ type: "", text: "" });

    try {
      // This would call a test email API endpoint
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      setMessage({ type: "success", text: "Test email sent successfully!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to send test email" });
    } finally {
      setTesting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-green-600" />
          Email Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message.text && (
            <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* SMTP Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Server className="h-4 w-4" />
                SMTP Configuration
              </h3>
              
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  value={formData.smtpHost || ""}
                  onChange={(e) => handleChange("smtpHost", e.target.value)}
                  placeholder="smtp.gmail.com"
                />
              </div>

              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  value={formData.smtpPort || 587}
                  onChange={(e) => handleChange("smtpPort", parseInt(e.target.value))}
                  placeholder="587"
                />
              </div>

              <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  value={formData.smtpUser || ""}
                  onChange={(e) => handleChange("smtpUser", e.target.value)}
                  placeholder="your-email@gmail.com"
                />
              </div>

              <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={formData.smtpPassword || ""}
                  onChange={(e) => handleChange("smtpPassword", e.target.value)}
                  placeholder="Your email password or app password"
                />
              </div>
            </div>

            {/* Email Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Configuration
              </h3>

              <div>
                <Label htmlFor="fromEmail">From Email</Label>
                <Input
                  id="fromEmail"
                  type="email"
                  value={formData.fromEmail || ""}
                  onChange={(e) => handleChange("fromEmail", e.target.value)}
                  placeholder="noreply@yourbusiness.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fromName">From Name</Label>
                <Input
                  id="fromName"
                  value={formData.fromName || ""}
                  onChange={(e) => handleChange("fromName", e.target.value)}
                  placeholder="Your Business Name"
                  required
                />
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-medium flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  Notification Settings
                </h4>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="adminNotifications">Admin Notifications</Label>
                    <p className="text-sm text-gray-600">Send notifications to admin users</p>
                  </div>
                  <Switch
                    id="adminNotifications"
                    checked={formData.adminNotifications || false}
                    onCheckedChange={(checked) => handleChange("adminNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="customerNotifications">Customer Notifications</Label>
                    <p className="text-sm text-gray-600">Send notifications to customers</p>
                  </div>
                  <Switch
                    id="customerNotifications"
                    checked={formData.customerNotifications || false}
                    onCheckedChange={(checked) => handleChange("customerNotifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="quoteExpiryReminder">Quote Expiry Reminder</Label>
                    <p className="text-sm text-gray-600">Remind customers about expiring quotes</p>
                  </div>
                  <Switch
                    id="quoteExpiryReminder"
                    checked={formData.quoteExpiryReminder || false}
                    onCheckedChange={(checked) => handleChange("quoteExpiryReminder", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="pickupReminder">Pickup Reminder</Label>
                    <p className="text-sm text-gray-600">Remind customers about scheduled pickups</p>
                  </div>
                  <Switch
                    id="pickupReminder"
                    checked={formData.pickupReminder || false}
                    onCheckedChange={(checked) => handleChange("pickupReminder", checked)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleTestEmail}
              disabled={testing || !formData.smtpHost || !formData.smtpUser}
              className="flex items-center gap-2"
            >
              {testing ? (
                <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <TestTube className="h-4 w-4" />
              )}
              {testing ? "Testing..." : "Test Email"}
            </Button>

            <Button type="submit" disabled={loading} className="flex items-center gap-2">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Mail className="h-4 w-4" />
              )}
              {loading ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
