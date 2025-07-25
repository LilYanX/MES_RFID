import React from "react";
import { BarChart } from "@tremor/react";
import { LineChart } from "@tremor/react";
import { format } from "date-fns";
import PieChart from "./PieChart";

interface StatisticsChartsProps {
  stats: {
    article_tracking: {
      articles_by_step: { [key: string]: number };
      average_time_by_step: { [key: string]: number };
    };
    process_performance: {
      daily_throughput: Array<{ _id: string; count: number }>;
    };
    portal_status: {
      read_rates: Array<{ _id: string; read_rate: number }>;
    };
  };
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export default function StatisticsCharts({ stats }: StatisticsChartsProps) {
  // Préparation des données pour les graphiques
  const steps = Object.keys(stats.article_tracking.articles_by_step);
  const timeData = steps.map(step => ({
    name: step,
    value: stats.article_tracking.average_time_by_step[step]
  }));

  const throughputData = stats.process_performance.daily_throughput.map(item => ({
    name: format(new Date(item._id), "dd/MM"),
    value: item.count
  }));

  const readRatesData = stats.portal_status.read_rates.map(item => ({
    name: item._id,
    value: item.read_rate * 100
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Répartition circulaire des articles par étape */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Article Distribution</h3>
        <PieChart
          data={stats.article_tracking.articles_by_step}
          size={300}
        />
      </div>

      {/* Temps moyen par étape */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Temps moyen par étape</h3>
        <LineChart
          data={timeData}
          index="name"
          categories={steps}
          colors={['blue'] as ('blue' | 'indigo' | 'purple' | 'pink' | 'red')[]}
          valueFormatter={(value: number) => formatTime(value)}
        />
      </div>

      {/* Throughput journalier */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Throughput journalier</h3>
        <LineChart
          data={throughputData}
          index="name"
          categories={['value']}
          colors={['blue'] as ('blue' | 'indigo' | 'purple' | 'pink' | 'red')[]}
          valueFormatter={(value: number) => `${value}`}
        />
      </div>

      {/* Taux de lecture par portail */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Taux de lecture par portail</h3>
          <BarChart
            data={readRatesData}
            index="name"
            categories={readRatesData.map(item => item.name)}
            colors={['blue', 'indigo', 'purple', 'pink', 'red'] as ('blue' | 'indigo' | 'purple' | 'pink' | 'red')[]}
            valueFormatter={(value: number) => `${value.toFixed(1)}%`}
          />
      </div>
    </div>
  );
}
