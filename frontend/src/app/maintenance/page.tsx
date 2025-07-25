"use client";
"use client";
import React, { useEffect, useState } from "react";


interface Portal {
  _id: string;
  name: string;
  etape: string;
  ip: string;
  etat: "online" | "maintenance" | "offline";
  last_activity: string | null;
  type: string;
  firmware: string;
  temperature: number | null;
  commentaire: string;
}

const fetchPortals = async (): Promise<Portal[]> => {
  try {
    const res = await fetch("http://localhost:8000/api/portals");
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error loading portals:", error);
    throw error;
  }
};

export default function MaintenancePage() {
  const [portals, setPortals] = useState<Portal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPortal, setSelectedPortal] = useState<Portal | null>(null);

  useEffect(() => {
    const loadPortals = async () => {
      try {
        const data = await fetchPortals();
        setPortals(data);
        if (data.length > 0) {
          const portal1 = data.find(p => parseInt(p.etape) === 1) || data[0];
          setSelectedPortal(portal1);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    loadPortals();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Trier les portails par numéro d'étape croissant (etape peut contenir du texte, on prend le début numérique)
  const getStepNumber = (etape: string): number => {
    const match = etape.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };
  const sortedPortals = [...portals].sort((a, b) => getStepNumber(a.etape) - getStepNumber(b.etape));

  // Couleur selon état
  const getStateColor = (etat: Portal["etat"]) => {
    switch (etat) {
      case "online":
        return "bg-green-400 border-green-700";
      case "maintenance":
        return "bg-orange-300 border-orange-600";
      case "offline":
        return "bg-red-300 border-red-600";
      default:
        return "bg-gray-300 border-gray-600";
    }
  };

  // Icône selon état
  const getStateIcon = (etat: Portal["etat"]) => {
    switch (etat) {
      case "online":
        return "🟢";
      case "maintenance":
        return "🟠";
      case "offline":
        return "🔴";
      default:
        return "❓";
    }
  };

  // Handlers pour les actions
  const handleReboot = (portal: Portal) => {
    alert(`Reboot requested for ${portal.name} (${portal.ip})`);
    // TODO: Appeler l'API backend pour rebooter le portail
  };
  const handleForceScan = (portal: Portal) => {
    alert(`Test forced scan for ${portal.name} (${portal.ip})`);
    // TODO: Appeler l'API backend pour forcer un scan
  };
  const handleShowHistory = (portal: Portal) => {
    alert(`View history for ${portal.name}`);
    // TODO: Naviguer ou afficher l'historique de ce portail
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Process Flow - RFID Maintenance</h1>
      <div className="flex flex-col items-center">
        {/* Process flow sur deux lignes pour éviter le scroll et améliorer la lisibilité */}
        <div className="flex flex-col items-center gap-8 w-full max-w-5xl mx-auto">
          {[0, 1].map((row) => (
            <div key={row} className="flex flex-row items-center justify-center gap-8 w-full">
              {sortedPortals.slice(row * 4, row * 4 + 4).map((portal, idx, arr) => (
                <React.Fragment key={portal._id}>
                  <button
                    className={`relative flex flex-col items-center border-4 rounded-xl shadow-lg px-6 py-4 w-40 h-40 transition-transform hover:scale-105 cursor-pointer ${getStateColor(portal.etat)} ${selectedPortal?._id === portal._id ? 'ring-4 ring-blue-400' : ''}`}
                    title={portal.name}
                    onClick={() => setSelectedPortal(portal)}
                  >
                    <span className="text-5xl mb-2">{getStateIcon(portal.etat)}</span>
                    <span className="font-semibold text-base text-center">{portal.name}</span>
                    <span className="text-xs text-gray-700">{getStepNumber(portal.etape)}</span>
                  </button>
                  {/* Flèche sauf dernier portail de la ligne */}
                  {idx !== arr.length - 1 && (
                    <span key={portal._id + "-arrow"} className="text-3xl text-gray-400 self-center">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Affichage visuel des détails */}
      <div className="mt-10 flex flex-col items-center justify-center">
        {selectedPortal && (
          <>
            <div className="flex flex-col md:flex-row gap-8 items-center bg-white rounded-2xl shadow-2xl p-8 border-4 border-blue-200 max-w-3xl w-full animate-fade-in">
              <div className="flex flex-col items-center gap-2 w-48">
                <span className="text-7xl" style={{
                  filter: selectedPortal.etat === 'online' ? 'drop-shadow(0 0 10px #22c55e)' : selectedPortal.etat === 'maintenance' ? 'drop-shadow(0 0 10px #f59e42)' : 'drop-shadow(0 0 10px #ef4444)'
                }}>{getStateIcon(selectedPortal.etat)}</span>
                <span className="text-lg font-bold text-blue-800 text-center">{selectedPortal.name}</span>
                <span className="text-sm text-gray-600">Step {getStepNumber(selectedPortal.etape)}</span>
                <span className={`px-3 py-1 rounded-full text-white text-xs mt-2 ${selectedPortal.etat === 'online' ? 'bg-green-500' : selectedPortal.etat === 'maintenance' ? 'bg-orange-400' : 'bg-red-500'}`}>{selectedPortal.etat === 'online' ? 'OK' : selectedPortal.etat === 'maintenance' ? 'maintenance' : 'Failure'}</span>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4 text-base min-w-[200px]">
                <div className="font-semibold text-gray-700">IP:</div>
                <div className="text-gray-900">{selectedPortal.ip}</div>
                <div className="font-semibold text-gray-700">Type:</div>
                <div className="text-gray-900">{selectedPortal.type}</div>
                <div className="font-semibold text-gray-700">Firmware:</div>
                <div className="text-gray-900">{selectedPortal.firmware}</div>
                <div className="font-semibold text-gray-700">Temperature:</div>
                <div className="text-gray-900">{selectedPortal.temperature !== null ? `${selectedPortal.temperature}°C` : '-'}</div>
                <div className="font-semibold text-gray-700">Last activity:</div>
                <div className="text-gray-900">{selectedPortal.last_activity || '-'}</div>
                <div className="font-semibold text-gray-700 col-span-2">Comment:</div>
                <div className="text-gray-900 col-span-2 italic">{selectedPortal.commentaire}</div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-row gap-6 mt-6">
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 font-semibold shadow transition"
                onClick={() => handleReboot(selectedPortal)}
              >
                <span className="text-xl">🔁</span> Reboot
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-orange-100 hover:bg-orange-200 text-orange-900 font-semibold shadow transition"
                onClick={() => handleForceScan(selectedPortal)}
              >
                <span className="text-xl">🧪</span> Force scan test
              </button>
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold shadow transition"
                onClick={() => handleShowHistory(selectedPortal)}
              >
                <span className="text-xl">📋</span> View history
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

