"use client";
import { useEffect, useState } from "react";
import StatsCards from "./components/StatsCards";
import StatsTable from "./components/StatsTable";
import PieChart from "./components/PieChart";

interface Stats {
  totalArticles: number;
  articlesParEtape: { [step: string]: number };
  articlesEnCours: number;
  articlesTermines: number;
}

const mockStats: Stats = {
  totalArticles: 120,
  articlesParEtape: {
    Reception: 30,
    "Contrôle": 40,
    "Expédition": 50,
  },
  articlesEnCours: 70,
  articlesTermines: 50,
};

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/stats");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setStats(data.stats);
      } catch (e) {
        setStats(mockStats);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <main className="p-8">
      <h2 className="text-3xl font-bold mb-6">Statistiques</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : stats ? (
        <>
          <StatsCards total={stats.totalArticles} enCours={stats.articlesEnCours} termines={stats.articlesTermines} />
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Répartition par étape</h3>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <StatsTable data={stats.articlesParEtape} />
              </div>
              <div className="flex-1 flex items-center justify-center">
                <PieChart data={stats.articlesParEtape} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Erreur de chargement des statistiques.</p>
      )}
    </main>
  );
}