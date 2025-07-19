export default function DashboardHeader({ count }: { count: number }) {
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Dashboard - MES RFID</h1>
      <p className="mb-4">
        Nombre d’articles en cours de traitement : <strong>{count}</strong>
      </p>
    </>
  );
} 