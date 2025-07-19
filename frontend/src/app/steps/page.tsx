"use client";
import { useEffect, useState } from "react";
import StepsTable from "./components/StepsTable";
import StepAddBar from "./components/StepAddBar";

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
          <StepAddBar newStep={newStep} setNewStep={setNewStep} onAdd={addStep} />
          <StepsTable steps={steps} onRemove={removeStep} />
        </>
      )}
    </main>
  );
}