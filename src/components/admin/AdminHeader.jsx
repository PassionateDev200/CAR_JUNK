/** route: src/components/admin/AdminHeader.jsx */
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Search,
  User,
  ChevronDown,
  ExternalLink,
  Home,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminHeader = () => {
  const [admin, setAdmin] = useState(null);
  const [notifications] = useState(3); // Mock notification count
  const router = useRouter();

  useEffect(() => {
    // Load admin data from localStorage or API
    const loadAdminData = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (token) {
          const response = await fetch("/api/admin/auth/verify", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.ok) {
            const data = await response.json();
            setAdmin(data.admin);
          }
        }
      } catch (error) {
        console.error("Failed to load admin data:", error);
      }
    };

    loadAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  const handleBackToSite = () => {
    // Open main site in new tab to preserve admin session
    window.open("/", "_blank");
  };

  const handleGoToSite = () => {
    // Navigate to main site (will lose admin session)
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back to Site + Search */}
          <div className="flex items-center space-x-4">
            {/* Back to Site Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToSite}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 border-gray-300"
              title="Open main site in new tab"
            >
              <ExternalLink className="h-4 w-4" />
              <span className="hidden sm:inline">Visit Site</span>
            </Button>

            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search quotes, customers..."
                  className="pl-10 w-full"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="hidden md:block text-left">
                    <div className="text-sm font-medium">
                      {admin?.name || "Admin User"}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {admin?.role || "Administrator"}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleGoToSite}>
                  <Home className="mr-2 h-4 w-4" />
                  Go to Main Site
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
