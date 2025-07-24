import React, { useState, useRef, useEffect } from "react";

interface StepMultiSelectProps {
  steps: string[];
  selectedSteps: string[];
  onChange: (steps: string[]) => void;
}

const SELECT_ALL = "__ALL__";

export default function StepMultiSelect({ steps, selectedSteps, onChange }: StepMultiSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Fermer le menu si clic en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Gestion sélection
  const isAllSelected = selectedSteps.length === steps.length || selectedSteps.includes(SELECT_ALL);

  const handleSelect = (step: string) => {
    if (step === SELECT_ALL) {
      if (isAllSelected) {
        onChange([]);
      } else {
        onChange([...steps]);
      }
    } else {
      if (selectedSteps.includes(step)) {
        const newSelected = selectedSteps.filter(s => s !== step && s !== SELECT_ALL);
        onChange(newSelected);
      } else {
        const newSelected = [...selectedSteps.filter(s => s !== SELECT_ALL), step];
        if (newSelected.length === steps.length) {
          onChange([...steps]);
        } else {
          onChange(newSelected);
        }
      }
    }
  };

  // Affichage steps sélectionnés
  const displayValue = isAllSelected
    ? "All"
    : selectedSteps.length > 0
      ? selectedSteps.join(", ")
      : "Select steps";

  return (
    <div className="relative w-full max-w-xs" ref={ref}>
      <button
        type="button"
        className="w-full text-left px-4 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 transition flex items-center justify-between"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className={`block w-full truncate ${selectedSteps.length === 0 ? "text-gray-400" : ""}`}
          title={displayValue}
        >
          {displayValue}
        </span>
        <svg className={`w-4 h-4 ml-2 transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
      </button>
      {open && (
        <div className="absolute z-20 mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-auto animate-fade-in">
          <ul className="py-1">
            <li className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 rounded" onClick={() => handleSelect(SELECT_ALL)}>
              <input
                type="checkbox"
                checked={isAllSelected}
                readOnly
                className="accent-blue-600 rounded"
              />
              <span className="font-semibold text-blue-600">All</span>
            </li>
            {steps.map((step) => (
              <li
                key={step}
                className="px-4 py-2 hover:bg-blue-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 rounded"
                onClick={() => handleSelect(step)}
              >
                <input
                  type="checkbox"
                  checked={isAllSelected || selectedSteps.includes(step)}
                  readOnly
                  className="accent-blue-600 rounded"
                />
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
} 