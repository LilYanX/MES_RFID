"use client";
import { useEffect, useState } from "react";

// Types pour les stats
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
        // fallback mock
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalArticles}</div>
              <div className="text-gray-600">Articles total</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-2xl font-bold text-yellow-500">{stats.articlesEnCours}</div>
              <div className="text-gray-600">En cours</div>
            </div>
            <div className="bg-white rounded-xl shadow p-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.articlesTermines}</div>
              <div className="text-gray-600">Terminés</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Répartition par étape</h3>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <table className="min-w-full text-center">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4">Étape</th>
                      <th className="py-2 px-4">Nombre d'articles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(stats.articlesParEtape).map(([step, count]) => (
                      <tr key={step} className="border-t">
                        <td className="py-2 px-4">{step}</td>
                        <td className="py-2 px-4">{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Camembert simple SVG */}
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

// Composant PieChart SVG simple
function PieChart({ data }: { data: { [step: string]: number } }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  let startAngle = 0;
  const colors = ["#3b82f6", "#f59e42", "#10b981", "#ef4444", "#6366f1", "#eab308"];
  let i = 0;
  const radius = 50;
  const center = 60;
  const pieSlices = Object.entries(data).map(([label, value]) => {
    const angle = (value / total) * 360;
    const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
    const endAngle = startAngle + angle;
    const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);
    const largeArc = angle > 180 ? 1 : 0;
    const pathData = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
    const color = colors[i % colors.length];
    startAngle += angle;
    i++;
    return (
      <path key={label} d={pathData} fill={color} stroke="#fff" strokeWidth="2" />
    );
  });
  // Légende
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {pieSlices}
      </svg>
      <div className="flex flex-col gap-2 mt-2">
        {Object.keys(data).map((label, idx) => (
          <div key={label} className="flex items-center gap-2 text-sm">
            <span style={{ background: colors[idx % colors.length] }} className="inline-block w-3 h-3 rounded-full"></span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}