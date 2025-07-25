"use client";

import React, { useState, useEffect } from "react";
import axios from "@/utils/config/axiosConfig";

interface Step {
  _id?: string;
  step_id: number;
  step_name: string;
  reader_type: string;
  description?: string;
  created_at?: string;
}

const READER_TYPES = [
  "Portal Reader",
  "Overhead Array", 
  "Handheld Scanner",
  "Fixed Reader",
  "Mobile Reader"
];

const StepsTab = () => {
  const [steps, setSteps] = useState<Step[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formStep, setFormStep] = useState<Step>({
    step_id: 0,
    step_name: "",
    reader_type: "Portal Reader",
    description: "",
  });
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSteps();
  }, []);

  const fetchSteps = async () => {
    try {
      const response = await axios.get("/steps");
      setSteps(Array.isArray(response.data) ? response.data : []);
    } catch (e: any) {
      console.error("Error fetching steps:", e.message);
      setFormError(`Failed to load steps: ${e.message}`);
      setSteps([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    
    try {
      // Auto-increment step_id
      const step_id = steps.length > 0 ? Math.max(...steps.map((s) => s.step_id)) + 1 : 1;
      const newStep = { ...formStep, step_id };
      
      const response = await axios.post("/steps", newStep);
      
      setSteps([...steps, response.data]);
      setShowAddModal(false);
      setFormStep({ step_id: 0, step_name: "", reader_type: "Portal Reader", description: "" });
    } catch (e: any) {
      console.error("Error adding step:", e);
      setFormError(e.response?.data?.detail || e.message || "Failed to add step. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    
    try {
      const response = await axios.put(`/steps/${formStep._id}`, formStep);
      setSteps(steps.map(step => step._id === formStep._id ? response.data : step));
      setShowEditModal(false);
      setFormStep({ step_id: 0, step_name: "", reader_type: "Portal Reader", description: "" });
    } catch (e: any) {
      console.error("Error updating step:", e);
      setFormError(e.response?.data?.detail || e.message || "Failed to update step. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStep = async (stepId: number) => {
    if (!window.confirm('Are you sure you want to delete this step?')) return;
    
    try {
      // Trouver l'ID MongoDB correspondant au step_id
      const stepToDelete = steps.find(step => step.step_id === stepId);
      if (!stepToDelete?._id) throw new Error('Step not found');
      
      await axios.delete(`/steps/${stepToDelete._id}`);
      setSteps(steps.filter(step => step.step_id !== stepId));
    } catch (e: any) {
      console.error("Error deleting step:", e);
      setFormError(e.response?.data?.detail || e.message || "Failed to delete step. Please try again.");
    }
  };

  const handleUpdateStep = (step: Step) => {
    // S'assurer que l'ID MongoDB est utilisé pour la mise à jour
    const stepToUpdate = steps.find(s => s.step_id === step.step_id);
    if (!stepToUpdate?._id) {
      console.error('Step not found for update');
      return;
    }
    
    setFormStep({
      ...step,
      _id: stepToUpdate._id
    });
    setShowEditModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading steps...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Process Steps Management</h2>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Manage process steps and their configurations</p>
        <button
          onClick={() => {
            setFormStep({ step_id: 0, step_name: "", reader_type: "Portal Reader", description: "" });
            setShowAddModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          <span>+</span>
          Add Step
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step ID</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Step Name</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reader Type</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {steps.map((step) => (
              <tr key={step._id} className="hover:bg-gray-50">
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {step.step_id}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{step.step_name}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {step.reader_type}
                  </span>
                </td>
                <td className="py-4 px-4 text-sm text-gray-900 max-w-xs truncate">{step.description}</td>
                <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateStep(step)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteStep(step.step_id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {steps.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No process steps configured yet.
          </div>
        )}
      </div>

      {/* Add Step Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowAddModal(false)}
            >×</button>
            
            <h2 className="text-lg font-semibold mb-4">Add New Step</h2>
            
            <form onSubmit={handleAddStep}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step Name
                </label>
                <input
                  type="text"
                  value={formStep.step_name}
                  onChange={(e) => setFormStep({...formStep, step_name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reader Type
                </label>
                <select
                  value={formStep.reader_type}
                  onChange={(e) => setFormStep({...formStep, reader_type: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  {READER_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formStep.description}
                  onChange={(e) => setFormStep({...formStep, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Optional description of this step..."
                />
              </div>
              
              {formError && (
                <div className="mb-4 text-red-600 text-sm">{formError}</div>
              )}
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {formLoading ? "Creating..." : "Create Step"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Step Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowEditModal(false)}
            >×</button>
            
            <h2 className="text-lg font-semibold mb-4">Edit Step</h2>
            
            <form onSubmit={handleEditStep}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step Name
                </label>
                <input
                  type="text"
                  value={formStep.step_name}
                  onChange={(e) => setFormStep({...formStep, step_name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reader Type
                </label>
                <select
                  value={formStep.reader_type}
                  onChange={(e) => setFormStep({...formStep, reader_type: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  {READER_TYPES.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formStep.description}
                  onChange={(e) => setFormStep({...formStep, description: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Optional description of this step..."
                />
              </div>
              
              {formError && (
                <div className="mb-4 text-red-600 text-sm">{formError}</div>
              )}
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {formLoading ? "Updating..." : "Update Step"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StepsTab;
