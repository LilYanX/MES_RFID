"use client";
import { useEffect, useState } from "react";

// Types
interface Article {
  uuid: string;
  type: string;
  color: string;
  size: string;
  material: string;
  washing_time_min: number;
  drying_time_min: number;
  pre_treatment: string;
  care_label: string;
  dispatch_zone: string;
  quality_requirements: string;
  notes: string;
}
interface RfidEvent {
  uuid: string;
  step_id: number;
  step_name: string;
  reader_type: string;
  operator: string;
  timestamp: string;
}

// Données mock pour démo
const mockArticle: Article = {
  uuid: "78CBBC9E",
  type: "Pantalon",
  color: "Bleu marine",
  size: "L",
  material: "Coton",
  washing_time_min: 35,
  drying_time_min: 25,
  pre_treatment: "Anti-tâches",
  care_label: "Lavage à 40°C, ne pas blanchir",
  dispatch_zone: "Nord",
  quality_requirements: "Inspection visuelle, vérification couture",
  notes: "Article fragile, éviter surcharges"
};
const mockEvents: RfidEvent[] = [
  {
    uuid: "78CBBC9E",
    step_id: 1,
    step_name: "Collection & Intake",
    reader_type: "Handheld Writer",
    operator: "Unknown",
    timestamp: "2025-07-14T14:05:04.490+00:00"
  },
  {
    uuid: "78CBBC9E",
    step_id: 2,
    step_name: "Washing",
    reader_type: "Tunnel",
    operator: "Alice",
    timestamp: "2025-07-14T15:10:00.000+00:00"
  },
  {
    uuid: "78CBBC9E",
    step_id: 3,
    step_name: "Drying",
    reader_type: "Tunnel",
    operator: "Bob",
    timestamp: "2025-07-14T16:00:00.000+00:00"
  }
];

export default function ArticlesPage() {
  const [uuid, setUuid] = useState("");
  const [article, setArticle] = useState<Article|null>(null);
  const [events, setEvents] = useState<RfidEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");

  // Charger tous les articles au montage
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/articles");
        const data = await res.json();
        if (Array.isArray(data)) {
          setArticles(data);
        } else if (Array.isArray(data.articles)) {
          setArticles(data.articles);
        } else {
          setArticles([]);
          console.error('Réponse inattendue de /api/articles:', data);
        }
      } catch (e) {
        setArticles([]);
      }
    };
    fetchArticles();
  }, []);

  // Recherche et affichage détail/historique

  // Filtrage articles selon la recherche
  const filteredArticles = articles.filter(a => a.uuid.toLowerCase().includes(search.toLowerCase()));

  const fetchData = async (uuid: string) => {
    setLoading(true);
    setError("");
    try {
      // Remplace par tes vrais endpoints si dispo
      // const aRes = await fetch(`/api/articles/${uuid}`);
      // const eRes = await fetch(`/api/rfid_events/${uuid}`);
      // const article = await aRes.json();
      // const events = await eRes.json();
      // setArticle(article);
      // setEvents(events);
      // Appels réels backend
      const aRes = await fetch(`http://localhost:8000/api/articles/${uuid}`);
      if (!aRes.ok) throw new Error('Article non trouvé');
      const article = await aRes.json();
      setArticle(article);
      const eRes = await fetch(`http://localhost:8000/api/rfid_events/${uuid}`);
      const events = await eRes.json();
      setEvents(Array.isArray(events) ? events : []);
    } catch (e) {
      setError("Article non trouvé ou erreur serveur.");
      setArticle(null);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  // Pour la démo, charge le mock par défaut
  useEffect(() => {
    fetchData("78CBBC9E");
  }, []);

  const currentStep = events.length > 0 ? events[events.length-1].step_name : "-";

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Liste des articles (UUID)</h2>
      <div className="mb-6 flex gap-4 items-center">
        <input
          type="text"
          className="border rounded-lg px-3 py-2 flex-1"
          placeholder="Rechercher par UUID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="bg-white rounded-xl shadow p-6 mb-8">
        <table className="min-w-full text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">UUID</th>
              <th className="py-2 px-4">Type</th>
              <th className="py-2 px-4">Couleur</th>
              <th className="py-2 px-4">Taille</th>
              <th className="py-2 px-4">Matière</th>
              <th className="py-2 px-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredArticles.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-gray-400 py-4">Aucun article trouvé.</td>
              </tr>
            ) : (
              filteredArticles.map((a) => (
                <tr key={a.uuid} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">
                    <button
                      className="text-blue-600 underline"
                      onClick={() => { setUuid(a.uuid); fetchData(a.uuid); }}
                    >
                      {a.uuid}
                    </button>
                  </td>
                  <td className="py-2 px-4">{a.type}</td>
                  <td className="py-2 px-4">{a.color}</td>
                  <td className="py-2 px-4">{a.size}</td>
                  <td className="py-2 px-4">{a.material}</td>
                  <td className="py-2 px-4">
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      onClick={() => { setUuid(a.uuid); fetchData(a.uuid); }}
                    >
                      Voir détail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Affichage fiche article et historique RFID */}
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : article ? (
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h3 className="text-xl font-semibold mb-2">Fiche article</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div><span className="font-semibold">UUID :</span> {article.uuid}</div>
            <div><span className="font-semibold">Type :</span> {article.type}</div>
            <div><span className="font-semibold">Couleur :</span> {article.color}</div>
            <div><span className="font-semibold">Taille :</span> {article.size}</div>
            <div><span className="font-semibold">Matière :</span> {article.material}</div>
            <div><span className="font-semibold">Pré-traitement :</span> {article.pre_treatment}</div>
            <div><span className="font-semibold">Étiquette entretien :</span> {article.care_label}</div>
            <div><span className="font-semibold">Zone dispatch :</span> {article.dispatch_zone}</div>
            <div><span className="font-semibold">Qualité :</span> {article.quality_requirements}</div>
            <div><span className="font-semibold">Notes :</span> {article.notes}</div>
          </div>
          <h4 className="font-semibold mb-2 mt-4">Historique RFID</h4>
          <table className="min-w-full text-center">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4">Étape</th>
                <th className="py-2 px-4">Type lecteur</th>
                <th className="py-2 px-4">Opérateur</th>
                <th className="py-2 px-4">Date/heure</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2 px-4">{event.step_name}</td>
                  <td className="py-2 px-4">{event.reader_type}</td>
                  <td className="py-2 px-4">{event.operator}</td>
                  <td className="py-2 px-4">{new Date(event.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  );
}
