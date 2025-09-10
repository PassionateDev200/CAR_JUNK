/** route: src/components/admin/SimpleChart.jsx */
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function SimpleChart({ title, data, type = "bar", height = 200 }) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-gray-500">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxValue = Math.max(...data.map(item => item.value || item.count || item.revenue || 0));

  const renderBarChart = () => (
    <div className="space-y-2">
      {data.map((item, index) => {
        const value = item.value || item.count || item.revenue || 0;
        const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
        
        return (
          <div key={index} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="truncate">{item.label || item._id || item.name}</span>
              <span className="font-medium">{value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderLineChart = () => (
    <div className="relative h-48">
      <svg width="100%" height="100%" className="overflow-visible">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map((percent, index) => (
          <line
            key={index}
            x1="0"
            y1={`${percent}%`}
            x2="100%"
            y2={`${percent}%`}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
        ))}
        
        {/* Data line */}
        <polyline
          fill="none"
          stroke="#3B82F6"
          strokeWidth="2"
          points={data.map((item, index) => {
            const value = item.value || item.count || item.revenue || 0;
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - percentage;
            return `${x},${y}`;
          }).join(" ")}
        />
        
        {/* Area under the line */}
        <polygon
          fill="url(#gradient)"
          points={`0,100 ${data.map((item, index) => {
            const value = item.value || item.count || item.revenue || 0;
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - percentage;
            return `${x},${y}`;
          }).join(" ")} 100,100`}
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const value = item.value || item.count || item.revenue || 0;
          const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0;
          const x = (index / (data.length - 1)) * 100;
          const y = 100 - percentage;
          
          return (
            <circle
              key={index}
              cx={`${x}%`}
              cy={`${y}%`}
              r="3"
              fill="#3B82F6"
              className="hover:r-4 transition-all"
            />
          );
        })}
      </svg>
    </div>
  );

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + (item.value || item.count || 0), 0);
    let cumulativePercentage = 0;
    
    return (
      <div className="flex items-center justify-center">
        <svg width="200" height="200" className="transform -rotate-90">
          {data.map((item, index) => {
            const value = item.value || item.count || 0;
            const percentage = total > 0 ? (value / total) * 100 : 0;
            const circumference = 2 * Math.PI * 80; // radius = 80
            const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;
            const strokeDashoffset = -((cumulativePercentage / 100) * circumference);
            
            cumulativePercentage += percentage;
            
            const colors = [
              "#3B82F6", "#10B981", "#F59E0B", "#EF4444", 
              "#8B5CF6", "#06B6D4", "#84CC16", "#F97316"
            ];
            
            return (
              <circle
                key={index}
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth="20"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300"
              />
            );
          })}
        </svg>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {type === "bar" && renderBarChart()}
        {type === "line" && renderLineChart()}
        {type === "pie" && renderPieChart()}
      </CardContent>
    </Card>
  );
}
