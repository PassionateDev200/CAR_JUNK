/**route: src/app/admin/page.jsx */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  FileText,
  Users,
  Calendar,
  AlertCircle,
  TrendingUp,
  Bell,
  Car,
  Mail,
  Phone,
  Clock,
  User,
  Ban,
  RotateCcw,
  CheckCircle,
  XCircle,
  RefreshCw,
  Activity,
  Eye,
  Filter,
} from "lucide-react";
import axios from "axios";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentActions, setRecentActions] = useState([]);
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchDashboardData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      handleRefresh();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, actionsResponse, quotesResponse] =
        await Promise.all([
          axios.get("/api/admin/dashboard"),
          axios.get("/api/admin/recent-actions"),
          axios.get("/api/admin/quotes?limit=5"),
        ]);

      setStats(statsResponse.data);
      setRecentActions(actionsResponse.data.actions || []);
      setRecentQuotes(quotesResponse.data.quotes || []);

      // Generate notifications from recent actions
      generateNotifications(actionsResponse.data.actions || []);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
    setLastRefresh(new Date());
    setRefreshing(false);
  };

  const generateNotifications = (actions) => {
    const alerts = actions
      .filter((action) => {
        const actionTime = new Date(action.timestamp);
        const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
        return actionTime > hourAgo;
      })
      .slice(0, 3)
      .map((action) => ({
        id: action.quoteId + action.timestamp,
        type: action.action === "cancelled" ? "error" : "warning",
        title: getNotificationTitle(action),
        message: `${action.customerName} - ${action.vehicleName}`,
        timestamp: action.timestamp,
        quoteId: action.quoteId,
      }));

    setNotifications(alerts);
  };

  const getNotificationTitle = (action) => {
    switch (action.action) {
      case "cancelled":
        return "Quote Cancelled";
      case "rescheduled":
        return "Pickup Rescheduled";
      case "pickup_scheduled":
        return "Pickup Scheduled";
      case "modified":
        return "Info Updated";
      default:
        return "Customer Action";
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      accepted: "bg-green-100 text-green-800 border-green-200",
      customer_cancelled: "bg-red-100 text-red-800 border-red-200",
      rescheduled: "bg-blue-100 text-blue-800 border-blue-200",
      pickup_scheduled: "bg-purple-100 text-purple-800 border-purple-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
      expired: "bg-gray-100 text-gray-600 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "cancelled":
        return <Ban className="h-4 w-4 text-red-600" />;
      case "rescheduled":
        return <RotateCcw className="h-4 w-4 text-blue-600" />;
      case "pickup_scheduled":
        return <Calendar className="h-4 w-4 text-purple-600" />;
      case "modified":
        return <User className="h-4 w-4 text-orange-600" />;
      case "created":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  // Filter data based on search query
  const filteredActions = recentActions.filter((action) =>
    searchQuery === "" ||
    action.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    action.action.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredQuotes = recentQuotes.filter((quote) =>
    searchQuery === "" ||
    quote.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.vehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    quote.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const dashboardStats = [
    {
      title: "Total Quotes",
      value: stats?.totalQuotes || 0,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: "+12% from last month",
    },
    {
      title: "Active Customers",
      value: stats?.activeCustomers || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8% from last month",
    },
    {
      title: "Scheduled Pickups",
      value: stats?.scheduledPickups || 0,
      icon: Calendar,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "3 this week",
    },
    {
      title: "Revenue (Month)",
      value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "+15% from last month",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome to the PNW Cash For Cars admin panel
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search quotes, customers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <span className="text-sm text-gray-500">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </header>

      {/* Notifications */}
      {notifications.length > 0 && (
        <Alert className="border-amber-200 bg-amber-50">
          <Bell className="h-4 w-4 text-amber-600" />
          <AlertDescription>
            <div className="space-y-2">
              <div className="font-medium text-amber-800">
                Recent Customer Actions
              </div>
              {notifications.map((notification) => (
                <div key={notification.id} className="text-sm text-amber-700">
                  <strong>{notification.title}:</strong> {notification.message}
                </div>
              ))}
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Real-time Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {dashboardStats.map(
          ({ title, value, icon: Icon, color, bgColor, change }) => (
            <Card key={title} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-3xl font-bold">{value}</p>
                  <p className="text-xs text-gray-600">{change}</p>
                </div>
              </CardContent>
            </Card>
          )
        )}
      </section>

      {/* Main Content Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Activity Feed */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Live Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredActions.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredActions.slice(0, 8).map((action, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/quotes?search=${action.quoteId}`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(action.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate">
                          {action.customerName}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {new Date(action.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">
                        {action.action} - {action.vehicleName}
                      </p>
                      {action.reason && (
                        <p className="text-xs text-gray-500 mt-1">
                          Reason: {action.reason.replace(/_/g, " ")}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? "No matching activity found" : "No recent activity"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Quotes */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Recent Quotes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredQuotes.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredQuotes.map((quote) => (
                  <div
                    key={quote._id}
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => window.location.href = `/admin/quotes?search=${quote.quoteId}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-sm">
                          {quote.vehicleName}
                        </span>
                      </div>
                      <Badge className={getStatusColor(quote.status)}>
                        {quote.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <User className="h-3 w-3" />
                        <span>{quote.customer.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <DollarSign className="h-3 w-3" />
                          <span>
                            ${quote.pricing.finalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {new Date(quote.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchQuery ? "No matching quotes found" : "No recent quotes"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto p-4"
                onClick={() =>
                  (window.location.href = "/admin/quotes?status=pending")
                }
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-blue-800">
                      View Pending Quotes
                    </div>
                    <div className="text-sm text-blue-600">
                      Manage new submissions
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => (window.location.href = "/admin/pickups")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium text-orange-800">
                      Schedule Pickups
                    </div>
                    <div className="text-sm text-orange-600">
                      Coordinate collections
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => (window.location.href = "/admin/customers")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-green-800">
                      Customer Management
                    </div>
                    <div className="text-sm text-green-600">
                      View communications
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto p-4"
                onClick={() => (window.location.href = "/admin/analytics")}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-purple-800">
                      View Analytics
                    </div>
                    <div className="text-sm text-purple-600">
                      Business insights
                    </div>
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto p-4"
                onClick={() =>
                  (window.location.href =
                    "/admin/quotes?status=customer_cancelled")
                }
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-50 rounded-lg">
                    <XCircle className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <div className="font-medium text-red-800">
                      Cancelled Quotes
                    </div>
                    <div className="text-sm text-red-600">
                      Review cancellations
                    </div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Status Summary */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Quote Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {[
                {
                  status: "pending",
                  count: stats?.statusCounts?.pending || 0,
                  color: "text-yellow-600",
                },
                {
                  status: "accepted",
                  count: stats?.statusCounts?.accepted || 0,
                  color: "text-green-600",
                },
                {
                  status: "customer_cancelled",
                  count: stats?.statusCounts?.customer_cancelled || 0,
                  color: "text-red-600",
                },
                {
                  status: "rescheduled",
                  count: stats?.statusCounts?.rescheduled || 0,
                  color: "text-blue-600",
                },
                {
                  status: "pickup_scheduled",
                  count: stats?.statusCounts?.pickup_scheduled || 0,
                  color: "text-purple-600",
                },
                {
                  status: "completed",
                  count: stats?.statusCounts?.completed || 0,
                  color: "text-gray-600",
                },
                {
                  status: "expired",
                  count: stats?.statusCounts?.expired || 0,
                  color: "text-gray-500",
                },
              ].map(({ status, count, color }) => (
                <div key={status} className="text-center">
                  <div className={`text-2xl font-bold ${color}`}>{count}</div>
                  <div className="text-xs text-gray-600 capitalize">
                    {status.replace("_", " ")}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
