import React from "react";

interface Article {
  uuid: string;
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
}

export default function ArticlesTable({ articles, onSelect }: { articles: Article[]; onSelect: (uuid: string) => void }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8">
      <table className="min-w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">UUID</th>
            <th className="py-2 px-4">Type</th>
            <th className="py-2 px-4">Couleur</th>
            <th className="py-2 px-4">Taille</th>
            <th className="py-2 px-4">Matière</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {articles.length === 0 ? (
            <tr>
              <td colSpan={6} className="text-gray-400 py-4">Aucun article trouvé.</td>
            </tr>
          ) : (
            articles.map((a) => (
              <tr key={a.uuid} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">
                  <button
                    className="text-blue-600 underline"
                    onClick={() => onSelect(a.uuid)}
                  >
                    {a.uuid}
                  </button>
                </td>
                <td className="py-2 px-4">{a.type}</td>
                <td className="py-2 px-4">{a.color}</td>
                <td className="py-2 px-4">{a.size}</td>
                <td className="py-2 px-4">{a.material}</td>
                <td className="py-2 px-4">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                    onClick={() => onSelect(a.uuid)}
                  >
                    Voir détail
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