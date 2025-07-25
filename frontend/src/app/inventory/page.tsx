"use client";

import { useState, useEffect } from "react";
import InventoryTable from "./components/InventoryTable";
import StepMultiSelect from "./components/StepMultiSelect";
import { useAppDispatch, useAppSelector } from "@/utils/redux/hooks";
import { getInventory, getInventoryByStep, getSteps } from "@/utils/services/inventorySlice";
import type { AppDispatch } from '@/utils/redux/store';

interface InventoryItem {
  reference: string;
  uuid: string;
  step_name: string;
}

export default function InventairePage() {
  const dispatch = useAppDispatch();
  const typedDispatch: AppDispatch = dispatch;
  const { data: inventory, loading, error, steps, stepsLoading, stepsError } = useAppSelector(
    (state) => state.inventory
  );
  const [selectedSteps, setSelectedSteps] = useState<string[]>([]);
  const [multiInventory, setMultiInventory] = useState<Record<string, InventoryItem[]>>({});
  const [loadingSteps, setLoadingSteps] = useState<string[]>([]);
  const SELECT_ALL = "__ALL__";

  useEffect(() => {
    dispatch(getSteps());
  }, [dispatch]);

  useEffect(() => {
    if (selectedSteps.length === 0) {
      setMultiInventory({});
      return;
    }
    if (selectedSteps.includes(SELECT_ALL)) {
      dispatch(getInventory());
      setMultiInventory({});
      setLoadingSteps([]);
    } else {
      setLoadingSteps(selectedSteps);
      const fetchSteps = async () => {
        const results: Record<string, InventoryItem[]> = {};
        await Promise.all(
          selectedSteps.map(async (step) => {
            const res = await typedDispatch(getInventoryByStep(step));
            const data = res.payload && Array.isArray(res.payload.inventory)
              ? res.payload.inventory
              : [];
            results[step] = data;
          })
        );
        setMultiInventory(results);
        setLoadingSteps([]);
      };
      fetchSteps();
    }
  }, [selectedSteps, dispatch]);

 

  return (
    <main className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Inventory RFID</h2>
       
      </div>
      {stepsLoading ? (
        <div className="flex items-center gap-2 text-blue-600 animate-pulse mb-4">
          <span className="w-4 h-4 rounded-full bg-blue-400 animate-bounce"></span>
          <span>Loading steps...</span>
        </div>
      ) : stepsError ? (
        <div className="text-red-600 font-semibold mb-4">{stepsError}</div>
      ) : (
        <StepMultiSelect
          steps={steps}
          selectedSteps={selectedSteps}
          onChange={setSelectedSteps}
        />
      )}
      {selectedSteps.length === 0 && (
        <p className="text-gray-400 text-center mt-8">Select a step to display the inventory</p>
      )}
      {error && (
        <div className="text-red-600 font-semibold mb-4 text-center">{error}</div>
      )}
      {selectedSteps.includes(SELECT_ALL) ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">All steps</h2>
          <div className="border-2 border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 shadow">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <InventoryTable inventory={Array.isArray(inventory) ? inventory : []} />
            )}
          </div>
        </div>
      ) : (
        selectedSteps.map((step) => (
          <div key={step} className="mb-8">
            <h2 className="text-xl font-semibold mb-2 text-gray-700 dark:text-gray-200">{step}</h2>
            <div className="border-2 border-gray-300 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800 shadow">
              {loadingSteps.includes(step) ? (
                <div className="flex justify-center items-center h-24">
                  <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <InventoryTable inventory={multiInventory[step] || []} />
              )}
            </div>
          </div>
        ))
      )}
    </main>
  );
}