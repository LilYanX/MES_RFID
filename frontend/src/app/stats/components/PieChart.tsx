import React, { useState, useRef } from "react";

interface PieChartData {
  [key: string]: number;
}

interface Slice {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

interface PieChartProps {
  data: PieChartData;
  size?: number;
  colors?: string[];
}

export default function PieChart({ data, size = 200, colors = ["#3b82f6", "#f59e42", "#10b981", "#ef4444", "#6366f1", "#eab308"] }: PieChartProps) {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const total = Object.values(data).reduce((a, b) => a + b, 0);
  const slices = Object.entries(data).map(([label, value], index) => ({
    label,
    value,
    percentage: (value / total) * 100,
    color: colors[index % colors.length]
  }));

  let startAngle = 0;
  const radius = size / 2 - 20;
  const center = size / 2;

  const calculateTooltipPosition = (angle: number) => {
    const x = center + radius * 1.2 * Math.cos((Math.PI * angle) / 180);
    const y = center + radius * 1.2 * Math.sin((Math.PI * angle) / 180);
    return { x, y };
  };

  const pieSlices = Object.entries(data).map(([label, value], idx) => {
    const angle = (value / total) * 360;
    const x1 = center + radius * Math.cos((Math.PI * startAngle) / 180);
    const y1 = center + radius * Math.sin((Math.PI * startAngle) / 180);
    const endAngle = startAngle + angle;
    const x2 = center + radius * Math.cos((Math.PI * endAngle) / 180);
    const y2 = center + radius * Math.sin((Math.PI * endAngle) / 180);
    const largeArc = angle > 180 ? 1 : 0;
    const pathData = `M${center},${center} L${x1},${y1} A${radius},${radius} 0 ${largeArc},1 ${x2},${y2} Z`;

    const midpointAngle = startAngle + angle / 2;
    const tooltipPos = calculateTooltipPosition(midpointAngle);

    startAngle += angle;

    return (
      <g key={label} onMouseEnter={() => {
        setHoveredSlice(label);
        setTooltipPosition(tooltipPos);
      }}
      onMouseLeave={() => {
        setHoveredSlice(null);
        setTooltipPosition(null);
      }}>
        <path 
          d={pathData} 
          fill={colors[idx % colors.length]} 
          stroke="#fff" 
          strokeWidth="2"
          className={`${hoveredSlice === label ? "opacity-100" : "opacity-80"}`}
        />
        {hoveredSlice === label && (
          <text 
            x={tooltipPos.x} 
            y={tooltipPos.y} 
            textAnchor="middle" 
            dominantBaseline="central"
            className="text-white text-sm"
          >
            {label}: {value} ({((value / total) * 100).toFixed(1)}%)
          </text>
        )}
      </g>
    );
  });

  return (
    <div className="relative">
      <svg 
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transition-transform hover:scale-105"
      >
        {pieSlices}
        <circle 
          cx={center} 
          cy={center} 
          r={radius * 0.4} 
          fill="white" 
          className="opacity-80"
        />
        <text 
          x={center} 
          y={center} 
          textAnchor="middle" 
          dominantBaseline="central"
          className="text-gray-600 font-medium"
        >
          {total}
        </text>
      </svg>
      <div className="absolute top-0 left-0 w-full">
        <div className="flex flex-col gap-2 mt-4">
          {Object.entries(data).map(([label, value], idx) => (
            <div 
              key={label} 
              className="flex items-center gap-2 text-sm px-4 py-1 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ background: hoveredSlice === label ? colors[idx % colors.length] + "20" : "transparent" }}
            >
              <span 
                style={{ background: colors[idx % colors.length] }} 
                className="inline-block w-3 h-3 rounded-full"
              />
              <span className="flex-1">
                <span className="font-medium">{label}</span>
                <span className="ml-2 text-gray-600">{value}</span>
              </span>
              <span className="text-gray-500">
                {((value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}