/** route: src/app/manage/[accessToken]/page.jsx */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Car,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import QuoteManager from "@/components/customer/QuoteManager";
import { getQuoteByToken } from "@/lib/quoteApi";

export default function QuoteManagementPage({ params }) {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Resolve params Promise
  useEffect(() => {
    const resolveParams = async () => {
      try {
        const resolvedParams = await params;
        setAccessToken(resolvedParams.accessToken);
      } catch (err) {
        console.error("Error resolving params:", err);
        setError("Invalid access token");
        setLoading(false);
      }
    };

    resolveParams();
  }, [params]);

  // Fetch quote data
  useEffect(() => {
    const fetchQuote = async () => {
      if (!accessToken) return;

      try {
        const result = await getQuoteByToken(accessToken);
        console.log("manage/[accessToken] = Fetched quote:", result);

        if (result.success) {
          setQuote(result.data.quote);
          console.log("result.success ===> ", result.data.quote);
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error("Error fetching quote:", err);
        setError("Failed to load quote. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuote();
  }, [accessToken]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-amber-600" />;
      case "accepted":
      case "pickup_scheduled":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "customer_cancelled":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "rescheduled":
        return <AlertCircle className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "accepted":
        return "Accepted";
      case "pickup_scheduled":
        return "Pickup Scheduled";
      case "customer_cancelled":
        return "Cancelled";
      case "rescheduled":
        return "Rescheduled";
      case "expired":
        return "Expired";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your quote...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center">
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Quote Not Found
              </h2>
              <p className="text-gray-600 mb-6">{error}</p>
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push("/manage")}
                >
                  Try Again
                </Button>
                <Button onClick={() => router.push("/quote")}>
                  Get New Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push("/manage")}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  Quote Management
                </h1>
                <p className="text-gray-600">
                  {quote.vehicleName} • Quote {quote.quoteId}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(quote.status)}
                <span className="font-medium text-gray-700">
                  {getStatusText(quote.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Quote Overview */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-600" />
                Quote Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    ${quote.pricing.finalPrice.toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Offer Amount</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {new Date(quote.createdAt).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-600">Created</p>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {new Date(quote.expiresAt).toLocaleDateString()}
                  </div>
                  <p className="text-sm text-gray-600">Expires</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quote Manager Component */}
          <QuoteManager quote={quote} onQuoteUpdate={setQuote} />
        </motion.div>
      </div>
    </div>
  );
}
