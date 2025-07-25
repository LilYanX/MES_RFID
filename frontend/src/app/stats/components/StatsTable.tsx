"use client";
import React, { useState } from "react";
import { format } from "date-fns";

interface StatsTableProps {
  data: {
    type: "articles" | "alerts" | "readRates";
    items: Array<{
      step?: string;
      count?: number;
      articleId?: string;
      timestamp?: string;
      status?: "warning" | "error" | "info";
      portalId?: string;
      readRate?: number;
    }>;
  };
}

export default function StatsTable({ data }: StatsTableProps) {
  const [sortField, setSortField] = React.useState<string>("");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedItems = [...data.items].sort((a, b) => {
    if (!sortField) return 0;
    
    const aValue = a[sortField as keyof typeof a];
    const bValue = b[sortField as keyof typeof b];

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" 
        ? aValue - bValue 
        : bValue - aValue;
    }

    return 0;
  });

  return (
    <div className="rounded-lg border">
      <table className="w-full">
        <thead>
          <tr>
            {data.type === "articles" ? (
              <>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("step")}
                >
                  Étape
                  {sortField === "step" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("count")}
                >
                  Count
                  {sortField === "count" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              </>
            ) : data.type === "alerts" ? (
              <>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("articleId")}
                >
                  Article
                  {sortField === "articleId" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("step")}
                >
                  Étape
                  {sortField === "step" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("timestamp")}
                >
                  Date/Time
                  {sortField === "timestamp" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("status")}
                >
                  Status
                  {sortField === "status" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              </>
            ) : (
              <>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("portalId")}
                >
                  Portal ID
                  {sortField === "portalId" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th 
                  className="py-2 px-4 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort("readRate")}
                >
                  Read Rate
                  {sortField === "readRate" && (
                    <span className="ml-2">
                      {sortDirection === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedItems.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              {data.type === "articles" ? (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">{item.step}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.count}</td>
                </>
              ) : data.type === "alerts" ? (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">{item.articleId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.step}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.timestamp && format(new Date(item.timestamp), "HH:mm")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.status && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.status === "error" ? "bg-red-100 text-red-800" :
                        item.status === "warning" ? "bg-yellow-100 text-yellow-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </td>
                </>
              ) : (
                <>
                  <td className="px-6 py-4 whitespace-nowrap">{item.portalId}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.readRate && (
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.readRate >= 0.9 ? "bg-green-100 text-green-800" :
                        item.readRate >= 0.7 ? "bg-yellow-100 text-yellow-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {(item.readRate * 100).toFixed(1)}%
                      </span>
                    )}
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}