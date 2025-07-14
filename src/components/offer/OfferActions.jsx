/** route: src/components/offer/OfferActions.jsx */
"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, MessageSquare } from "lucide-react";

export default function OfferActions({ onAccept, onReject, onRevise }) {
  return (
    <div className="flex flex-wrap gap-4">
      <Button onClick={onAccept} className="bg-green-600 hover:bg-green-700">
        <CheckCircle className="w-4 h-4 mr-2" />
        Accept Offer
      </Button>
      <Button
        onClick={onRevise}
        variant="outline"
        className="border-blue-600 text-blue-600 hover:bg-blue-50"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        Request Revision
      </Button>
      <Button
        onClick={onReject}
        variant="outline"
        className="border-red-600 text-red-600 hover:bg-red-50"
      >
        <XCircle className="w-4 h-4 mr-2" />
        Reject Offer
      </Button>
    </div>
  );
}
