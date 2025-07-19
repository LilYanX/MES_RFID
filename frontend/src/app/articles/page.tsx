"use client";
import { useEffect, useState } from "react";
import ArticleSearchBar from "./components/ArticleSearchBar";
import ArticlesTable from "./components/ArticlesTable";
import ArticleDetails from "./components/ArticleDetails";

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

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-6">Liste des articles (UUID)</h2>
      <ArticleSearchBar search={search} setSearch={setSearch} />
      <ArticlesTable articles={filteredArticles} onSelect={(uuid) => { setUuid(uuid); fetchData(uuid); }} />
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : article ? (
        <ArticleDetails article={article} events={events} />
      ) : null}
    </div>
  );
}
