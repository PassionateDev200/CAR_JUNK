/** route: src/app/admin/pickups/page.jsx */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Truck,
  MapPin,
  Clock,
  Search,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  Mail,
  Car,
  DollarSign,
  Filter,
} from "lucide-react";
import axios from "axios";
import PickupDetailsModal from "@/components/admin/PickupDetailsModal";

export default function PickupsManagement() {
  const [pickups, setPickups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [currentPage, searchTerm, dateFilter]);

  const fetchData = async () => {
    try {
      setRefreshing(true);
      const [pickupsResponse, statsResponse] = await Promise.all([
        axios.get("/api/admin/pickups", {
          params: {
            search: searchTerm,
            date: dateFilter,
            page: currentPage,
            limit: itemsPerPage,
          },
        }),
        axios.get("/api/admin/pickups/stats"),
      ]);

      setPickups(pickupsResponse.data.pickups || []);
      setStats(statsResponse.data);
    } catch (error) {
      console.error("Failed to fetch pickup data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleViewDetails = (pickup) => {
    setSelectedPickup(pickup);
    setShowDetailsModal(true);
  };

  const handlePickupComplete = (completedPickup) => {
    // Update the pickup in the list
    setPickups(prevPickups => 
      prevPickups.map(pickup => 
        pickup._id === completedPickup._id 
          ? { ...pickup, status: completedPickup.status }
          : pickup
      )
    );
    // Refresh data to get updated stats
    fetchData();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const isOverdue = (scheduledDate) => {
    return new Date(scheduledDate) < new Date();
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
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pickup Management</h1>
          <p className="text-gray-600 mt-1">
            Manage vehicle pickup schedules and track completion
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {stats?.todaysPickups || 0} pickups today
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchData}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Pickups</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.todaysPickups || 0}</div>
            <p className="text-xs text-gray-600">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Truck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.thisWeekPickups || 0}</div>
            <p className="text-xs text-gray-600">Total scheduled</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.completedThisMonth || 0}</div>
            <p className="text-xs text-gray-600">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.overduePickups || 0}</div>
            <p className="text-xs text-gray-600">Need attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search pickups by customer name, vehicle, or quote ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
              <Button
                variant="outline"
                onClick={() => {
                  setDateFilter("");
                  setSearchTerm("");
                }}
                className="px-3 py-2"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pickups List */}
      <div className="space-y-4">
        {pickups.map((pickup) => (
          <Card key={pickup._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4">
                {/* Pickup Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{formatDate(pickup.pickupDetails.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(pickup.pickupDetails.scheduledDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{pickup.pickupDetails.timeSlot}</span>
                  </div>
                  {isOverdue(pickup.pickupDetails.scheduledDate) && (
                    <Badge className="bg-red-100 text-red-800 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      Overdue
                    </Badge>
                  )}
                </div>

                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{pickup.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{pickup.customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span className="truncate">{pickup.customer.email}</span>
                  </div>
                </div>

                {/* Vehicle Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{pickup.vehicleName}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Quote: {pickup.quoteId}
                  </div>
                  {pickup.vin && (
                    <div className="text-sm text-gray-600 font-mono">
                      VIN: {pickup.vin.slice(0, 8)}...
                    </div>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-600" />
                    <span className="font-medium">Pickup Location</span>
                  </div>
                  {pickup.customer.address ? (
                    <div className="text-sm text-gray-600">
                      {pickup.customer.address}
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 italic">
                      Address not provided
                    </div>
                  )}
                  {pickup.pickupDetails.specialInstructions && (
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {pickup.pickupDetails.specialInstructions}
                    </div>
                  )}
                </div>

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Final Price</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {formatCurrency(pickup.pricing.finalPrice)}
                  </div>
                  <div className="text-sm text-gray-600">
                    Base: {formatCurrency(pickup.pricing.basePrice)}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => handleViewDetails(pickup)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(`tel:${pickup.customer.phone}`, '_blank')}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call Customer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => window.open(`mailto:${pickup.customer.email}`, '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {pickups.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {pickups.length} pickups
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={pickups.length < itemsPerPage}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {pickups.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No pickups found
            </h3>
            <p className="text-gray-600">
              {searchTerm || dateFilter 
                ? "Try adjusting your search or filter criteria."
                : "No pickups are currently scheduled."
              }
            </p>
          </CardContent>
        </Card>
      )}

      {/* Pickup Details Modal */}
      <PickupDetailsModal
        pickup={selectedPickup}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onPickupComplete={handlePickupComplete}
      />
    </div>
  );
}
