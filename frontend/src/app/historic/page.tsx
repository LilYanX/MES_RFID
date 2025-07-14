"use client";
import { useEffect, useState } from "react";

interface Scan {
  uuid: string;
  step: string;
  date: string;
}

const mockHistoric: Scan[] = [
  { uuid: "A1B2C3", step: "Réception", date: "2025-07-14T09:15:00" },
  { uuid: "D4E5F6", step: "Contrôle", date: "2025-07-14T10:20:00" },
  { uuid: "G7H8I9", step: "Expédition", date: "2025-07-14T11:45:00" },
];

export default function HistoricPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoric = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/historic");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setScans(data.historic);
      } catch (e) {
        setScans(mockHistoric);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoric();
  }, []);

  return (
    <main className="p-8">
      <h2 className="text-3xl font-bold mb-6">Historique des Scans</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          <table className="min-w-full text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">UUID</th>
                <th className="py-2 px-4">Étape</th>
                <th className="py-2 px-4">Date/Heure</th>
              </tr>
            </thead>
            <tbody>
              {scans.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-gray-400">Aucun scan trouvé.</td>
                </tr>
              ) : (
                scans.map((scan, idx) => (
                  <tr key={scan.uuid + idx} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{scan.uuid}</td>
                    <td className="py-2 px-4">{scan.step}</td>
                    <td className="py-2 px-4">{new Date(scan.date).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}