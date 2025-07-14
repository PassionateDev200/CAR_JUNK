/** route: src/app/admin/page.jsx */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, FileText, Users, Calendar } from "lucide-react";

export default function AdminDashboard() {
  // Replace with real data fetching logic
  const stats = [
    {
      title: "Total Quotes",
      value: 245,
      icon: FileText,
      color: "text-blue-600",
    },
    {
      title: "Active Customers",
      value: 189,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Scheduled Pickups",
      value: 12,
      icon: Calendar,
      color: "text-orange-600",
    },
    {
      title: "Revenue (Month)",
      value: "$45,231",
      icon: DollarSign,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome to the PNW Cash For Cars admin panel
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map(({ title, value, icon: Icon, color }) => (
          <Card key={title}>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className={`h-5 w-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Quotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Quote management coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Pickups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Pickup schedule coming soon...</p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
