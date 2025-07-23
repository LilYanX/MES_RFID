"use client";
import { useEffect, useState } from "react";
import StatsCards from "./components/StatsCards";
import StatisticsCharts from "./components/StatisticsCharts";
import StatsTable from "./components/StatsTable";

interface Stats {
  article_tracking: {
    total_articles: number;
    articles_by_step: Record<string, number>;
    average_time_by_step: Record<string, number>;
    idle_articles: Array<any>;
  };
  process_performance: {
    throughput: Record<string, number>;
    average_cycle_time: number;
    daily_throughput: Array<any>;
    performance_by_portal: Array<any>;
  };
  anomalies: {
    blocked_articles: Array<any>;
    skipped_steps: Array<any>;
    duplicate_scans: Array<any>;
  };
  portal_status: {
    active_portals: Array<any>;
    read_rates: Array<any>;
    uptime: Array<any>;
    error_history: Array<any>;
  };
  article_types: {
    distribution: Record<string, number>;
    average_cycle_by_type: Record<string, number>;
    top_references: Array<any>;
  };
  global_kpis: {
    articles_in_progress: number;
    average_processing_time: number;
    articles_finished_today: number;
    alerts: {
      active: number;
      resolved: number;
    };
  };
}

const mockStats: Stats = {
  article_tracking: {
    total_articles: 120,
    articles_by_step: {
      Reception: 30,
      "Pre-treatment": 20,
      "Wash Processing": 25,
      "Thermal Drying": 15,
      "Automated Sorting": 10,
      "Collection & Intake": 20
    },
    average_time_by_step: {
      Reception: 15,
      "Pre-treatment": 30,
      "Wash Processing": 45,
      "Thermal Drying": 20,
      "Automated Sorting": 10,
      "Collection & Intake": 5
    },
    idle_articles: []
  },
  process_performance: {
    throughput: {
      "0": 15,
      "1": 20,
      "2": 18,
      "3": 22,
      "4": 16,
      "5": 14,
      "6": 18,
      "7": 21,
      "8": 19,
      "9": 17,
      "10": 20,
      "11": 22,
      "12": 16,
      "13": 18,
      "14": 21,
      "15": 19,
      "16": 17,
      "17": 20,
      "18": 22,
      "19": 16,
      "20": 18,
      "21": 21,
      "22": 19,
      "23": 17
    },
    average_cycle_time: 25.5,
    daily_throughput: [
      { _id: "2025-07-22", count: 50 },
      { _id: "2025-07-21", count: 45 },
      { _id: "2025-07-20", count: 48 }
    ],
    performance_by_portal: []
  },
  anomalies: {
    blocked_articles: [],
    skipped_steps: [],
    duplicate_scans: []
  },
  portal_status: {
    active_portals: [
      { _id: "Portal1", status: "active", last_update: "2025-07-23T16:00:00" },
      { _id: "Portal2", status: "active", last_update: "2025-07-23T16:00:00" },
      { _id: "Portal3", status: "active", last_update: "2025-07-23T16:00:00" }
    ],
    read_rates: [
      { _id: "Portal1", read_rate: 0.95 },
      { _id: "Portal2", read_rate: 0.98 },
      { _id: "Portal3", read_rate: 0.92 }
    ],
    uptime: [],
    error_history: []
  },
  article_types: {
    distribution: {},
    average_cycle_by_type: {},
    top_references: []
  },
  global_kpis: {
    articles_in_progress: 85,
    average_processing_time: 25.5,
    articles_finished_today: 35,
    alerts: {
      active: 3,
      resolved: 0
    }
  }
};

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/stats");
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setStats(data);
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques:", error);
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) return <div className="text-center p-8">Chargement...</div>;

  if (!stats) return <div className="text-center p-8">Erreur de chargement</div>;

  return (
    <main className="p-8">
      <h2 className="text-3xl font-bold mb-6">Statistiques</h2>

      {/* KPIs */}
      <StatsCards
        totalArticles={stats.article_tracking.total_articles}
        articlesInProgress={stats.global_kpis.articles_in_progress}
        articlesFinishedToday={stats.global_kpis.articles_finished_today}
        averageProcessingTime={stats.global_kpis.average_processing_time}
        activeAlerts={stats.global_kpis.alerts.active}
      />

      {/* Table des alertes */}
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Alertes actives</h3>
        <StatsTable data={{
          type: "readRates",
          items: stats.portal_status.read_rates.map((item) => ({
            portalId: item._id,
            readRate: item.read_rate * 100
          }))
        }} />
      </div>

      {/* Table des articles par étape */}
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h3 className="text-lg font-semibold mb-4">Articles par étape</h3>
        <StatsTable data={{
          type: "articles",
          items: Object.entries(stats.article_tracking.articles_by_step).map(([step, count]) => ({
            step,
            count: Number(count)
          }))
        }} />
      </div>

      {/* Graphique circulaire des articles par étape avec légendes */}
      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h3 className="text-lg font-semibold mb-6 text-center">Répartition des articles par étape</h3>
        <div className="flex items-center justify-center gap-8">
          {/* Graphique */}
          <div className="relative">
            <svg width="300" height="300" viewBox="0 0 300 300">
              {Object.entries(stats.article_tracking.articles_by_step).map(([step, count], index) => {
                const total = Object.values(stats.article_tracking.articles_by_step).reduce((a, b) => a + b, 0);
                const startAngle = index === 0 ? 0 : Object.entries(stats.article_tracking.articles_by_step)
                  .slice(0, index)
                  .reduce((sum, [, prevCount]) => sum + (prevCount / total * 360), 0);
                const endAngle = startAngle + (count / total * 360);
                const percentage = ((count / total) * 100).toFixed(1);
                
                // Couleurs plus distinctes
                const colors = [
                  '#3B82F6', // Bleu
                  '#10B981', // Vert
                  '#F59E0B', // Orange
                  '#EF4444', // Rouge
                  '#8B5CF6', // Violet
                  '#06B6D4', // Cyan
                  '#F97316', // Orange foncé
                  '#84CC16'  // Lime
                ];
                
                const color = colors[index % colors.length];
                
                // Calcul des coordonnées pour le path
                const centerX = 150;
                const centerY = 150;
                const radius = 120;
                
                const startX = centerX + radius * Math.cos((startAngle - 90) * Math.PI / 180);
                const startY = centerY + radius * Math.sin((startAngle - 90) * Math.PI / 180);
                const endX = centerX + radius * Math.cos((endAngle - 90) * Math.PI / 180);
                const endY = centerY + radius * Math.sin((endAngle - 90) * Math.PI / 180);
                
                const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
                
                return (
                  <g key={step}>
                    <path
                      d={`M ${centerX} ${centerY} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`}
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                      className="hover:opacity-80 transition-opacity cursor-pointer"
                      onMouseEnter={(e) => setHoveredStep(step)}
                      onMouseLeave={() => setHoveredStep(null)}
                    />
                    {/* Étiquette de pourcentage */}
                    {count > 0 && (
                      <text
                        x={centerX + (radius * 0.7) * Math.cos(((startAngle + endAngle) / 2 - 90) * Math.PI / 180)}
                        y={centerY + (radius * 0.7) * Math.sin(((startAngle + endAngle) / 2 - 90) * Math.PI / 180)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="white"
                        fontSize="12"
                        fontWeight="bold"
                        className="pointer-events-none"
                      >
                        {percentage}%
                      </text>
                    )}
                  </g>
                );
              })}
              {/* Cercle central pour améliorer l'esthétique */}
              <circle
                cx="150"
                cy="150"
                r="40"
                fill="white"
                stroke="#E5E7EB"
                strokeWidth="2"
              />
              <text
                x="150"
                y="145"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="14"
                fontWeight="bold"
                fill="#374151"
              >
                Total
              </text>
              <text
                x="150"
                y="160"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="16"
                fontWeight="bold"
                fill="#1F2937"
              >
                {Object.values(stats.article_tracking.articles_by_step).reduce((a, b) => a + b, 0)}
              </text>
            </svg>
            
            {/* Tooltip au survol */}
            {hoveredStep && (
              <div className="absolute top-4 left-4 bg-gray-800 text-white p-2 rounded shadow-lg z-10">
                <div className="font-semibold">{hoveredStep}</div>
                <div>{stats.article_tracking.articles_by_step[hoveredStep]} articles</div>
                <div>{((stats.article_tracking.articles_by_step[hoveredStep] / Object.values(stats.article_tracking.articles_by_step).reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%</div>
              </div>
            )}
          </div>
          
          {/* Légende */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-gray-700 mb-2">Étapes du processus</h4>
            {Object.entries(stats.article_tracking.articles_by_step).map(([step, count], index) => {
              const total = Object.values(stats.article_tracking.articles_by_step).reduce((a, b) => a + b, 0);
              const percentage = ((count / total) * 100).toFixed(1);
              
              const colors = [
                '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
                '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'
              ];
              
              return (
                <div key={step} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                  <div 
                    className="w-4 h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{step}</div>
                    <div className="text-xs text-gray-500">
                      {count} articles ({percentage}%)
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}