import React from "react";

export default function PieChart({ data }: { data: { [step: string]: number } }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  let startAngle = 0;
  const colors = ["#3b82f6", "#f59e42", "#10b981", "#ef4444", "#6366f1", "#eab308"];
  let i = 0;
  const radius = 50;
  const center = 60;
  const pieSlices = Object.entries(data).map(([label, value]) => {
    const angle = (value / total) * 360;
    const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
    const endAngle = startAngle + angle;
    const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);
    const largeArc = angle > 180 ? 1 : 0;
    const pathData = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;
    const color = colors[i % colors.length];
    startAngle += angle;
    i++;
    return (
      <path key={label} d={pathData} fill={color} stroke="#fff" strokeWidth="2" />
    );
  });
  // Légende
  return (
    <div className="flex flex-col items-center">
      <svg width="120" height="120" viewBox="0 0 120 120">
        {pieSlices}
      </svg>
      <div className="flex flex-col gap-2 mt-2">
        {Object.keys(data).map((label, idx) => (
          <div key={label} className="flex items-center gap-2 text-sm">
            <span style={{ background: colors[idx % colors.length] }} className="inline-block w-3 h-3 rounded-full"></span>
            {label}
          </div>
        ))}
      </div>
    </div>
  );
} 