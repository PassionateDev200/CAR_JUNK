/** route: src/components/quote/PriceModal.jsx */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, User, LogIn, X, Car, CheckCircle } from "lucide-react";
import { useVehicle } from "@/contexts/VehicleContext";

export default function PriceModal({ isOpen, onClose, onCreateAccount, onLogin }) {
  const vehicleState = useVehicle();
  const { vehicleDetails, pricing } = vehicleState;

  const vehicleName = `${vehicleDetails.year} ${vehicleDetails.make} ${vehicleDetails.model}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-center text-2xl font-bold text-gray-800">
                🎉 Your Car's Value
              </DialogTitle>
            </DialogHeader>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              {/* Vehicle Info */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Car className="w-6 h-6 text-blue-600 mr-2" />
                    <span className="font-semibold text-blue-800">{vehicleName}</span>
                  </div>
                  <p className="text-sm text-blue-600">Based on your assessment</p>
                </CardContent>
              </Card>

              {/* Price Display */}
              <Card className="bg-green-50 border-2 border-green-200">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <DollarSign className="w-8 h-8 text-green-600 mr-2" />
                    <span className="text-4xl font-bold text-green-600">
                      ${pricing.currentPrice?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-lg font-semibold text-green-700">Cash Offer</p>
                  <p className="text-sm text-green-600 mt-1">
                    Free pickup • Cash on the spot
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <div className="text-center mb-4">
                  <p className="text-gray-600 text-sm">
                    Create an account or log in to get your official quote and manage your offer
                  </p>
                </div>

                <Button
                  onClick={onCreateAccount}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold"
                >
                  <User className="w-5 h-5 mr-2" />
                  Create Account
                </Button>

                <Button
                  onClick={onLogin}
                  variant="outline"
                  className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 py-3 text-lg font-semibold"
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  Login
                </Button>

                <Button
                  onClick={onClose}
                  variant="ghost"
                  className="w-full text-gray-500 hover:text-gray-700 py-2"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>

              {/* Benefits */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                  What you get with an account:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Official quote with pickup scheduling</li>
                  <li>• Manage your offer anytime</li>
                  <li>• Reschedule or cancel pickup</li>
                  <li>• Track your quote status</li>
                </ul>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}



