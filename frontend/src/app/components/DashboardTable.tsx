import React from "react";

type Article = {
  uuid: string;
  latest_step_id: number;
  latest_step_name: string;
  last_seen: string;
};

export default function DashboardTable({ articles }: { articles: Article[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-xl">
        <thead className="bg-gray-100 text-gray-800">
          <tr>
            <th className="py-2 px-4 border">UUID</th>
            <th className="py-2 px-4 border">Étape</th>
            <th className="py-2 px-4 border">Date de scan</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.uuid} className="text-center border-t hover:bg-gray-50">
              <td className="py-2 px-4">{article.uuid}</td>
              <td className="py-2 px-4">{article.latest_step_name}</td>
              <td className="py-2 px-4">{new Date(article.last_seen).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 