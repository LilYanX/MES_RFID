import React from "react";

export default function StatsTable({ data }: { data: { [step: string]: number } }) {
  return (
    <table className="min-w-full text-center">
      <thead>
        <tr className="bg-gray-100">
          <th className="py-2 px-4">Étape</th>
          <th className="py-2 px-4">Nombre d'articles</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(data).map(([step, count]) => (
          <tr key={step} className="border-t">
            <td className="py-2 px-4">{step}</td>
            <td className="py-2 px-4">{count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
} 