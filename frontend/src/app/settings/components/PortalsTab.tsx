"use client";

import React, { useState, useEffect } from "react";
import axios from "@/utils/config/axiosConfig";

interface Portal {
  _id: string;
  name: string;
  etape: string;
  ip: string;
  etat: "online" | "offline" | "maintenance";
  last_activity?: string | null;
  type: string;
  firmware?: string;
  temperature?: number | null;
  commentaire?: string;
}

interface Step {
  _id?: string;
  step_id: number;
  step_name: string;
}

const initialFormState: Portal = {
  _id: "",
  name: "",
  etape: "1",
  ip: "",
  etat: "online",
  type: "Lecteur UHF fixe",
  firmware: "",
  commentaire: "",
  temperature: null
};

const PortalsTab = () => {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [formPortal, setFormPortal] = useState<Portal>({...initialFormState});
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortals = async () => {
      try {
        const response = await axios.get("/portals");
        setPortals(Array.isArray(response.data) ? response.data : []);
      } catch (e: any) {
        console.error("Error fetching portals:", e);
        setFormError(e.response?.data?.detail || e.message || "Failed to load portals.");
        setPortals([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchSteps = async () => {
      try {
        const response = await axios.get("/steps");
        setSteps(Array.isArray(response.data) ? response.data : []);
      } catch (err: any) {
        console.error("Error fetching steps:", err);
        setFormError(`Failed to load steps: ${err.message}`);
      }
    };

    fetchPortals();
    fetchSteps();
  }, []);

  const handleDeletePortal = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this portal?")) return;
    
    try {
      await axios.delete(`/portals/${id}`);
      setPortals(portals.filter(portal => portal._id !== id));
    } catch (e: any) {
      console.error("Error deleting portal:", e);
      setFormError(e.response?.data?.detail || e.message || "Failed to delete portal.");
    }
  };

  const handleAddPortal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    
    try {
      const response = await axios.post("/portals", formPortal);
      setPortals([...portals, response.data]);
      setShowAddModal(false);
      setFormPortal({...initialFormState});
    } catch (e: any) {
      console.error("Error adding portal:", e);
      setFormError(e.response?.data?.detail || e.message || "Failed to add portal. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditPortal = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormLoading(true);
    
    try {
      const response = await axios.put(`/portals/${formPortal._id}`, formPortal);
      setPortals(portals.map(portal => portal._id === formPortal._id ? response.data : portal));
      setShowEditModal(false);
      setFormPortal({...initialFormState});
    } catch (e: any) {
      console.error("Error updating portal:", e);
      setFormError(e.response?.data?.detail || e.message || "Failed to update portal. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditClick = (portal: Portal) => {
    setFormPortal(portal);
    setShowEditModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800";
      case "offline":
        return "bg-red-100 text-red-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStepName = (etape: string) => {
    const step = steps.find(s => s.step_id.toString() === etape);
    return step ? step.step_name : `Etape ${etape}`;
  };

  const formatLastSeen = (lastSeen: string | null | undefined) => {
    if (!lastSeen) return "Never";
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading portals...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">RFID Portal Management</h2>
      
      <div className="mb-6 flex justify-between items-center">
        <p className="text-gray-600">Manage RFID portals and their configurations</p>
        <button
          onClick={() => {
            setFormPortal({
              ...initialFormState,
              etape: steps.length > 0 ? steps[0]._id || "1" : "1",
              etat: "offline",
              type: "RFID"
            });
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <span className="mr-2">+</span> Add Portal
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="p-4 text-center">Loading portals...</div>
        ) : portals.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No portals found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Étape
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    État
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portals.map((portal) => (
                  <tr key={portal._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {portal.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {portal.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getStepName(portal.etape)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {portal.ip}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(portal.etat)}`}>
                        {portal.etat === 'online' ? 'En ligne' : 
                         portal.etat === 'offline' ? 'Hors ligne' : 'Maintenance'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEditClick(portal)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeletePortal(portal._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Portal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowAddModal(false)}
            >×</button>
            
            <h2 className="text-lg font-semibold mb-4">Add New Portal</h2>
            
            <form onSubmit={handleAddPortal}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du portail
                </label>
                <input
                  type="text"
                  value={formPortal.name}
                  onChange={(e) => setFormPortal({...formPortal, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Portail d'entrée principal"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de portail
                  </label>
                  <select
                    value={formPortal.type}
                    onChange={(e) => setFormPortal({...formPortal, type: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="RFID">RFID</option>
                    <option value="QRCODE">QR Code</option>
                    <option value="NFC">NFC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    État
                  </label>
                  <select
                    value={formPortal.etat}
                    onChange={(e) => setFormPortal({...formPortal, etat: e.target.value as "online" | "offline" | "maintenance"})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="online">En ligne</option>
                    <option value="offline">Hors ligne</option>
                    <option value="maintenance">En maintenance</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étape associée
                </label>
                <select
                  value={formPortal.etape}
                  onChange={(e) => setFormPortal({...formPortal, etape: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  {steps.map((step) => (
                    <option key={step.step_id} value={step.step_id.toString()}>
                      {step.step_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse IP
                  </label>
                  <input
                    type="text"
                    value={formPortal.ip}
                    onChange={(e) => setFormPortal({...formPortal, ip: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="192.168.1.100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Firmware
                  </label>
                  <input
                    type="text"
                    value={formPortal.firmware || ''}
                    onChange={(e) => setFormPortal({...formPortal, firmware: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="1.0.0"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire
                </label>
                <textarea
                  value={formPortal.commentaire || ''}
                  onChange={(e) => setFormPortal({...formPortal, commentaire: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Notes supplémentaires sur ce portail..."
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
                  {formLoading ? "Creating..." : "Create Portal"}
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

      {/* Edit Portal Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setShowEditModal(false)}
            >×</button>
            
            <h2 className="text-lg font-semibold mb-4">Edit Portal</h2>
            
            <form onSubmit={handleEditPortal}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du portail
                </label>
                <input
                  type="text"
                  value={formPortal.name}
                  onChange={(e) => setFormPortal({...formPortal, name: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type de portail
                  </label>
                  <select
                    value={formPortal.type}
                    onChange={(e) => setFormPortal({...formPortal, type: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="Lecteur UHF fixe">Lecteur UHF fixe</option>
                    <option value="Lecteur UHF mobile">Lecteur UHF mobile</option>
                    <option value="Lecteur QR Code">Lecteur QR Code</option>
                    <option value="Lecteur NFC">Lecteur NFC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    État
                  </label>
                  <select
                    value={formPortal.etat}
                    onChange={(e) => setFormPortal({...formPortal, etat: e.target.value as "online" | "offline" | "maintenance"})}
                    className="w-full border rounded-lg px-3 py-2"
                    required
                  >
                    <option value="online">En ligne</option>
                    <option value="offline">Hors ligne</option>
                    <option value="maintenance">En maintenance</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Étape associée
                </label>
                <select
                  value={formPortal.etape}
                  onChange={(e) => setFormPortal({...formPortal, etape: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  required
                >
                  {steps.map((step) => (
                    <option key={step.step_id} value={step.step_id.toString()}>
                      {step.step_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse IP
                  </label>
                  <input
                    type="text"
                    value={formPortal.ip}
                    onChange={(e) => setFormPortal({...formPortal, ip: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="192.168.1.100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Firmware Version
                  </label>
                  <input
                    type="text"
                    value={formPortal.firmware || ''}
                    onChange={(e) => setFormPortal({...formPortal, firmware: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                    placeholder="1.0.0"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire
                </label>
                <textarea
                  value={formPortal.commentaire || ''}
                  onChange={(e) => setFormPortal({...formPortal, commentaire: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                  rows={3}
                  placeholder="Notes supplémentaires sur ce portail..."
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
                  {formLoading ? "Updating..." : "Update Portal"}
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

export default PortalsTab;
