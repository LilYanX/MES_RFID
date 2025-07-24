import React from "react";

interface InventoryItem {
  reference: string;
  uuid: string;
  step_name: string;
}

export default function InventoryTable({ inventory }: { inventory: InventoryItem[] }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
      <table className="min-w-full text-center">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4">Reference</th>
            <th className="py-2 px-4">UUID</th>
            <th className="py-2 px-4">Step</th>
          </tr>
        </thead>
        <tbody>
          {inventory.length === 0 ? (
            <tr>
              <td colSpan={3} className="py-4 text-gray-400">No article in inventory.</td>
            </tr>
          ) : (
            inventory
              .filter(item => item && item.reference && item.uuid && item.step_name)
              .map((item, idx) => (
                <tr key={item.uuid + idx} className="border-t hover:bg-gray-50">
                  <td className="py-2 px-4">{item.reference}</td>
                  <td className="py-2 px-4">{item.uuid}</td>
                  <td className="py-2 px-4">{item.step_name}</td>
                </tr>
              ))
          )}
        </tbody>
      </table>
    </div>
  );
} 