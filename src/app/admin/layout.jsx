/** route: src/app/admin/layout.jsx */
"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { AdminProvider } from "@/contexts/AdminContext";

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Don't wrap login page with admin layout
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }
    verifyAuth();
  }, [isLoginPage]);

  async function verifyAuth() {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const res = await fetch("/api/admin/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem("adminToken");
        router.push("/admin/login");
      }
    } catch {
      localStorage.removeItem("adminToken");
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }

  if (isLoginPage) {
    // Render login page without sidebar/header
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // or a fallback UI
  }

  return (
    <AdminProvider>
      <div className="min-h-screen bg-gray-100 flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col lg:pl-64">
          <AdminHeader />
          <main className="flex-grow p-6 max-w-7xl mx-auto">{children}</main>
        </div>
      </div>
    </AdminProvider>
  );
}
