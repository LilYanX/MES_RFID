import React from "react";

interface Scan {
  uuid: string;
  reference?: string | null;
  step: string;
  date: string;
}

export default function HistoricTable({ scans }: { scans: Scan[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <table className="min-w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">UUID</th>
            <th className="py-2 px-4">Référence</th>
            <th className="py-2 px-4">Étape</th>
            <th className="py-2 px-4">Date/Heure</th>
          </tr>
        </thead>
        <tbody>
          {scans.length === 0 ? (
            <tr>
              <td colSpan={4} className="py-4 text-gray-400">Aucun scan trouvé.</td>
            </tr>
          ) : (
            scans.map((scan, idx) => (
              <tr key={scan.uuid + idx} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{scan.uuid}</td>
                <td className="py-2 px-4">{scan.reference || '-'}</td>
                <td className="py-2 px-4">{scan.step}</td>
                <td className="py-2 px-4">{new Date(scan.date).toLocaleString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 