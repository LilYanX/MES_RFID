"use client";
import React from "react";

interface Portal {
  _id: string;
  name: string;
  etape: string;
  ip: string;
  etat: string;
  last_activity: string | null;
  type: string;
  firmware: string;
  temperature: number | null;
  commentaire: string;
}

interface Props {
  portal: Portal | null;
  onClose: () => void;
}

export default function PortalDetailsModal({ portal, onClose }: Props) {
  if (!portal) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 min-w-[320px] max-w-[90vw] relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">{portal.name}</h2>
        <ul className="space-y-1">
          <li><b>Step:</b> {portal.etape}</li>
          <li><b>IP:</b> {portal.ip}</li>
          <li><b>Status:</b> <span style={{color: portal.etat === "online" ? "green" : portal.etat === "attention" ? "orange" : "red", fontWeight: "bold"}}>{portal.etat}</span></li>
          <li><b>Temperature:</b> {portal.temperature !== null ? `${portal.temperature}°C` : "-"}</li>
          <li><b>Type:</b> {portal.type}</li>
          <li><b>Firmware:</b> {portal.firmware}</li>
          <li><b>Last activity:</b> {portal.last_activity || "-"}</li>
          <li><b>Comment:</b> {portal.commentaire}</li>
        </ul>
      </div>
    </div>
  );
}
