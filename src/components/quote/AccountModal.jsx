/** route: src/components/quote/AccountModal.jsx */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, LogIn, Mail, Lock, X, Eye, EyeOff } from "lucide-react";
import { useVehicle, useVehicleDispatch, vehicleActions } from "@/contexts/VehicleContext";
import { useAuth } from "@/contexts/AuthContext";

export default function AccountModal({ isOpen, onClose, mode = "create", onSuccess }) {
  const vehicleState = useVehicle();
  const dispatch = useVehicleDispatch();
  const { login, register, checkAuth } = useAuth(); // Get auth functions from AuthContext
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    if (!formData.password) {
      setError("Password is required");
      return false;
    }
    if (mode === "create") {
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError("");

    try {
      let data;
      
      if (mode === "create") {
        // Use AuthContext register function
        data = await register({
          email: formData.email,
          password: formData.password,
        });
      } else {
        // Use AuthContext login function
        data = await login(formData.email, formData.password);
      }

      // Persist to context
      dispatch(
        vehicleActions.setSellerInfo({
          name: "",
          email: data.user?.email || formData.email,
          phone: "",
          address: "",
        })
      );

      setSuccess(mode === "create" ? "Account created successfully!" : "Login successful!");
      
      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess(formData);
      }, 1000);

    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || (mode === "create" ? "Registration failed" : "Login failed");
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
    });
    setError("");
    setSuccess("");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-gray-800">
                {mode === "create" ? (
                  <>
                    <User className="w-6 h-6 inline mr-2" />
                    Create Account
                  </>
                ) : (
                  <>
                    <LogIn className="w-6 h-6 inline mr-2" />
                    Login
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {success ? (
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-6 text-center">
                    <div className="text-green-600 text-lg font-semibold mb-2">
                      {success}
                    </div>
                    <p className="text-green-700 text-sm">
                      Redirecting to your quote...
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertDescription className="text-red-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                        Email Address *
                      </Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="pl-10"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    {mode === "create" && (
                      <>
                        <div>
                          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                            Password *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={formData.password}
                              onChange={(e) => handleInputChange("password", e.target.value)}
                              className="pl-10 pr-10"
                              placeholder="Create a password"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                            Confirm Password *
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              value={formData.confirmPassword}
                              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                              className="pl-10 pr-10"
                              placeholder="Confirm your password"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </>
                    )}

                    {mode === "login" && (
                      <div>
                        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                          Password *
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => handleInputChange("password", e.target.value)}
                            className="pl-10 pr-10"
                            placeholder="Enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                    >
                      {isSubmitting ? (
                        "Processing..."
                      ) : (
                        <>
                          {mode === "create" ? (
                            <>
                              <User className="w-5 h-5 mr-2" />
                              Create Account
                            </>
                          ) : (
                            <>
                              <LogIn className="w-5 h-5 mr-2" />
                              Login
                            </>
                          )}
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      onClick={handleClose}
                      variant="ghost"
                      className="w-full text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
