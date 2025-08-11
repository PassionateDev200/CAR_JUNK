/** route: src/app/manage/page.jsx */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Car,
  Lock,
  Mail,
  HelpCircle,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import axios from "axios";
import {
  validateAndNormalizeAccessToken,
  validateQuoteId,
  normalizeToken,
  sanitizeAccessToken,
  VALIDATION_CONSTANTS,
} from "@/lib/quoteAccess.client";

export default function ManageQuotePage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  const [quoteId, setQuoteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tokenErrors, setTokenErrors] = useState([]);
  const [quoteIdErrors, setQuoteIdErrors] = useState([]);

  // 6-character token validation for direct access
  const handleDirectAccess = async (e) => {
    e.preventDefault();

    if (!accessToken.trim()) {
      setError("Please enter your access token");
      setTokenErrors(["Access token is required"]);
      return;
    }

    const validation = validateAndNormalizeAccessToken(accessToken);
    if (!validation.isValid) {
      setError("Invalid access token format");
      setTokenErrors(validation.errors);
      return;
    }

    setLoading(true);
    setError("");
    setTokenErrors([]);

    try {
      router.push(`/manage/${validation.normalizedToken}`);
    } catch (err) {
      setError("Failed to access quote. Please try again.");
      setLoading(false);
    }
  };

  // Email + quote ID lookup with validation
  const handleEmailQuoteAccess = async (e) => {
    e.preventDefault();
    setError("");
    setQuoteIdErrors([]);

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    if (!quoteId.trim()) {
      setError("Please enter your Quote ID");
      setQuoteIdErrors(["Quote ID is required"]);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }

    const normalizedQuoteId = normalizeToken(quoteId);
    if (!validateQuoteId(normalizedQuoteId)) {
      setError("Invalid Quote ID format");
      setQuoteIdErrors([
        normalizedQuoteId.length !== 6
          ? `Quote ID must be exactly 6 characters (currently ${normalizedQuoteId.length})`
          : "Quote ID can only contain letters A-Z and numbers 0-9",
      ]);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post("/api/quote/lookup", {
        email: email.trim().toLowerCase(),
        quoteId: normalizedQuoteId,
      });
      const { accessToken } = response.data;
      if (accessToken) {
        router.push(`/manage/${accessToken}`);
      } else {
        throw new Error("Access token not found in response");
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Quote not found. Please check your email and Quote ID.");
      } else if (err.response?.status === 410) {
        setError(
          "This quote has expired. Please get a new quote if you're still interested."
        );
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to find quote. Please try again or contact support.");
      }
      setLoading(false);
    }
  };

  // Handle access token input with real-time validation
  const handleAccessTokenChange = (e) => {
    const input = e.target.value;
    const sanitized = sanitizeAccessToken(input);
    setAccessToken(sanitized);
    if (tokenErrors.length > 0) setTokenErrors([]);
    if (error && error.includes("access token")) setError("");
  };

  // Handle Quote ID input with real-time validation
  const handleQuoteIdChange = (e) => {
    const input = e.target.value;
    const sanitized = sanitizeAccessToken(input);
    setQuoteId(sanitized);
    if (quoteIdErrors.length > 0) setQuoteIdErrors([]);
    if (error && error.includes("Quote ID")) setError("");
  };

  // Real-time validation feedback
  const ValidationFeedback = ({ errors, isValid, value }) => {
    if (!value || value.length === 0) return null;
    return (
      <div className="mt-2">
        {isValid ? (
          <div className="flex items-center gap-2 text-green-600 text-sm">
            <CheckCircle className="h-4 w-4" />
            <span>Valid format</span>
          </div>
        ) : (
          <div className="space-y-1">
            {errors.map((error, index) => (
              <div
                key={index}
                className="flex items-center gap-2 text-red-600 text-sm"
              >
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Car className="h-8 w-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">
                Manage Your Quote
              </h1>
            </div>
            <p className="text-gray-600 max-w-md mx-auto">
              Access your quote to cancel, reschedule pickup, or update your
              information.
            </p>
          </div>

          {/* Direct Access Token Method */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-blue-600" />
                Quick Access
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDirectAccess} className="space-y-4">
                <div>
                  <Label htmlFor="accessToken">Access Token</Label>
                  <Input
                    id="accessToken"
                    type="text"
                    placeholder="Enter your 6-character access token (e.g., A7K9M2)"
                    value={accessToken}
                    onChange={handleAccessTokenChange}
                    maxLength={VALIDATION_CONSTANTS.ACCESS_TOKEN_LENGTH}
                    className={`font-mono text-lg tracking-wider ${
                      accessToken.length > 0 &&
                      validateAndNormalizeAccessToken(accessToken).isValid
                        ? "border-green-500 focus:border-green-500"
                        : accessToken.length > 0
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500">
                      Found in your quote confirmation email (6 characters)
                    </p>
                    <span
                      className={`text-xs ${
                        accessToken.length ===
                        VALIDATION_CONSTANTS.ACCESS_TOKEN_LENGTH
                          ? "text-green-600"
                          : accessToken.length >
                            VALIDATION_CONSTANTS.ACCESS_TOKEN_LENGTH
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {accessToken.length}/
                      {VALIDATION_CONSTANTS.ACCESS_TOKEN_LENGTH}
                    </span>
                  </div>
                  <ValidationFeedback
                    errors={tokenErrors}
                    isValid={
                      accessToken.length > 0 &&
                      validateAndNormalizeAccessToken(accessToken).isValid
                    }
                    value={accessToken}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    loading ||
                    (accessToken.length > 0 &&
                      !validateAndNormalizeAccessToken(accessToken).isValid)
                  }
                >
                  {loading ? "Accessing..." : "Access My Quote"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
          </div>

          {/* Email + Quote ID Method */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-blue-600" />
                Find My Quote
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailQuoteAccess} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error && error.includes("email")) setError("");
                    }}
                    className={
                      email.length > 0 &&
                      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                        ? "border-green-500 focus:border-green-500"
                        : email.length > 0
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="quoteId">Quote ID</Label>
                  <Input
                    id="quoteId"
                    type="text"
                    placeholder="Enter your 6-character Quote ID (e.g., X4B8N6)"
                    value={quoteId}
                    onChange={handleQuoteIdChange}
                    maxLength={VALIDATION_CONSTANTS.QUOTE_ID_LENGTH}
                    className={`font-mono text-lg tracking-wider ${
                      quoteId.length > 0 &&
                      validateQuoteId(normalizeToken(quoteId))
                        ? "border-green-500 focus:border-green-500"
                        : quoteId.length > 0
                        ? "border-red-500 focus:border-red-500"
                        : ""
                    }`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-sm text-gray-500">
                      Found in your quote confirmation email (6 characters)
                    </p>
                    <span
                      className={`text-xs ${
                        quoteId.length === VALIDATION_CONSTANTS.QUOTE_ID_LENGTH
                          ? "text-green-600"
                          : quoteId.length >
                            VALIDATION_CONSTANTS.QUOTE_ID_LENGTH
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {quoteId.length}/{VALIDATION_CONSTANTS.QUOTE_ID_LENGTH}
                    </span>
                  </div>
                  <ValidationFeedback
                    errors={quoteIdErrors}
                    isValid={
                      quoteId.length > 0 &&
                      validateQuoteId(normalizeToken(quoteId))
                    }
                    value={quoteId}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    loading ||
                    !email.trim() ||
                    !quoteId.trim() ||
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
                    !validateQuoteId(normalizeToken(quoteId))
                  }
                >
                  {loading ? "Searching..." : "Find My Quote"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Alert className="border-red-200 bg-red-50 mb-6">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Help Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-700 mb-2">
                  Can't find your access information?
                </p>
                <ul className="text-gray-600 space-y-1 list-disc list-inside">
                  <li>Check your email for the quote confirmation</li>
                  <li>
                    Look for the subject line starting with "Your Cash Offer"
                  </li>
                  <li>The 6-character access token is in the email body</li>
                  <li>
                    Quote ID is also 6 characters (letters and numbers only)
                  </li>
                </ul>
              </div>
              <Separator />
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">
                  Format Examples:
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-blue-700">Access Token:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded text-blue-800">
                      A7K9M2
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-700">Quote ID:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded text-blue-800">
                      X4B8N6
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Still need assistance?
                </p>
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
