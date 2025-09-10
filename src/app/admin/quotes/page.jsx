/** route: src/app/admin/quotes/page.jsx */

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Eye,
  Calendar,
  Phone,
  Mail,
  Car,
  DollarSign,
  Clock,
  User,
  CheckCircle,
  XCircle,
  RotateCcw,
  Ban,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw,
} from "lucide-react";
import axios from "axios";
import QuoteDetailsModal from "@/components/admin/QuoteDetailsModal";

export default function QuotesPage() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get("/api/admin/quotes");
      setQuotes(response.data.quotes || []);
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleViewDetails = (quote) => {
    setSelectedQuote(quote);
    setShowDetailsModal(true);
  };

  const handleApproveQuote = async (quoteId) => {
    try {
      const response = await axios.post("/api/admin/quotes/approve", {
        quoteId: quoteId,
      });

      if (response.data.success) {
        // Refresh the quotes list
        fetchQuotes();
        console.log("Quote approved successfully");
      } else {
        console.error("Failed to approve quote:", response.data.error);
      }
    } catch (error) {
      console.error("Failed to approve quote:", error);
    }
  };

  const handleSchedulePickup = (quote) => {
    // Navigate to pickup scheduling or open modal
    window.open(`/manage/${quote.accessToken}`, '_blank');
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-green-100 text-green-800",
      customer_cancelled: "bg-red-100 text-red-800",
      rescheduled: "bg-blue-100 text-blue-800",
      pickup_scheduled: "bg-purple-100 text-purple-800",
      completed: "bg-gray-100 text-gray-800",
      expired: "bg-gray-100 text-gray-600",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const filteredAndSortedQuotes = quotes
    .filter((quote) => {
      const matchesSearch =
        quote.vehicleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.quoteId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.customer.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || quote.status === statusFilter;

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case "createdAt":
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
        case "finalPrice":
          aValue = a.pricing?.finalPrice || 0;
          bValue = b.pricing?.finalPrice || 0;
          break;
        case "customerName":
          aValue = a.customer.name.toLowerCase();
          bValue = b.customer.name.toLowerCase();
          break;
        case "vehicleName":
          aValue = a.vehicleName.toLowerCase();
          bValue = b.vehicleName.toLowerCase();
          break;
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedQuotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedQuotes = filteredAndSortedQuotes.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
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
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quote Management</h1>
          <p className="text-gray-600 mt-1">
            Manage customer quotes and track their status
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            {filteredAndSortedQuotes.length} quotes found
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchQuotes}
            disabled={refreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search quotes, customers, or vehicles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="customer_cancelled">Customer Cancelled</option>
                <option value="rescheduled">Rescheduled</option>
                <option value="pickup_scheduled">Pickup Scheduled</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="finalPrice">Sort by Price</option>
                <option value="customerName">Sort by Customer</option>
                <option value="vehicleName">Sort by Vehicle</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quotes List */}
      <div className="space-y-4">
        {paginatedQuotes.map((quote) => (
          <Card key={quote._id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Quote Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Car className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{quote.vehicleName}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    Quote: {quote.quoteId}
                  </div>
                  <Badge className={getStatusColor(quote.status)}>
                    {quote.status.replace("_", " ")}
                  </Badge>
                </div>

                {/* Customer Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{quote.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-3 w-3" />
                    <span>{quote.customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-3 w-3" />
                    <span>{quote.customer.phone}</span>
                  </div>
                </div>

                {/* Pricing & Dates */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-purple-600" />
                    <span className="font-medium text-lg">
                      ${quote.pricing.finalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-3 w-3" />
                    <span>
                      Created: {new Date(quote.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {quote.pickupDetails?.scheduledDate && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>
                        Pickup:{" "}
                        {new Date(
                          quote.pickupDetails.scheduledDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => handleViewDetails(quote)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  {quote.status === "pending" && (
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleApproveQuote(quote._id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Quote
                    </Button>
                  )}
                  {quote.status === "accepted" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSchedulePickup(quote)}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Pickup
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedQuotes.length)} of {filteredAndSortedQuotes.length} quotes
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
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {filteredAndSortedQuotes.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">
              No quotes found matching your criteria
            </p>
          </CardContent>
        </Card>
      )}

      {/* Quote Details Modal */}
      <QuoteDetailsModal
        quote={selectedQuote}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
      />
    </div>
  );
}
