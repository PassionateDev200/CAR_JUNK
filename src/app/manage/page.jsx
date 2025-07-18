/** route: src/app/manage/page.jsx*/
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
import { Search, Car, Lock, Mail, HelpCircle } from "lucide-react";
import axios from "axios"; // ✅ Import axios

export default function ManageQuotePage() {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState("");
  const [email, setEmail] = useState("");
  const [quoteId, setQuoteId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDirectAccess = async (e) => {
    e.preventDefault();

    if (!accessToken.trim()) {
      setError("Please enter your access token");
      return;
    }

    if (accessToken.length !== 16) {
      setError("Access token must be 16 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Validate token format
      const tokenPattern = /^[a-zA-Z0-9]{16}$/;
      if (!tokenPattern.test(accessToken)) {
        setError("Invalid access token format");
        setLoading(false);
        return;
      }

      // Redirect to quote management page
      router.push(`/manage/${accessToken}`);
    } catch (err) {
      setError("Invalid access token");
      setLoading(false);
    }
  };

  // ✅ Updated to use axios
  const handleEmailQuoteAccess = async (e) => {
    e.preventDefault();

    if (!email.trim() || !quoteId.trim()) {
      setError("Please enter both email and quote ID");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Using axios instead of fetch
      const response = await axios.post("/api/quote/lookup", {
        email: email.trim(),
        quoteId: quoteId.trim(),
      });
      console.log(
        "manage/page ==> handleEmailQuoteAccess response:",
        response.data
      );
      // ✅ Axios automatically parses JSON response
      const { accessToken } = response.data;

      if (accessToken) {
        router.push(`/manage/${accessToken}`);
      } else {
        throw new Error("Access token not found in response");
      }
    } catch (err) {
      console.error("Quote lookup error:", err);

      // ✅ Better error handling for axios
      if (err.response?.status === 404) {
        setError("Quote not found. Please check your email and quote ID.");
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to find quote. Please try again or contact support.");
      }
      setLoading(false);
    }
  };

  // ... rest of your component remains the same
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
                    placeholder="Enter your 16-character access token"
                    value={accessToken}
                    onChange={(e) => setAccessToken(e.target.value.trim())}
                    maxLength={16}
                    className="font-mono"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Found in your quote confirmation email
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="quoteId">Quote ID</Label>
                  <Input
                    id="quoteId"
                    type="text"
                    placeholder="Q-1234567890-ABCD"
                    value={quoteId}
                    onChange={(e) => setQuoteId(e.target.value)}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Found in your quote confirmation email
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Searching..." : "Find My Quote"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <Alert className="border-red-200 bg-red-50 mb-6">
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
                  <li>The access token is in the email body</li>
                </ul>
              </div>

              <Separator />

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
