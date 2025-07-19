import React from "react";

interface StatsCardsProps {
  total: number;
  enCours: number;
  termines: number;
}

export default function StatsCards({ total, enCours, termines }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="text-2xl font-bold text-blue-600">{total}</div>
        <div className="text-gray-600">Articles total</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="text-2xl font-bold text-yellow-500">{enCours}</div>
        <div className="text-gray-600">En cours</div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 text-center">
        <div className="text-2xl font-bold text-green-600">{termines}</div>
        <div className="text-gray-600">Terminés</div>
      </div>
    </div>
  );
} 