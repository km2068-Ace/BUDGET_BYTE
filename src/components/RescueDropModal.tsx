import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  ShieldAlert,
  Clock,
  IndianRupee,
  Users,
  CheckCircle2,
  Bell,
  ChefHat,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const RescueDropModal: React.FC = () => {
  const { isRescueModalOpen, setIsRescueModalOpen, addRescueDrop, liveSurplusItem } = useApp();

  const [remainingMeals, setRemainingMeals] = useState(27);
  const [originalPrice, setOriginalPrice] = useState(90);
  const [rescuePrice, setRescuePrice] = useState(42);
  const [deadline, setDeadline] = useState('8:45 PM');
  const [isActivated, setIsActivated] = useState(false);

  if (!isRescueModalOpen) return null;

  const handleActivate = () => {
    setIsActivated(true);
    addRescueDrop({
      dishId: 'dish-custom-drop',
      dishName: `${liveSurplusItem.name} Drop`,
      vendorName: 'Canteen Counter B (North Treats)',
      zone: 'Central Canteen',
      originalPrice,
      rescuePrice,
      mealsLeft: remainingMeals,
      totalInitialMeals: remainingMeals,
      pickupDeadline: deadline,
      distanceMeters: 350,
      proteinGrams: 24,
      calories: 480,
      dietary: 'veg',
      reason: 'Surplus prevented via vendor instant Rescue Drop.',
      confidence: 95,
    });

    setTimeout(() => {
      setIsActivated(false);
      setIsRescueModalOpen(false);
    }, 2800);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl border border-amber-500/50 bg-slate-900/95 backdrop-blur-xl p-6 sm:p-7 space-y-6 shadow-2xl overflow-hidden"
        >
          {/* Top ambient glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={() => setIsRescueModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/50 text-amber-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Initiate Live Rescue Drop</h3>
              <p className="text-xs text-slate-400">Vendor Instant Surplus Liquidation</p>
            </div>
          </div>

          {!isActivated ? (
            <div className="space-y-4">
              {/* Monitored item banner */}
              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">Selected Item</span>
                  <p className="text-sm font-bold text-white">{liveSurplusItem.name}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-rose-500/20 text-rose-300 border border-rose-500/40">
                  {liveSurplusItem.predictedSurplus} portions at risk
                </span>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Meals to Drop</label>
                  <input
                    type="number"
                    value={remainingMeals}
                    onChange={(e) => setRemainingMeals(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Original Price (₹)</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-slate-400 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-emerald-400 font-bold">
                    Suggested Rescue Price (₹)
                  </label>
                  <input
                    type="number"
                    value={rescuePrice}
                    onChange={(e) => setRescuePrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-emerald-500/50 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-mono uppercase text-slate-400">Pickup Deadline</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* AI Reasoning Box */}
              <div className="p-3.5 rounded-2xl bg-violet-500/10 border border-violet-500/30 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-violet-300">
                  <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                  <span>AI Drop Recommendation</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  “Based on remaining demand and closing time, approximately 21 portions may remain unsold. Dropping to ₹42 will trigger immediate student claims within 15 minutes.”
                </p>
              </div>

              {/* Simulated push alert broadcast indicator */}
              <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>
                  Estimated <strong>21 students</strong> nearby match this meal budget & protein preference.
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsRescueModalOpen(false)}
                  className="w-1/3 py-3 px-4 rounded-xl text-xs font-bold text-slate-400 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleActivate}
                  className="w-2/3 py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-emerald-400 text-slate-950 shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  <Bell className="w-4 h-4" />
                  <span>Activate Rescue Drop</span>
                </motion.button>
              </div>
            </div>
          ) : (
            /* Post-activation celebration state */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-8 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              </div>

              <h4 className="text-xl font-black text-white">Rescue Drop Live!</h4>
              <p className="text-xs text-slate-300 max-w-xs mx-auto leading-relaxed">
                21 students nearby have received instant push notifications on Rescue Radar.
              </p>

              <div className="inline-block px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-400">
                Broadcasting to Central Canteen & Hostel Mess Hub
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
