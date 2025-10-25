/** route: src/contexts/AuthContext.jsx */
"use client";

import { createContext, useContext, useState, useEffect } from "react";
import axios from "@/lib/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (retryCount = 0) => {
    try {
      const response = await axios.get("/api/auth/me");
      console.log("Auth check response:", response.data);
      if (response.data.authenticated && response.data.user) {
        setUser(response.data.user);
      } else {
        console.log("Not authenticated - no user data");
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check error:", error);
      
      // Retry once if it's a network error and we haven't retried yet
      if (retryCount === 0 && (error.code === 'NETWORK_ERROR' || error.message.includes('timeout'))) {
        console.log("Retrying auth check...");
        setTimeout(() => checkAuth(1), 1000);
        return;
      }
      
      console.log("Not authenticated - error occurred");
      setUser(null);
    } finally {
      if (retryCount === 0) {
        setLoading(false);
      }
    }
  };

  const login = async (email, password) => {
    const response = await axios.post("/api/auth/login", { email, password });
    setUser(response.data.user);
    return response.data;
  };

  const register = async (userData) => {
    const response = await axios.post("/api/auth/register", userData);
    setUser(response.data.user);
    return response.data;
  };

  const logout = async () => {
    try {
      await axios.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;


