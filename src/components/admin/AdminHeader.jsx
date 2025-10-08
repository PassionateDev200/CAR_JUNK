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
  X,
  Clock,
  AlertCircle,
  CheckCircle,
  Calendar,
  Ban,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "@/lib/axios";

const AdminHeader = () => {
  const [admin, setAdmin] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const router = useRouter();

  // Simple localStorage key for last read timestamp
  const LAST_READ_KEY = "admin_notifications_last_read";

  useEffect(() => {
    loadAdminData();
    fetchNotifications();

    // Set up periodic notification refresh
    const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAdminData = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (token) {
        const response = await axios.get("/api/admin/auth/verify", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAdmin(response.data.admin);
      }
    } catch (error) {
      console.error("Failed to load admin data:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get("/api/admin/notifications");
      const notificationData = response.data.notifications || [];

      // Get last read timestamp from localStorage
      const lastReadTimestamp = localStorage.getItem(LAST_READ_KEY);
      const lastReadTime = lastReadTimestamp
        ? new Date(lastReadTimestamp)
        : new Date(0);

      // Calculate unread count based on timestamp
      const unread = notificationData.filter(
        (notification) => new Date(notification.timestamp) > lastReadTime
      ).length;

      setNotifications(notificationData);
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleNotificationClick = () => {
    if (!notificationOpen) {
      // Opening notification panel - mark all as read
      const now = new Date().toISOString();
      localStorage.setItem(LAST_READ_KEY, now);
      setUnreadCount(0); // Reset count immediately
    }
    setNotificationOpen(!notificationOpen);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "cancelled":
        return <Ban className="h-4 w-4 text-red-600" />;
      case "rescheduled":
        return <RotateCcw className="h-4 w-4 text-blue-600" />;
      case "created":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "modified":
        return <User className="h-4 w-4 text-orange-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationTitle = (type) => {
    switch (type) {
      case "cancelled":
        return "Quote Cancelled";
      case "rescheduled":
        return "Pickup Rescheduled";
      case "created":
        return "New Quote Submitted";
      case "modified":
        return "Contact Info Updated";
      default:
        return "Customer Action";
    }
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const isNotificationUnread = (notification) => {
    const lastReadTimestamp = localStorage.getItem(LAST_READ_KEY);
    if (!lastReadTimestamp) return true;

    const lastReadTime = new Date(lastReadTimestamp);
    const notificationTime = new Date(notification.timestamp);

    return notificationTime > lastReadTime;
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  };

  const handleBackToSite = () => {
    window.open("/", "_blank");
  };

  const handleGoToSite = () => {
    window.location.href = "/";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Back to Site + Search */}
          <div className="flex items-center space-x-4">
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
            {/* Simple Notifications */}
            <Popover open={notificationOpen} onOpenChange={setNotificationOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                  onClick={handleNotificationClick}
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-0"
                align="end"
                side="bottom"
                sideOffset={8}
              >
                <div className="bg-white rounded-lg shadow-lg border">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold text-gray-900">
                      Notifications
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNotificationOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length > 0 ? (
                      <div className="divide-y divide-gray-100">
                        {notifications
                          .slice(0, 10)
                          .map((notification, index) => {
                            const isUnread = isNotificationUnread(notification);
                            return (
                              <div
                                key={`${notification.quoteId}-${index}`}
                                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                                  isUnread
                                    ? "bg-blue-50 border-l-2 border-l-blue-500"
                                    : ""
                                }`}
                                onClick={() => {
                                  router.push("/admin/quotes");
                                  setNotificationOpen(false);
                                }}
                              >
                                <div className="flex items-start space-x-3">
                                  <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                      <p className="text-sm font-medium text-gray-900">
                                        {getNotificationTitle(
                                          notification.type
                                        )}
                                      </p>
                                      <div className="flex items-center gap-2">
                                        {isUnread && (
                                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        )}
                                        <span className="text-xs text-gray-500">
                                          {formatTimeAgo(
                                            notification.timestamp
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">
                                      <strong>
                                        {notification.customerName}
                                      </strong>{" "}
                                      - {notification.vehicleName}
                                    </p>
                                    <p className="text-xs text-gray-600 mt-1">
                                      Quote: {notification.quoteId}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No notifications yet</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Customer actions will appear here
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="p-3 border-t bg-gray-50">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-sm text-blue-600 hover:text-blue-800"
                        onClick={() => {
                          router.push("/admin/quotes");
                          setNotificationOpen(false);
                        }}
                      >
                        View all quotes
                      </Button>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            {/* User Menu - Original functionality preserved */}
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
