import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  Clock,
  Sparkles,
  Flame,
  ShieldAlert,
  Radio,
  ArrowRight,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LiveSurplusMonitor: React.FC = () => {
  const { liveSurplusItem, setIsRescueModalOpen, setActiveTab } = useApp();

  return (
    <section className="rounded-3xl border border-rose-500/40 bg-gradient-to-br from-slate-900/95 via-rose-950/20 to-slate-950/90 backdrop-blur-md p-6 space-y-5 shadow-2xl relative overflow-hidden">
      {/* Ambient alert glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-ping" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">Live Surplus Monitor</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse">
                REAL-TIME TELEMETRY
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Campus Service Window: <strong>{liveSurplusItem.timeString}</strong> • Closing in 48 min</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-rose-500/20 border border-rose-500/60 text-rose-300 text-xs font-black tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(244,63,94,0.25)]">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            {liveSurplusItem.status}
          </span>
        </div>
      </div>

      {/* Main Item Highlight */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="md:col-span-4 space-y-1">
          <span className="text-[10px] font-mono uppercase text-slate-500">Monitored SKU</span>
          <h4 className="text-xl font-black text-white">{liveSurplusItem.name}</h4>
          <p className="text-xs text-slate-400">Canteen Counter B • Dinner Batch 3</p>
        </div>

        {/* Telemetry metrics bar */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-5 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Prepared</span>
            <span className="text-lg font-black text-white font-mono">{liveSurplusItem.prepared}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Sold</span>
            <span className="text-lg font-black text-emerald-400 font-mono">{liveSurplusItem.sold}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Remaining</span>
            <span className="text-lg font-black text-slate-200 font-mono">{liveSurplusItem.remaining}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
            <span className="text-[9px] uppercase font-mono text-slate-500 block">Expected</span>
            <span className="text-lg font-black text-sky-400 font-mono">{liveSurplusItem.expectedDiners}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/50 text-center col-span-2 sm:col-span-1 shadow-[0_0_15px_rgba(244,63,94,0.2)]">
            <span className="text-[9px] uppercase font-mono text-rose-400 block font-bold">Surplus Risk</span>
            <span className="text-lg font-black text-rose-400 font-mono">+{liveSurplusItem.predictedSurplus}</span>
          </div>
        </div>
      </div>

      {/* Action Banner with Start Rescue Drop CTA */}
      <div className="rounded-2xl bg-slate-950/90 border border-slate-800 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-white">
              Recommendation: Convert {liveSurplusItem.predictedSurplus} portions to <strong>Rescue Radar Drop (₹42/meal)</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Recover ₹{liveSurplusItem.predictedSurplus * 42} vendor revenue and prevent 9.5 kg landfill waste.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsRescueModalOpen(true)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 text-slate-950 font-black text-xs shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Rescue Drop</span>
          </motion.button>

          <button
            onClick={() => setActiveTab('rescue-radar')}
            className="hidden lg:flex items-center gap-1 text-xs text-slate-400 hover:text-white px-3 py-2"
          >
            <span>Preview Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
