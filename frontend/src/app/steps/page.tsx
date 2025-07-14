"use client";
import { useEffect, useState } from "react";

interface Step {
  _id: string;
  step_id: number;
  step_name: string;
  reader_type: string;
  created_at: string;
}

const mockSteps: Step[] = [
  {
    _id: "mock1",
    step_id: 1,
    step_name: "Collection & Intake",
    reader_type: "Portal Reader",
    created_at: new Date().toISOString(),
  },
  {
    _id: "mock2",
    step_id: 2,
    step_name: "Automated Sorting",
    reader_type: "Overhead Array",
    created_at: new Date().toISOString(),
  },
  {
    _id: "mock3",
    step_id: 3,
    step_name: "Pre-treatment",
    reader_type: "Handheld Scanner",
    created_at: new Date().toISOString(),
  },
];

export default function EtapesPage() {
  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStep, setNewStep] = useState("");

  useEffect(() => {
    const fetchSteps = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/steps");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setSteps(Array.isArray(data.steps) ? data.steps : []);
      } catch (e) {
        setSteps(mockSteps as Step[]);
      } finally {
        setLoading(false);
      }
    };
    fetchSteps();
  }, []);

  // Ajout d'une étape via API
  const addStep = async () => {
    if (!newStep.trim()) return;
    try {
      const step_id = steps.length > 0 ? Math.max(...(steps as Step[]).map((s) => s.step_id)) + 1 : 1;
      const res = await fetch("http://localhost:8000/api/steps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step_id, step_name: newStep, reader_type: "Custom" })
      });
      const data = await res.json();
      setSteps([...(steps as Step[]), data]);
      setNewStep("");
    } catch (e) {
      alert("Erreur lors de l'ajout de l'étape");
    }
  };

  // Suppression d'une étape via API
  const removeStep = async (step_id: number) => {
    try {
      await fetch(`http://localhost:8000/api/steps/${step_id}`, { method: "DELETE" });
      setSteps((steps as Step[]).filter((s) => s.step_id !== step_id));
    } catch (e) {
      alert("Erreur lors de la suppression de l'étape");
    }
  };


  return (
    <main className="p-8">
      <h2 className="text-3xl font-bold mb-6">Étapes du Processus</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
            <input
              type="text"
              className="border rounded-lg px-3 py-2 flex-1"
              placeholder="Nouvelle étape..."
              value={newStep}
              onChange={(e) => setNewStep(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addStep();
              }}
            />
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              onClick={addStep}
            >
              Ajouter
            </button>
          </div>
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
                          onClick={() => removeStep(step.step_id)}
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
        </>
      )}
    </main>
  );
}