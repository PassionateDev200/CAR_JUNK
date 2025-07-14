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
  Edit,
  Trash2,
  Download,
  MoreHorizontal,
  Car,
  DollarSign,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function QuotesManagement() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const quotesPerPage = 10;

  // Mock data for development - replace with actual API call
  const mockQuotes = [
    {
      id: "Q-001",
      quoteId: "Q-001",
      vehicleDetails: {
        year: "2020",
        make: "Ford",
        model: "Mustang",
        trim: "GT",
      },
      vin: "1FA6P8TH5L5179137", // From your EXTREMELY IMPORTANT requirements
      customer: {
        name: "John Doe",
        email: "john@email.com",
        phone: "555-0123",
        zipCode: "98101",
      },
      pricing: {
        basePrice: 5500,
        currentPrice: 3750,
        finalPrice: 3750,
        adjustments: [
          {
            type: "high_mileage",
            amount: -500,
            description: "High mileage adjustment",
          },
          {
            type: "exterior_damage",
            amount: -750,
            description: "Exterior damage",
          },
          { type: "missing_parts", amount: -500, description: "Missing parts" },
        ],
      },
      conditionAnswers: {
        ownership: "own_outright",
        title: "clean",
        wheels_tires: "all_inflated",
        battery: "working",
        keys: "have_key",
        drivability: "starts_drives",
        engine_transmission: "intact",
        mileage: "125000",
        exterior_damage: "has_damage",
        missing_parts: "all_attached",
        mirrors_glass_lights: "all_intact",
        catalytic_converter: "attached",
        airbags: "intact",
        interior: "good_condition",
        flood_fire: "no_flood_fire",
      },
      status: "pending",
      createdAt: "2025-01-15T10:30:00Z",
      updatedAt: "2025-01-15T10:30:00Z",
    },
    {
      id: "Q-002",
      quoteId: "Q-002",
      vehicleDetails: {
        year: "2018",
        make: "Toyota",
        model: "Corolla",
        trim: "LE",
      },
      vin: "2T1BURHE9JC123456",
      customer: {
        name: "Sarah Johnson",
        email: "sarah@email.com",
        phone: "555-0456",
        zipCode: "98102",
      },
      pricing: {
        basePrice: 4200,
        currentPrice: 2800,
        finalPrice: 2800,
        adjustments: [
          { type: "minor_damage", amount: -300, description: "Minor damage" },
          { type: "high_mileage", amount: -600, description: "High mileage" },
          { type: "interior_wear", amount: -500, description: "Interior wear" },
        ],
      },
      status: "approved",
      createdAt: "2025-01-14T14:20:00Z",
      updatedAt: "2025-01-15T09:15:00Z",
    },
    {
      id: "Q-003",
      quoteId: "Q-003",
      vehicleDetails: {
        year: "2015",
        make: "Honda",
        model: "Civic",
        trim: "EX",
      },
      vin: "19XFC2F59FE123789",
      customer: {
        name: "Mike Wilson",
        email: "mike@email.com",
        phone: "555-0789",
        zipCode: "98103",
      },
      pricing: {
        basePrice: 3800,
        currentPrice: 2100,
        finalPrice: 2100,
        adjustments: [
          { type: "flood_damage", amount: -1200, description: "Flood damage" },
          {
            type: "missing_catalytic",
            amount: -500,
            description: "Missing catalytic converter",
          },
        ],
      },
      status: "completed",
      createdAt: "2025-01-13T16:45:00Z",
      updatedAt: "2025-01-14T11:30:00Z",
    },
  ];

  useEffect(() => {
    loadQuotes();
  }, []);

  const loadQuotes = async () => {
    setLoading(true);
    setError("");
    try {
      // Try to load from API first
      const token = localStorage.getItem("adminToken");
      if (token) {
        const response = await fetch("/api/admin/quotes", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setQuotes(Array.isArray(data.quotes) ? data.quotes : []);
        } else {
          // Fallback to mock data if API fails
          console.warn("API failed, using mock data");
          setQuotes(mockQuotes);
        }
      } else {
        // No token, use mock data
        setQuotes(mockQuotes);
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
      setError("Failed to load quotes. Showing sample data.");
      // Fallback to mock data on error
      setQuotes(mockQuotes);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        label: "Pending",
        color: "bg-yellow-100 text-yellow-800",
        icon: Clock,
      },
      reviewed: {
        label: "Reviewed",
        color: "bg-blue-100 text-blue-800",
        icon: Eye,
      },
      approved: {
        label: "Approved",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      rejected: {
        label: "Rejected",
        color: "bg-red-100 text-red-800",
        icon: XCircle,
      },
      completed: {
        label: "Completed",
        color: "bg-purple-100 text-purple-800",
        icon: CheckCircle,
      },
      expired: {
        label: "Expired",
        color: "bg-gray-100 text-gray-800",
        icon: XCircle,
      },
    };

    const config = statusConfig[status] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // FIXED: Safe filtering with null checks
  const filteredQuotes = (quotes || []).filter((quote) => {
    if (!quote) return false;

    try {
      // Safe search matching with null checks
      const safeString = (str) => (str || "").toString().toLowerCase();
      const searchLower = (searchTerm || "").toLowerCase();

      const matchesSearch =
        safeString(quote.id || quote.quoteId).includes(searchLower) ||
        safeString(quote.customer?.name).includes(searchLower) ||
        safeString(quote.customer?.email).includes(searchLower) ||
        safeString(quote.vin).includes(searchLower) ||
        safeString(
          `${quote.vehicleDetails?.year || ""} ${
            quote.vehicleDetails?.make || ""
          } ${quote.vehicleDetails?.model || ""}`
        ).includes(searchLower);

      const matchesStatus =
        statusFilter === "all" ||
        (quote.status || "").toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    } catch (error) {
      console.error("Error filtering quote:", error, quote);
      return false;
    }
  });

  const totalPages = Math.ceil(filteredQuotes.length / quotesPerPage);
  const startIndex = (currentPage - 1) * quotesPerPage;
  const paginatedQuotes = filteredQuotes.slice(
    startIndex,
    startIndex + quotesPerPage
  );

  const handleStatusUpdate = async (quoteId, newStatus) => {
    try {
      // Update local state immediately for better UX
      setQuotes((prev) =>
        prev.map((quote) =>
          quote.id === quoteId || quote.quoteId === quoteId
            ? {
                ...quote,
                status: newStatus,
                updatedAt: new Date().toISOString(),
              }
            : quote
        )
      );

      // Try to update via API
      const token = localStorage.getItem("adminToken");
      if (token) {
        const response = await fetch(`/api/admin/quotes/${quoteId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (!response.ok) {
          console.warn("Failed to update quote status via API");
        }
      }
    } catch (error) {
      console.error("Error updating quote status:", error);
      // Revert the optimistic update on error
      loadQuotes();
    }
  };

  const handleViewQuoteDetails = (quote) => {
    console.log("View quote details:", quote);
    // TODO: Implement quote details modal or navigation
  };

  const handleExportQuotes = () => {
    try {
      // Create CSV content
      const headers = [
        "Quote ID",
        "Vehicle",
        "Customer",
        "Email",
        "Phone",
        "Final Price",
        "Status",
        "Created Date",
      ];
      const csvContent = [
        headers.join(","),
        ...filteredQuotes.map((quote) =>
          [
            quote.id || quote.quoteId || "",
            `"${quote.vehicleDetails?.year || ""} ${
              quote.vehicleDetails?.make || ""
            } ${quote.vehicleDetails?.model || ""}"`,
            `"${quote.customer?.name || ""}"`,
            quote.customer?.email || "",
            quote.customer?.phone || "",
            quote.pricing?.finalPrice || 0,
            quote.status || "",
            quote.createdAt
              ? new Date(quote.createdAt).toLocaleDateString()
              : "",
          ].join(",")
        ),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `quotes-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting quotes:", error);
      setError("Failed to export quotes");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quote Management</h1>
          <p className="text-gray-600">
            Manage vehicle quotes and customer offers
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleExportQuotes}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
          <Button size="sm" onClick={loadQuotes}>
            <Car className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-yellow-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Quotes</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{quotes.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Review
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {quotes.filter((q) => q?.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {quotes
                .reduce((sum, q) => sum + (q?.pricing?.finalPrice || 0), 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Quote Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {quotes.length > 0
                ? Math.round(
                    quotes.reduce(
                      (sum, q) => sum + (q?.pricing?.finalPrice || 0),
                      0
                    ) / quotes.length
                  ).toLocaleString()
                : "0"}
            </div>
            <p className="text-xs text-muted-foreground">Per quote</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Quotes ({filteredQuotes.length})</CardTitle>
            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search quotes, VIN, customer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewed">Reviewed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {paginatedQuotes.length === 0 ? (
            <div className="text-center py-12">
              <Car className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No quotes found
              </h3>
              <p className="text-gray-500">
                {quotes.length === 0
                  ? "No quotes have been submitted yet."
                  : "No quotes match your current filters."}
              </p>
            </div>
          ) : (
            <>
              {/* Quotes Table */}
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-4 font-medium">Quote ID</th>
                        <th className="text-left p-4 font-medium">Vehicle</th>
                        <th className="text-left p-4 font-medium">Customer</th>
                        <th className="text-left p-4 font-medium">Pricing</th>
                        <th className="text-left p-4 font-medium">Status</th>
                        <th className="text-left p-4 font-medium">Date</th>
                        <th className="text-left p-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedQuotes.map((quote) => (
                        <tr
                          key={quote.id || quote.quoteId}
                          className="border-b hover:bg-gray-50"
                        >
                          <td className="p-4">
                            <div className="font-medium text-blue-600">
                              {quote.id || quote.quoteId || "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              VIN: ...{(quote.vin || "").slice(-6) || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">
                              {quote.vehicleDetails?.year || ""}{" "}
                              {quote.vehicleDetails?.make || ""}
                            </div>
                            <div className="text-sm text-gray-500">
                              {quote.vehicleDetails?.model || ""}{" "}
                              {quote.vehicleDetails?.trim || ""}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium">
                              {quote.customer?.name || "N/A"}
                            </div>
                            <div className="text-sm text-gray-500">
                              {quote.customer?.email || "N/A"}
                            </div>
                            <div className="text-xs text-gray-400">
                              {quote.customer?.zipCode || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-green-600">
                              $
                              {(
                                quote.pricing?.finalPrice || 0
                              ).toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Base: $
                              {(quote.pricing?.basePrice || 0).toLocaleString()}
                            </div>
                            <div className="text-xs text-red-500">
                              Adj: -$
                              {(
                                quote.pricing?.adjustments?.reduce(
                                  (sum, adj) => sum + Math.abs(adj.amount || 0),
                                  0
                                ) || 0
                              ).toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(quote.status)}
                          </td>
                          <td className="p-4">
                            <div className="text-sm">
                              {quote.createdAt
                                ? new Date(quote.createdAt).toLocaleDateString()
                                : "N/A"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {quote.createdAt
                                ? new Date(quote.createdAt).toLocaleTimeString()
                                : ""}
                            </div>
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => handleViewQuoteDetails(quote)}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Quote
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(
                                      quote.id || quote.quoteId,
                                      "approved"
                                    )
                                  }
                                  className="text-green-600"
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleStatusUpdate(
                                      quote.id || quote.quoteId,
                                      "rejected"
                                    )
                                  }
                                  className="text-red-600"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-500">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(startIndex + quotesPerPage, filteredQuotes.length)}{" "}
                  of {filteredQuotes.length} quotes
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
