/** route: src/app/admin/login/page.jsx */
"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Mail, LogIn, ArrowLeft, Home } from "lucide-react";
import axios from "@/lib/axios";

// Simple loading fallback
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
    </div>
  );
}

// Main login component without useSearchParams
function AdminLoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if already authenticated
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) {
      router.push("/admin");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/api/admin/auth/login", {
        email,
        password,
      });

      localStorage.setItem("adminToken", response.data.token);
      router.push("/admin");
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToSite = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {/* Back to Site Button */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSite}
              className="text-gray-500 hover:text-gray-700 p-2"
              title="Back to Home"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="text-xs">Home</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleBackToSite}
              className="text-gray-500 hover:text-gray-700 p-2"
              title="Go to Homepage"
            >
              <Home className="h-4 w-4" />
            </Button>
          </div>

          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Admin Login</CardTitle>
          <p className="text-gray-600">PNW Cash For Cars Admin Panel</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@pnwcashforcars.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <LogIn className="h-4 w-4 mr-2" />
              )}
              {loading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Test Credentials */}
          <div className="mt-6 p-3 bg-gray-100 rounded-lg text-xs">
            <p className="font-medium text-gray-700">Test Credentials:</p>
            <p className="text-gray-600">Email: admin@pnwcashforcars.com</p>
            <p className="text-gray-600">Password: TempPassword123!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main export with Suspense wrapper
export default function AdminLogin() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminLoginContent />
    </Suspense>
  );
}
