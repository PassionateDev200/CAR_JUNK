/** route: src/components/admin/settings/BackupSettings.jsx */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Database, 
  Download, 
  Upload, 
  Clock, 
  HardDrive, 
  Shield,
  AlertTriangle,
  CheckCircle,
  RefreshCw
} from "lucide-react";
import axios from "axios";

export default function BackupSettings({ settings, onUpdate }) {
  const [formData, setFormData] = useState(settings || {});
  const [backupInfo, setBackupInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchBackupInfo();
  }, []);

  const fetchBackupInfo = async () => {
    try {
      const response = await axios.get("/api/admin/settings/backup");
      setBackupInfo(response.data.backupInfo);
    } catch (error) {
      console.error("Failed to fetch backup info:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("/api/admin/settings", {
        section: "backup",
        settings: formData,
      });

      if (response.data.success) {
        setMessage({ type: "success", text: "Backup settings updated successfully!" });
        onUpdate("backup", formData);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to update backup settings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async (type) => {
    setBackupLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const response = await axios.post("/api/admin/settings/backup", { type });
      
      if (response.data.success) {
        setMessage({ 
          type: "success", 
          text: `${type} backup created successfully! ${response.data.recordCount} records exported.` 
        });
        fetchBackupInfo(); // Refresh backup info
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.error || "Failed to create backup",
      });
    } finally {
      setBackupLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatDate = (date) => {
    if (!date) return "Never";
    return new Date(date).toLocaleString();
  };

  const getBackupStatus = () => {
    if (!backupInfo?.lastBackup) return { status: "warning", text: "No backups created yet" };
    
    const lastBackup = new Date(backupInfo.lastBackup);
    const now = new Date();
    const hoursSinceBackup = (now - lastBackup) / (1000 * 60 * 60);
    
    if (hoursSinceBackup < 24) return { status: "success", text: "Backup is recent" };
    if (hoursSinceBackup < 72) return { status: "warning", text: "Backup is getting old" };
    return { status: "error", text: "Backup is very old" };
  };

  const backupStatus = getBackupStatus();

  return (
    <div className="space-y-6">
      {/* Backup Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-blue-600" />
            Backup Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {backupInfo && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{backupInfo.totalQuotes}</div>
                <p className="text-sm text-gray-600">Total Quotes</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{backupInfo.totalCustomers}</div>
                <p className="text-sm text-gray-600">Total Customers</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{backupInfo.estimatedSize}</div>
                <p className="text-sm text-gray-600">Estimated Size</p>
              </div>
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Last Backup</span>
              <span className={`text-sm px-2 py-1 rounded-full ${
                backupStatus.status === "success" ? "bg-green-100 text-green-800" :
                backupStatus.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                "bg-red-100 text-red-800"
              }`}>
                {backupStatus.text}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {formatDate(backupInfo?.lastBackup)}
            </p>
            {backupInfo?.nextScheduledBackup && (
              <p className="text-sm text-gray-600 mt-1">
                Next scheduled: {formatDate(backupInfo.nextScheduledBackup)}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Backup Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-green-600" />
            Create Backup
          </CardTitle>
        </CardHeader>
        <CardContent>
          {message.text && (
            <Alert className={message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
              <AlertDescription className={message.type === "success" ? "text-green-800" : "text-red-800"}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => handleCreateBackup("full")}
              disabled={backupLoading}
              className="flex flex-col items-center gap-2 h-24"
            >
              <Database className="h-6 w-6" />
              <span>Full Backup</span>
              <span className="text-xs opacity-75">All data</span>
            </Button>

            <Button
              onClick={() => handleCreateBackup("quotes")}
              disabled={backupLoading}
              variant="outline"
              className="flex flex-col items-center gap-2 h-24"
            >
              <HardDrive className="h-6 w-6" />
              <span>Quotes Only</span>
              <span className="text-xs opacity-75">Quote data</span>
            </Button>

            <Button
              onClick={() => handleCreateBackup("customers")}
              disabled={backupLoading}
              variant="outline"
              className="flex flex-col items-center gap-2 h-24"
            >
              <Shield className="h-6 w-6" />
              <span>Customers Only</span>
              <span className="text-xs opacity-75">Customer data</span>
            </Button>
          </div>

          {backupLoading && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span className="text-sm">Creating backup...</span>
              </div>
              <Progress value={66} className="w-full" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-purple-600" />
            Backup Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup">Automatic Backups</Label>
                    <p className="text-sm text-gray-600">Enable automatic backup creation</p>
                  </div>
                  <Switch
                    id="autoBackup"
                    checked={formData.autoBackup || false}
                    onCheckedChange={(checked) => handleChange("autoBackup", checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select 
                    value={formData.backupFrequency || "daily"} 
                    onValueChange={(value) => handleChange("backupFrequency", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="backupRetention">Retention Period (days)</Label>
                  <Input
                    id="backupRetention"
                    type="number"
                    value={formData.backupRetention || 30}
                    onChange={(e) => handleChange("backupRetention", parseInt(e.target.value))}
                    min="1"
                    max="365"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="backupLocation">Backup Location</Label>
                  <Select 
                    value={formData.backupLocation || "local"} 
                    onValueChange={(value) => handleChange("backupLocation", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local Storage</SelectItem>
                      <SelectItem value="cloud">Cloud Storage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    Regular backups are essential for data protection. We recommend daily backups with at least 30 days retention.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={loading} className="flex items-center gap-2">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                {loading ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
