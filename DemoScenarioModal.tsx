import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  Brain,
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const DEMO_STEPS = [
  {
    step: 1,
    title: 'Step 1: Baseline Demand Prediction',
    badge: 'PREDICT',
    badgeColor: 'bg-violet-500/20 text-violet-400 border-violet-500/40',
    description: 'On a standard Friday, the hostel kitchen expects ~790 students. BiteLoop AI uses multi-factor analysis to set baseline prep.',
    actionPrompt: 'Click "Next" to simulate a major campus fest event.',
    targetTab: 'biteloop',
  },
  {
    step: 2,
    title: 'Step 2: Campus Event Cascade ("Gravitas Concert")',
    badge: 'EVENT SIMULATOR',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
    description: 'When the Gravitas Concert is scheduled, BiteLoop AI instantly recalculates mess demand: 790 → 612 (-18%) as students shift towards outdoor stalls.',
    actionPrompt: 'Watch kitchen recommendations automatically adjust.',
    targetTab: 'biteloop',
  },
  {
    step: 3,
    title: 'Step 3: Dish-Level Kitchen Prep Optimization',
    badge: 'PREVENT',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    description: 'Kitchen receives automated prep adjustments (e.g. Rice ↓12%, Paneer ↑16%), preventing over 125 portions (42 kg) of food waste at the pan.',
    actionPrompt: 'Click "Next" to fast-forward into live evening service.',
    targetTab: 'kitchen-command',
  },
  {
    step: 4,
    title: 'Step 4: Live Telemetry & Surplus Detection (8:12 PM)',
    badge: 'MONITOR',
    badgeColor: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
    description: 'Live Surplus Monitor tracks 59 remaining Paneer Rice vs only 32 expected customers → High Surplus Risk (+27 portions).',
    actionPrompt: 'Vendor clicks "Start Rescue Drop" to discount meals.',
    targetTab: 'kitchen-command',
  },
  {
    step: 5,
    title: 'Step 5: Instant Vendor Rescue Drop Trigger',
    badge: 'RESCUE LAUNCH',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    description: 'Vendor activates instant drop (₹90 → ₹42). 21 nearby students matching this budget and protein preference are notified.',
    actionPrompt: 'Switch to student view to claim discounted food.',
    targetTab: 'kitchen-command',
  },
  {
    step: 6,
    title: 'Step 6: Student Claims Fresh Rescue Meal',
    badge: 'STUDENT RESCUE',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    description: 'Student opens Rescue Radar, selects Paneer Rice Rescue for ₹42 (24g protein), saving ₹48 and diverting fresh food from bins.',
    actionPrompt: 'Watch sustainability and wallet impact update instantly.',
    targetTab: 'rescue-radar',
  },
  {
    step: 7,
    title: 'Step 7: Real-Time Sustainability Impact Update',
    badge: 'LEARN & IMPACT',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
    description: 'Impact Dashboard logs: 1 meal rescued, ₹48 student savings, ₹42 vendor revenue recovered, and 1.2 kg CO₂e avoided!',
    actionPrompt: 'BiteLoop autonomous cycle complete! Click Finish.',
    targetTab: 'sustainability',
  },
];

export const DemoScenarioModal: React.FC = () => {
  const { isDemoRunning, demoStep, nextDemoStep, prevDemoStep, exitDemo } = useApp();
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isDemoRunning && isAutoPlaying) {
      timer = setTimeout(() => {
        if (demoStep < 7) {
          nextDemoStep();
        } else {
          setIsAutoPlaying(false);
        }
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isDemoRunning, isAutoPlaying, demoStep, nextDemoStep]);

  if (!isDemoRunning) return null;

  const currentInfo = DEMO_STEPS[demoStep - 1] || DEMO_STEPS[0];

  return (
    <div className="fixed bottom-6 inset-x-4 max-w-4xl mx-auto z-50 pointer-events-auto">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="rounded-3xl border border-violet-500/50 bg-slate-950/95 backdrop-blur-2xl p-5 sm:p-6 shadow-2xl shadow-violet-950/50 space-y-4"
      >
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-white">{currentInfo.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono border ${currentInfo.badgeColor}`}>
                  {currentInfo.badge}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                DevJams 2026 Review 1 Walkthrough (Step {demoStep} of 7)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
                isAutoPlaying
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                  : 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{isAutoPlaying ? 'Auto-Playing...' : 'Auto-Play'}</span>
            </button>

            <button
              onClick={exitDemo}
              className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Narrative & Action Body */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8 space-y-1">
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
              {currentInfo.description}
            </p>
            <p className="text-[11px] text-emerald-400 font-mono">
              💡 {currentInfo.actionPrompt}
            </p>
          </div>

          {/* Controls */}
          <div className="sm:col-span-4 flex items-center justify-end gap-2">
            <button
              disabled={demoStep === 1}
              onClick={prevDemoStep}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={nextDemoStep}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-500 to-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-violet-500/25 flex items-center gap-1.5"
            >
              <span>{demoStep === 7 ? 'Finish Demo' : 'Next Step'}</span>
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>

        {/* 7-Step Progress Dots */}
        <div className="flex items-center justify-between gap-1 pt-1">
          {DEMO_STEPS.map((s) => (
            <div
              key={s.step}
              className="flex-1 h-1.5 rounded-full overflow-hidden bg-slate-800"
            >
              <div
                className={`h-full transition-all duration-300 ${
                  s.step <= demoStep
                    ? 'bg-gradient-to-r from-violet-500 to-emerald-400'
                    : 'bg-transparent'
                }`}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
