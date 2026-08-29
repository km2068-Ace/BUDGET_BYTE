import React, { useState } from 'react';
import { motion } from 'framer-motion';

export interface DemandChartDataPoint {
  day: string;
  historicalExpected: number;
  aiPredicted: number;
  actualConsumed: number;
  wasteAvoidedKg: number;
  accuracyPercent: number;
}

export const DemandAreaChart: React.FC<{ data: DemandChartDataPoint[] }> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 640;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const minY = 500;
  const maxY = 900;

  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartW;
  const getY = (val: number) => paddingTop + chartH - ((val - minY) / (maxY - minY)) * chartH;

  // Build SVG Paths
  const createSpline = (key: keyof DemandChartDataPoint) => {
    return data.reduce((acc, pt, i) => {
      const x = getX(i);
      const y = getY(pt[key] as number);
      return i === 0 ? `M ${x},${y}` : `${acc} L ${x},${y}`;
    }, '');
  };

  const createAreaPath = (key: keyof DemandChartDataPoint) => {
    const line = createSpline(key);
    const startX = getX(0);
    const endX = getX(data.length - 1);
    const bottomY = getY(minY);
    return `${line} L ${endX},${bottomY} L ${startX},${bottomY} Z`;
  };

  const predictedPath = createSpline('aiPredicted');
  const actualPath = createSpline('actualConsumed');
  const historicalPath = createSpline('historicalExpected');
  const predictedArea = createAreaPath('aiPredicted');
  const actualArea = createAreaPath('actualConsumed');

  return (
    <div className="w-full relative select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ maxHeight: '220px' }}
      >
        <defs>
          <linearGradient id="aiPredictedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="actualConsumedGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#34d399" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal Grid lines */}
        {[550, 650, 750, 850].map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 3}
                fill="#64748b"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Area Fills */}
        <path d={predictedArea} fill="url(#aiPredictedGrad)" />
        <path d={actualArea} fill="url(#actualConsumedGrad)" />

        {/* Lines */}
        <path
          d={historicalPath}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
        <path
          d={predictedPath}
          fill="none"
          stroke="#8b5cf6"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d={actualPath}
          fill="none"
          stroke="#34d399"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Data points & X-Axis labels */}
        {data.map((pt, i) => {
          const x = getX(i);
          const yPred = getY(pt.aiPredicted);
          const yAct = getY(pt.actualConsumed);
          const isHovered = hoveredIdx === i;

          return (
            <g key={pt.day}>
              {/* X Axis Label */}
              <text
                x={x}
                y={height - 8}
                fill={isHovered ? '#f8fafc' : '#64748b'}
                fontSize="10"
                textAnchor="middle"
                fontWeight={isHovered ? 'bold' : 'normal'}
              >
                {pt.day.split(' ')[0]}
              </text>

              {/* Hover Trigger Column */}
              <rect
                x={x - chartW / (data.length * 2)}
                y={paddingTop}
                width={chartW / data.length}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              />

              {/* Point highlights */}
              <circle
                cx={x}
                cy={yPred}
                r={isHovered ? 5 : 3.5}
                fill="#8b5cf6"
                stroke="#0f172a"
                strokeWidth="2"
              />
              <circle
                cx={x}
                cy={yAct}
                r={isHovered ? 5 : 3.5}
                fill="#34d399"
                stroke="#0f172a"
                strokeWidth="2"
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Card Tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute top-2 z-30 p-2.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl text-xs font-mono pointer-events-none transition-all"
          style={{
            left: `${Math.min(Math.max(getX(hoveredIdx) - 60, 10), 480)}px`,
          }}
        >
          <div className="text-white font-bold text-[11px] mb-1">{data[hoveredIdx].day}</div>
          <div className="text-violet-400">AI Predicted: <strong>{data[hoveredIdx].aiPredicted} diners</strong></div>
          <div className="text-emerald-400">Actual Consumed: <strong>{data[hoveredIdx].actualConsumed} diners</strong></div>
          <div className="text-slate-400">Historical Default: <strong>{data[hoveredIdx].historicalExpected} diners</strong></div>
          <div className="text-emerald-300 text-[10px] mt-1 pt-1 border-t border-slate-800">
            ✓ Avoided {data[hoveredIdx].wasteAvoidedKg} kg waste ({data[hoveredIdx].accuracyPercent}% accuracy)
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-2 pt-2 border-t border-slate-900">
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="w-2.5 h-0.5 bg-slate-400 border border-dashed" /> Historical Default
        </span>
        <span className="flex items-center gap-1.5 text-violet-400">
          <span className="w-2.5 h-2.5 rounded-full bg-violet-500" /> AI Predicted Demand
        </span>
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Actual Consumed
        </span>
      </div>
    </div>
  );
};

export const WasteBarChart: React.FC<{ data: DemandChartDataPoint[] }> = ({ data }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const width = 640;
  const height = 210;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const maxVal = 100;
  const getX = (index: number) => paddingLeft + (index / (data.length - 1)) * chartW;
  const getY = (val: number) => paddingTop + chartH - (val / maxVal) * chartH;

  return (
    <div className="w-full relative select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        style={{ maxHeight: '230px' }}
      >
        {/* Horizontal grid */}
        {[25, 50, 75, 100].map((val) => {
          const y = getY(val);
          return (
            <g key={val}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="#1e293b"
                strokeDasharray="4 4"
              />
              <text
                x={paddingLeft - 8}
                y={y + 3}
                fill="#64748b"
                fontSize="10"
                textAnchor="end"
                fontFamily="monospace"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {data.map((pt, i) => {
          const x = getX(i);
          const barW = 14;
          const isHovered = hoveredIdx === i;

          // Bar 1: Waste Avoided Kg
          const wasteH = (pt.wasteAvoidedKg / maxVal) * chartH;
          const wasteY = paddingTop + chartH - wasteH;

          // Bar 2: Accuracy %
          const accH = (pt.accuracyPercent / maxVal) * chartH;
          const accY = paddingTop + chartH - accH;

          return (
            <g key={pt.day}>
              {/* X Axis Label */}
              <text
                x={x}
                y={height - 8}
                fill={isHovered ? '#f8fafc' : '#64748b'}
                fontSize="10"
                textAnchor="middle"
                fontWeight={isHovered ? 'bold' : 'normal'}
              >
                {pt.day.split(' ')[0]}
              </text>

              {/* Bar 1: Waste Avoided (Emerald) */}
              <rect
                x={x - barW - 2}
                y={wasteY}
                width={barW}
                height={wasteH}
                rx={4}
                fill="#34d399"
                className="transition-all duration-200"
                opacity={isHovered ? 1 : 0.85}
              />

              {/* Bar 2: Accuracy (Violet) */}
              <rect
                x={x + 2}
                y={accY}
                width={barW}
                height={accH}
                rx={4}
                fill="#8b5cf6"
                className="transition-all duration-200"
                opacity={isHovered ? 1 : 0.85}
              />

              {/* Hover Trigger Box */}
              <rect
                x={x - barW * 2}
                y={paddingTop}
                width={barW * 4}
                height={chartH}
                fill="transparent"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              />
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {hoveredIdx !== null && (
        <div
          className="absolute top-2 z-30 p-2.5 rounded-xl bg-slate-900/95 border border-slate-700 shadow-xl text-xs font-mono pointer-events-none"
          style={{
            left: `${Math.min(Math.max(getX(hoveredIdx) - 60, 10), 480)}px`,
          }}
        >
          <div className="text-white font-bold text-[11px] mb-1">{data[hoveredIdx].day}</div>
          <div className="text-emerald-400">Food Saved: <strong>{data[hoveredIdx].wasteAvoidedKg} kg</strong></div>
          <div className="text-violet-400">Forecast Accuracy: <strong>{data[hoveredIdx].accuracyPercent}%</strong></div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 text-xs mt-2 pt-2 border-t border-slate-900">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2.5 h-2.5 rounded bg-emerald-400" /> Food Saved (kg)
        </span>
        <span className="flex items-center gap-1.5 text-violet-400">
          <span className="w-2.5 h-2.5 rounded bg-violet-500" /> Forecast Accuracy (%)
        </span>
      </div>
    </div>
  );
};
