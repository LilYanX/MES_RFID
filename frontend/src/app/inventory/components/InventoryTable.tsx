import React from "react";

interface Article {
  uuid: string;
  status: string;
  lastSeen: string;
}

export default function InventoryTable({ inventory }: { inventory: Article[] }) {
  return (
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
  );
} 