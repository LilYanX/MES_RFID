import React from "react";
import { format } from "date-fns";

interface StatCard {
  value: number | string;
  label: string;
  color?: string;
  icon?: string;
}

interface StatsCardsProps {
  totalArticles: number;
  articlesInProgress: number;
  articlesFinishedToday: number;
  averageProcessingTime: number;
  activeAlerts: number;
}

const StatCard = ({ stat }: { stat: StatCard }) => (
  <div className="bg-white rounded-xl shadow p-6 text-center">
    {stat.icon && (
      <div className="mb-2">
        <i className={`fa ${stat.icon} text-3xl text-${stat.color}-500`} />
      </div>
    )}
    <div className={`text-2xl font-bold text-${stat.color || 'gray'}-600`}>
      {stat.value}
    </div>
    <div className="text-gray-600">{stat.label}</div>
  </div>
);

export default function StatsCards({
  totalArticles,
  articlesInProgress,
  articlesFinishedToday,
  averageProcessingTime,
  activeAlerts
}: StatsCardsProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const cards: StatCard[] = [
    {
      value: totalArticles,
      label: "Total Articles",
      color: "blue",
      icon: "fa-box"
    },
    {
      value: articlesInProgress,
      label: "Articles in Progress",
      color: "yellow",
      icon: "fa-clock"
    },
    {
      value: articlesFinishedToday,
      label: "Articles Finished Today",
      color: "green",
      icon: "fa-check"
    },
    {
      value: formatTime(averageProcessingTime),
      label: "Average Processing Time",
      color: "purple",
      icon: "fa-clock"
    },
    {
      value: activeAlerts,
      label: "Active Alerts",
      color: "red",
      icon: "fa-exclamation-triangle"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card, index) => (
        <StatCard key={index} stat={card} />
      ))}
    </div>
  );
}