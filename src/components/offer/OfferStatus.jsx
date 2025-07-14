/** route: src/components/offer/OfferStatus.jsx */

import { Badge } from "@/components/ui/badge";
import {
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  XCircle,
} from "lucide-react";

export default function OfferStatus({ status }) {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-200 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Pending
        </Badge>
      );
    case "accepted":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Accepted
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200 flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Rejected
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          Expired
        </Badge>
      );
    case "revision_requested":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 flex items-center gap-1">
          <MessageSquare className="w-3 h-3" />
          Revision Requested
        </Badge>
      );
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
        </Badge>
      );
  }
}
