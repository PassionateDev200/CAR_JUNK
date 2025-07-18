/** route: src/components/customer/ActionHistory.jsx */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  History,
  User,
  Shield,
  Ban,
  RotateCcw,
  Edit,
  CheckCircle,
  Clock,
} from "lucide-react";

export default function ActionHistory({ actions = [] }) {
  const getActionIcon = (action) => {
    switch (action) {
      case "cancelled":
        return <Ban className="h-4 w-4 text-red-600" />;
      case "rescheduled":
        return <RotateCcw className="h-4 w-4 text-blue-600" />;
      case "modified":
        return <Edit className="h-4 w-4 text-orange-600" />;
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pickup_scheduled":
        return <Clock className="h-4 w-4 text-purple-600" />;
      default:
        return <History className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "rescheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "modified":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "accepted":
        return "bg-green-100 text-green-800 border-green-200";
      case "pickup_scheduled":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getActionLabel = (action) => {
    switch (action) {
      case "cancelled":
        return "Cancelled";
      case "rescheduled":
        return "Rescheduled";
      case "modified":
        return "Modified";
      case "accepted":
        return "Accepted";
      case "pickup_scheduled":
        return "Pickup Scheduled";
      default:
        return action;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!actions || actions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-blue-600" />
            Action History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <History className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No actions recorded yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort actions by timestamp (most recent first)
  const sortedActions = [...actions].sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5 text-blue-600" />
          Action History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sortedActions.map((action, index) => (
            <div key={index}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getActionIcon(action.action)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={getActionColor(action.action)}>
                      {getActionLabel(action.action)}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {formatDate(action.timestamp)}
                    </span>
                    {action.customerInitiated && (
                      <Badge variant="outline" className="text-xs">
                        <User className="h-3 w-3 mr-1" />
                        You
                      </Badge>
                    )}
                    {!action.customerInitiated && (
                      <Badge variant="outline" className="text-xs">
                        <Shield className="h-3 w-3 mr-1" />
                        Admin
                      </Badge>
                    )}
                  </div>

                  {action.reason && (
                    <p className="text-sm text-gray-700 mb-1">
                      <strong>Reason:</strong>{" "}
                      {action.reason.replace(/_/g, " ")}
                    </p>
                  )}

                  {action.note && (
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Note:</strong> {action.note}
                    </p>
                  )}

                  {action.details && typeof action.details === "object" && (
                    <div className="text-sm text-gray-600">
                      {action.action === "rescheduled" &&
                        action.details.originalDate && (
                          <div>
                            <strong>Original:</strong>{" "}
                            {new Date(
                              action.details.originalDate
                            ).toLocaleDateString()}{" "}
                            at {action.details.originalTime}
                            <br />
                            <strong>New:</strong>{" "}
                            {new Date(
                              action.details.newDate
                            ).toLocaleDateString()}{" "}
                            at {action.details.newTime}
                          </div>
                        )}
                      {action.action === "modified" && (
                        <div>
                          <strong>Updated:</strong>{" "}
                          {Object.keys(action.details).join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {index < sortedActions.length - 1 && (
                <Separator className="mt-4" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
