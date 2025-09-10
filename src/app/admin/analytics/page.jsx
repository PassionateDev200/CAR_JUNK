/** route: src/app/admin/analytics/page.jsx */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Users,
  Calendar,
  Clock,
  RefreshCw,
  Download,
  Filter,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import SimpleChart from "@/components/admin/SimpleChart";

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [period, setPeriod] = useState("month");

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange, period]);

  const fetchAnalytics = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("/api/admin/analytics", {
        params: {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate,
          period,
        },
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      customer_cancelled: "bg-red-100 text-red-800",
      pickup_scheduled: "bg-purple-100 text-purple-800",
      expired: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />;
      case "customer_cancelled":
        return <XCircle className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Analytics Data
          </h3>
          <p className="text-gray-600">Unable to load analytics data.</p>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const trendsData = analytics.trends?.map(item => ({
    label: item._id,
    value: item.count,
    revenue: item.revenue,
  })) || [];

  const vehicleData = analytics.vehicleAnalysis?.map(item => ({
    label: item._id || "Unknown",
    value: item.count,
    revenue: item.totalValue,
  })) || [];

  const statusData = Object.entries(analytics.statusBreakdown || {}).map(([status, data]) => ({
    label: status.replace("_", " "),
    value: data.count,
    percentage: data.percentage,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor business performance and track key metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchAnalytics}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </header>

      {/* Date Range Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                  className="flex-1"
                />
                <Input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                  className="flex-1"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="day">Daily</option>
                <option value="week">Weekly</option>
                <option value="month">Monthly</option>
                <option value="year">Yearly</option>
              </select>
              <Button
                variant="outline"
                onClick={() => {
                  setDateRange({ startDate: "", endDate: "" });
                  setPeriod("month");
                }}
                className="px-3 py-2"
              >
                Reset
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalMetrics.totalQuotes}</div>
            <p className="text-xs text-gray-600">All time quotes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalMetrics.totalRevenue)}</div>
            <p className="text-xs text-gray-600">Total earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Quote Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(analytics.totalMetrics.avgQuoteValue)}</div>
            <p className="text-xs text-gray-600">Per quote</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.conversionRate}%</div>
            <p className="text-xs text-gray-600">Completed quotes</p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.customerMetrics.totalCustomers}</div>
            <p className="text-xs text-gray-600">Unique customers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Repeat Customers</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.customerMetrics.repeatCustomers}</div>
            <p className="text-xs text-gray-600">
              {analytics.customerMetrics.totalCustomers > 0 
                ? Math.round((analytics.customerMetrics.repeatCustomers / analytics.customerMetrics.totalCustomers) * 100)
                : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pickup Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.pickupCompletionRate}%</div>
            <p className="text-xs text-gray-600">
              {analytics.pickupMetrics.completed} of {analytics.pickupMetrics.totalScheduled} completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quote Trends */}
        <SimpleChart
          title="Quote Trends"
          data={trendsData}
          type="line"
        />

        {/* Status Breakdown */}
        <SimpleChart
          title="Quote Status Breakdown"
          data={statusData}
          type="pie"
        />

        {/* Vehicle Analysis */}
        <SimpleChart
          title="Top Vehicle Makes"
          data={vehicleData}
          type="bar"
        />

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(analytics.conversionFunnel || {}).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status)}
                    <span className="capitalize">{status.replace("_", " ")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{count}</span>
                    <Badge className={getStatusColor(status)}>
                      {analytics.totalMetrics.totalQuotes > 0 
                        ? Math.round((count / analytics.totalMetrics.totalQuotes) * 100)
                        : 0}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quote Value Range */}
        <Card>
          <CardHeader>
            <CardTitle>Quote Value Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Minimum Value</span>
                <span className="font-medium">{formatCurrency(analytics.totalMetrics.minQuoteValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Maximum Value</span>
                <span className="font-medium">{formatCurrency(analytics.totalMetrics.maxQuoteValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Average Value</span>
                <span className="font-medium">{formatCurrency(analytics.totalMetrics.avgQuoteValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="font-bold text-lg">{formatCurrency(analytics.totalMetrics.totalRevenue)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Customers</span>
                <span className="font-medium">{analytics.customerMetrics.totalCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Repeat Customers</span>
                <span className="font-medium">{analytics.customerMetrics.repeatCustomers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Quotes per Customer</span>
                <span className="font-medium">{analytics.customerMetrics.avgQuotesPerCustomer.toFixed(1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Avg Value per Customer</span>
                <span className="font-medium">{formatCurrency(analytics.customerMetrics.avgValuePerCustomer)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date Range Info */}
      {analytics.dateRange && (
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-gray-600 text-center">
              Showing data from{" "}
              {analytics.dateRange.start 
                ? formatDate(analytics.dateRange.start) 
                : "beginning"
              }{" "}
              to{" "}
              {analytics.dateRange.end 
                ? formatDate(analytics.dateRange.end) 
                : "now"
              }
              {" "}({period}ly view)
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
