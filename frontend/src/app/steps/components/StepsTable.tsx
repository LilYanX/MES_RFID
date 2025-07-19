import React from "react";

interface Step {
  _id: string;
  step_id: number;
  step_name: string;
  reader_type: string;
  created_at: string;
}

export default function StepsTable({ steps, onRemove }: { steps: Step[]; onRemove: (step_id: number) => void }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <table className="min-w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">#</th>
            <th className="py-2 px-4">Nom</th>
            <th className="py-2 px-4">Type de lecteur</th>
            <th className="py-2 px-4">Date d'ajout</th>
            <th className="py-2 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {steps.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-gray-400 py-4">Aucune étape enregistrée.</td>
            </tr>
          ) : (
            steps.map((step) => (
              <tr key={step._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{step.step_id}</td>
                <td className="py-2 px-4">{step.step_name}</td>
                <td className="py-2 px-4">{step.reader_type}</td>
                <td className="py-2 px-4">{new Date(step.created_at).toLocaleString()}</td>
                <td className="py-2 px-4">
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => onRemove(step.step_id)}
                    title="Supprimer"
                  >
                    Supprimer
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