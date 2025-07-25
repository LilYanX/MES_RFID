"use client";
import { useEffect, useState } from "react";
import HistoricTable from "./components/HistoricTable";

interface Scan {
  uuid: string;
  step: string;
  date: string;
}

const mockHistoric: Scan[] = [
  { uuid: "A1B2C3", step: "Reception", date: "2025-07-14T09:15:00" },
  { uuid: "D4E5F6", step: "Control", date: "2025-07-14T10:20:00" },
  { uuid: "G7H8I9", step: "Shipment", date: "2025-07-14T11:45:00" },
];

export default function HistoricPage() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistoric = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/historic");
        if (!res.ok) throw new Error();
        const data = await res.json();
        setScans(data.historic);
      } catch (e) {
        setScans(mockHistoric);
      } finally {
        setLoading(false);
      }
    };
    fetchHistoric();
  }, []);

  return (
    <main className="p-8">
      <h2 className="text-3xl font-bold mb-6">Scan History</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <HistoricTable scans={scans} />
      )}
    </main>
  );
}