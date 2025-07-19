import React from "react";

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

export default function ArticleDetails({ article, events }: { article: Article; events: RfidEvent[] }) {
  return (
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
  );
} 