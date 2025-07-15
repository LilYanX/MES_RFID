"use client";
import { useEffect, useState } from "react";

interface Article {
  uuid: string;
  status: string;
  lastSeen: string;
}

const mockInventory: Article[] = [
  { uuid: "A1B2C3", status: "En stock", lastSeen: "2025-07-14T09:00:00" },
  { uuid: "D4E5F6", status: "En cours", lastSeen: "2025-07-14T10:10:00" },
  { uuid: "G7H8I9", status: "Sorti", lastSeen: "2025-07-14T11:30:00" },
];

export default function InventairePage() {
  const [inventory, setInventory] = useState<Article[]>([]); // Toujours un tableau, jamais undefined
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/inventory");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setInventory(data.inventory);
      } catch (e) {
        setInventory(mockInventory);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <main className="p-8">
      <h2 className="text-3xl font-bold mb-6">Inventaire RFID</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="bg-white rounded-xl shadow p-6">
          <table className="min-w-full text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">UUID</th>
                <th className="py-2 px-4">Statut</th>
                <th className="py-2 px-4">Dernier scan</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-gray-400">Aucun article en inventaire.</td>
                </tr>
              ) : (
                inventory.map((item, idx) => (
                  <tr key={item.uuid + idx} className="border-t hover:bg-gray-50">
                    <td className="py-2 px-4">{item.uuid}</td>
                    <td className="py-2 px-4">{item.status}</td>
                    <td className="py-2 px-4">{new Date(item.lastSeen).toLocaleString()}</td>
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