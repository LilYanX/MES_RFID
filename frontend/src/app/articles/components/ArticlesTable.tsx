import React from "react";

interface Article {
  name: string;
  type: string;
  color: string;
  size: string;
  material: string;
  washing_time_min: number;
  drying_time_min: number;
  pre_treatment: string;
  care_label: string;
  dispatch_zone: string;
  quality_requirements: string;
  notes: string;
  sales_price_ron?: number;
  length_cm?: number;
  hight_cm?: number;
}

export default function ArticlesTable({ articles, onSelect }: { articles: Article[]; onSelect: (name: string) => void }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <table className="min-w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Name</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Color</th>
            <th className="py-2 px-4">Size</th>
            <th className="py-2 px-4">Material</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {articles.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-gray-400 py-4">No articles found.</td>
            </tr>
          ) : (
            articles.map((a) => (
              <tr key={a.name} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => onSelect(a.name)}
                  >
                    {a.name}
                  </button>
                </td>
                <td className="py-2 px-4">{a.type}</td>
                <td className="py-2 px-4">{a.color}</td>
                <td className="py-2 px-4">{a.size}</td>
                <td className="py-2 px-4">{a.material}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => onSelect(a.name)}
                  >
                    View details
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
} 