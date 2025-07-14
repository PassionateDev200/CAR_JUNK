/** route: src/components/offer/OfferCard.jsx */
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Car, Calendar, ArrowRight } from "lucide-react";
import OfferStatus from "./OfferStatus";

export default function OfferCard({ offer }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const daysRemaining = (expiryDate) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 border border-gray-200">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Left Column - Vehicle Info */}
            <div className="p-6 md:col-span-2 flex flex-col md:flex-row gap-4 items-start">
              <div className="flex-shrink-0 bg-gray-100 rounded-lg p-3 hidden md:block">
                <Car className="w-10 h-10 text-gray-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">
                  {offer.vehicle.year} {offer.vehicle.make}{" "}
                  {offer.vehicle.model}
                </h3>
                <div className="text-sm text-gray-500 mt-1">
                  VIN: {offer.vehicle.vin}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="bg-gray-50">
                    {offer.vehicle.mileage.toLocaleString()} miles
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50">
                    {offer.vehicle.condition.charAt(0).toUpperCase() +
                      offer.vehicle.condition.slice(1)}{" "}
                    condition
                  </Badge>
                </div>
              </div>
            </div>

            {/* Middle Column - Offer Details */}
            <div className="p-6 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col">
              <div className="text-2xl font-bold text-green-600">
                ${offer.amount.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Expires: {formatDate(offer.expiresAt)}</span>
                </div>
              </div>
              {daysRemaining(offer.expiresAt) > 0 &&
                offer.status === "pending" && (
                  <Badge className="mt-2 w-fit bg-blue-100 text-blue-800 border-blue-200">
                    {daysRemaining(offer.expiresAt)} days remaining
                  </Badge>
                )}
              <div className="mt-auto pt-3">
                <OfferStatus status={offer.status} />
              </div>
            </div>

            {/* Right Column - Actions */}
            <div className="p-6 bg-gray-50 border-t md:border-t-0 md:border-l border-gray-200 flex flex-col justify-center items-center">
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href={`/offer/${offer.id}`}>
                  View Details
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <p className="text-xs text-gray-500 text-center mt-2">
                {offer.status === "pending"
                  ? "Respond to this offer"
                  : offer.status === "accepted"
                  ? "View pickup details"
                  : "View offer details"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
