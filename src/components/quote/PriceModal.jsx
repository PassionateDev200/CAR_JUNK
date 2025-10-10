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
              {/* Price Display */}
              <Card className="bg-green-50 border-2 border-green-200">
                <CardContent className="p-6 text-center">
                  <p className="text-lg text-gray-700 mb-3">
                    We'd love to buy your <span className="font-semibold">{vehicleName}</span> for
                  </p>
                  <div className="flex items-center justify-center mb-2">
                    <span className="text-5xl font-bold text-green-600">
                      ${pricing.currentPrice?.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    Free pickup • Payment on the spot
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

              {/* Informational Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {/* How did we reach this offer? */}
                <Card className="bg-blue-50 border border-blue-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-blue-900 mb-2 text-sm">
                      How did we reach ${pricing.currentPrice?.toLocaleString()}?
                    </h4>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      The three main criteria we use to calculate our offers are market value, vehicle condition, and documentation (like title status).
                    </p>
                    <button className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2 underline">
                      What affects an offer calculation?
                    </button>
                  </CardContent>
                </Card>

                {/* What happens next? */}
                <Card className="bg-green-50 border border-green-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-green-900 mb-2 text-sm">
                      What happens next?
                    </h4>
                    <p className="text-xs text-green-800 leading-relaxed">
                      If you haven't already created an account, you'll do that. Then, you'll let us know how to pay and when to pick that car up. Easy peasy.
                    </p>
                    <button className="text-xs text-green-600 hover:text-green-700 font-medium mt-2 underline">
                      What are the next steps?
                    </button>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}



