import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Award,
  ShieldCheck,
  Sparkles,
  Leaf,
  IndianRupee,
  Utensils,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  TrendingDown,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMAND_HISTORY_7DAYS } from '../data/mockData';
import { WasteBarChart } from './Charts';

export const ImpactDashboard: React.FC = () => {
  const { campusImpact, personalImpact } = useApp();

  return (
    <div className="space-y-8">
      {/* ── Top Hero Banner ─────────────────────────────────────────── */}
      <section className="relative rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-slate-900/95 via-emerald-950/20 to-slate-950/95 backdrop-blur-xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <Leaf className="w-3.5 h-3.5" />
            <span>Sustainability Impact Dashboard • Campus Verified</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Campus <span className="text-emerald-400">Impact Metrics</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            Every predicted portion and rescued meal directly avoids greenhouse emissions, recovers vendor revenue, and saves students money.
          </p>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-400 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>
              <strong>Estimated Environmental Impact:</strong> Figures calculated using standardized food lifecycle emissions benchmarks (≈2.5 kg CO₂e per 1 kg food waste diverted).
            </span>
          </div>
        </div>
      </section>

      {/* ── Today vs This Month Metrics Grid ────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Campus Impact */}
        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Today’s Campus Impact (28 Aug)</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
              Live Verified
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Overproduction Avoided</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {campusImpact.today.foodAvoidedKg} kg
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Prevented before cooking</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Meals Rescued</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {campusImpact.today.mealsRescued}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Via Rescue Radar</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Vendor Value Recovered</span>
              <span className="text-2xl font-black text-sky-400 font-mono">
                ₹{campusImpact.today.vendorValueRecoveredInr.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Direct vendor payout</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Forecast Accuracy</span>
              <span className="text-2xl font-black text-emerald-300 font-mono">
                {campusImpact.today.forecastAccuracy}%
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">BiteLoop ML engine</span>
            </div>
          </div>
        </section>

        {/* This Month's Cumulative Impact */}
        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>This Month’s Campus Total (August)</span>
            </h3>
            <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              Aggregated
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Total Food Saved</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                {campusImpact.month.foodSavedKg} kg
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">≈ 1,450 meal equivalents</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Radar Rescue Meals</span>
              <span className="text-2xl font-black text-amber-400 font-mono">
                {campusImpact.month.rescueMeals}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Claimed by students</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Student Savings</span>
              <span className="text-2xl font-black text-emerald-400 font-mono">
                ₹{campusImpact.month.studentSavingsInr.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Kept in student pockets</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Vendor Revenue Recovery</span>
              <span className="text-2xl font-black text-amber-300 font-mono">
                ₹{campusImpact.month.vendorRecoveryInr.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Zero write-off</span>
            </div>
          </div>
        </section>
      </div>

      {/* ── Charts: Waste Avoided Over Time & Accuracy Trend ───────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: 7-Day Waste Prevention & Rescued Meals Chart */}
        <section className="lg:col-span-8 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Waste Prevented (kg) & Daily Forecast Accuracy</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">7-Day Trend</span>
          </div>

          <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-4">
            <WasteBarChart data={DEMAND_HISTORY_7DAYS} />
          </div>
        </section>

        {/* Right 4 cols: Personal Student Impact Card ──────────────── */}
        <section className="lg:col-span-4 rounded-3xl border border-violet-500/40 bg-gradient-to-b from-slate-900/90 to-violet-950/20 backdrop-blur-md p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-violet-400" />
              <h3 className="text-sm font-black text-white">My Personal Impact</h3>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-violet-500/20 text-violet-300 border border-violet-500/40">
              Student Profile
            </span>
          </div>

          {/* Student Badges */}
          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Meals Rescued by Me</span>
                <span className="text-xl font-black text-amber-400 font-mono">{personalImpact.mealsRescued}</span>
              </div>
              <span className="text-2xl">🍱</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">Money Saved via Radar</span>
                <span className="text-xl font-black text-emerald-400 font-mono">₹{personalImpact.moneySavedInr}</span>
              </div>
              <span className="text-2xl">💰</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-slate-500 block">CO₂e Avoided</span>
                <span className="text-xl font-black text-emerald-300 font-mono">{personalImpact.co2PreventedKg} kg</span>
              </div>
              <span className="text-2xl">🌱</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-violet-950/40 border border-violet-500/30 text-center space-y-1">
              <span className="text-[10px] uppercase font-mono text-violet-400 font-bold block">
                Campus Sustainability Standing
              </span>
              <p className="text-base font-black text-white">
                Top <strong className="text-emerald-400">18%</strong> of VIT Campus Eco-Diners
              </p>
              <p className="text-[10px] text-slate-400">
                Ranked by meal rescue participation & zero-waste meal choices.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
