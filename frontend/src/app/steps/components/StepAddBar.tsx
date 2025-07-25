import React from "react";

export default function StepAddBar({ newStep, setNewStep, onAdd }: { newStep: string; setNewStep: (v: string) => void; onAdd: () => void }) {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4 items-center">
      <input
        type="text"
        className="border rounded-lg px-3 py-2 flex-1"
        placeholder="New step..."
        value={newStep}
        onChange={e => setNewStep(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter") onAdd(); }}
      />
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={onAdd}
      >
        Add
      </button>
    </div>
  );
} 