/** route: src/app/offer/page.jsx */
"use client";
/**
 *  src/app/offer/page.jsx
 **/
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, AlertCircle, Clock, CheckCircle } from "lucide-react";
import OfferCard from "@/components/offer/OfferCard";

export default function OffersPage() {
  const router = useRouter();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [vinInput, setVinInput] = useState("");

  // Mock data for demonstration
  const mockOffers = [
    {
      id: "offer-123",
      vehicleId: "veh-456",
      amount: 3500,
      status: "pending",
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      vehicle: {
        make: "Toyota",
        model: "Camry",
        year: 2010,
        vin: "1HGCM82633A123456",
        mileage: 120000,
        condition: "good",
      },
    },
    {
      id: "offer-124",
      vehicleId: "veh-457",
      amount: 2800,
      status: "accepted",
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      vehicle: {
        make: "Honda",
        model: "Civic",
        year: 2008,
        vin: "2HGES16364H789012",
        mileage: 150000,
        condition: "fair",
      },
    },
    {
      id: "offer-125",
      vehicleId: "veh-458",
      amount: 1200,
      status: "expired",
      createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      vehicle: {
        make: "Ford",
        model: "Focus",
        year: 2005,
        vin: "3FAHP08Z56R345678",
        mileage: 180000,
        condition: "poor",
      },
    },
  ];

  // Simulate fetching offers
  useEffect(() => {
    // In a real app, you would fetch from your API
    setTimeout(() => {
      setOffers(mockOffers);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // In a real app, you would search by email/VIN in your database
    setLoading(true);

    setTimeout(() => {
      const filteredOffers = mockOffers.filter(
        (offer) =>
          offer.vehicle.vin.toLowerCase().includes(vinInput.toLowerCase()) ||
          emailInput.toLowerCase().includes("user@example.com") // Mock email check
      );

      if (filteredOffers.length === 0) {
        setError("No offers found matching your search criteria.");
      } else {
        setError(null);
      }

      setOffers(filteredOffers);
      setLoading(false);
    }, 1000);
  };

  const filteredOffers = offers.filter(
    (offer) =>
      offer.vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.vehicle.vin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Manage Your Offers
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            View, accept, or revise offers for your vehicle. All offers are
            guaranteed for 7 days from the date they were issued.
          </p>
        </motion.div>

        {/* Search Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <Card className="shadow-lg border-0">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl">Find Your Offer</CardTitle>
              <CardDescription className="text-blue-100">
                Enter your email address and vehicle VIN to locate your offer
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="vin" className="text-sm font-medium">
                      Vehicle VIN
                    </label>
                    <Input
                      id="vin"
                      placeholder="Enter 17-digit VIN"
                      value={vinInput}
                      onChange={(e) => setVinInput(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  Find My Offer
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filter */}
        {offers.length > 0 && (
          <div className="max-w-5xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Filter offers by make, model, or VIN..."
                className="pl-10 h-12 bg-white shadow-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="max-w-5xl mx-auto text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-lg text-gray-600">Loading your offers...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-5xl mx-auto mb-8">
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* No Offers State */}
        {!loading && !error && offers.length === 0 && (
          <div className="max-w-5xl mx-auto text-center py-12 bg-white rounded-xl shadow-md">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Clock className="w-8 h-8 text-gray-500" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Offers Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              We couldn't find any offers associated with the provided
              information. Please check your email and VIN, or get a new quote.
            </p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <a href="/quote">Get a New Quote</a>
            </Button>
          </div>
        )}

        {/* Offers List */}
        {!loading && offers.length > 0 && (
          <div className="max-w-5xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Your Offers
            </h2>

            {filteredOffers.length === 0 ? (
              <div className="text-center py-8 bg-white rounded-xl shadow-md">
                <p className="text-gray-600">
                  No offers match your search criteria.
                </p>
              </div>
            ) : (
              filteredOffers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))
            )}
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-5xl mx-auto mt-16 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-purple-600 text-white p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Need Help?
              </h3>
              <p className="text-blue-100 mb-6">
                Our team is ready to assist you with any questions about your
                offers or the selling process.
              </p>
              <Button
                asChild
                variant="outline"
                className="border-white text-white hover:bg-white/20"
              >
                <a href="/contact">Contact Support</a>
              </Button>
            </div>
            <div className="md:w-2/3 p-6">
              <h3 className="text-xl font-semibold mb-4">Offer Status Guide</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Pending</p>
                    <p className="text-sm text-gray-600">
                      Offer is active and awaiting your response
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Accepted</p>
                    <p className="text-sm text-gray-600">
                      You've accepted this offer and scheduled pickup
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">Expired</p>
                    <p className="text-sm text-gray-600">
                      Offer has expired and is no longer valid
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
