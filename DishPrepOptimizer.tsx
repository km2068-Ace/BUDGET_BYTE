import React from 'react';
import { motion } from 'framer-motion';
import {
  ChefHat,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  Layers,
  ArrowDownRight,
  ArrowUpRight,
} from 'lucide-react';
import { DISH_PREP_OPTIMIZATION_PLAN } from '../data/mockData';

export const DishPrepOptimizer: React.FC = () => {
  const totalWastagePortions = DISH_PREP_OPTIMIZATION_PLAN.reduce(
    (acc, cur) => acc + cur.wastageAvoidedPortions,
    0
  );
  const totalWastageKg = DISH_PREP_OPTIMIZATION_PLAN.reduce(
    (acc, cur) => acc + cur.wastageAvoidedKg,
    0
  );

  return (
    <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-6 space-y-5 shadow-xl">
      {/* Title & Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <ChefHat className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black text-white">What should the kitchen prepare?</h3>
            <p className="text-xs text-slate-400">
              Dish-level batch optimization preventing overproduction at the pan
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
            <TrendingDown className="w-4 h-4" />
            <span>Avoided: {totalWastagePortions} portions ({totalWastageKg.toFixed(1)} kg)</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
              <th className="pb-3 pl-2 font-medium">Dish / Category</th>
              <th className="pb-3 font-medium">Vendor</th>
              <th className="pb-3 font-medium text-center">Historical Standard</th>
              <th className="pb-3 font-medium text-center">AI Recommended</th>
              <th className="pb-3 font-medium text-center">Batch Shift</th>
              <th className="pb-3 font-medium text-center">Wastage Avoided</th>
              <th className="pb-3 pr-2 font-medium text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {DISH_PREP_OPTIMIZATION_PLAN.map((item) => {
              const isReduction = item.changePercent < 0;
              const isSurge = item.changePercent > 0;

              return (
                <motion.tr
                  key={item.id}
                  whileHover={{ backgroundColor: 'rgba(30, 41, 59, 0.5)' }}
                  className="transition-colors group"
                >
                  <td className="py-3.5 pl-2">
                    <div className="font-bold text-white group-hover:text-emerald-300 transition-colors">
                      {item.name}
                    </div>
                    <span className="text-[10px] text-slate-500">{item.category}</span>
                  </td>

                  <td className="py-3.5 text-slate-400">
                    <span className="truncate max-w-[140px] block">{item.vendor}</span>
                  </td>

                  <td className="py-3.5 text-center font-mono text-slate-400">
                    {item.normalQuantity} {item.unit}
                  </td>

                  <td className="py-3.5 text-center">
                    <span className="font-mono font-bold text-sm text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                      {item.recommendedQuantity}
                    </span>
                  </td>

                  <td className="py-3.5 text-center">
                    <span
                      className={`inline-flex items-center gap-0.5 font-mono font-bold text-xs px-2 py-0.5 rounded-full ${
                        isReduction
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : isSurge
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isReduction ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                      {isReduction ? `↓ ${Math.abs(item.changePercent)}%` : `↑ ${item.changePercent}%`}
                    </span>
                  </td>

                  <td className="py-3.5 text-center font-mono">
                    {item.wastageAvoidedPortions > 0 ? (
                      <span className="text-emerald-300 font-semibold">
                        {item.wastageAvoidedPortions} portions ({item.wastageAvoidedKg} kg)
                      </span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>

                  <td className="py-3.5 pr-2 text-right">
                    {item.status === 'optimized' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                        <ShieldCheck className="w-3 h-3" />
                        Optimized
                      </span>
                    )}
                    {item.status === 'caution' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40">
                        <AlertCircle className="w-3 h-3" />
                        Caution
                      </span>
                    )}
                    {item.status === 'surge' && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/40">
                        <Sparkles className="w-3 h-3" />
                        Surge Prep
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0" />
        <span>
          Green indicates AI right-sized batches. Kitchen cooks prepare in smaller, dynamically timed tranches to guarantee zero end-of-service surplus.
        </span>
      </div>
    </section>
  );
};
