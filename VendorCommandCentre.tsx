import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChefHat,
  TrendingDown,
  TrendingUp,
  Sparkles,
  ShieldAlert,
  Mic,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Clock,
  Scan,
  FileText,
  Volume2,
  DollarSign,
  Package,
  Store,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LiveSurplusMonitor } from './LiveSurplusMonitor';
import { DishPrepOptimizer } from './DishPrepOptimizer';

export const VendorCommandCentre: React.FC = () => {
  const { demandForecast, liveSurplusItem, showToast, setActiveTab } = useApp();

  // MenuLens state
  const [menuLensStage, setMenuLensStage] = useState<'idle' | 'scanning' | 'extracted' | 'published'>('idle');

  // Voice update state
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceParsed, setVoiceParsed] = useState(false);

  const simulateMenuLens = () => {
    setMenuLensStage('scanning');
    setTimeout(() => {
      setMenuLensStage('extracted');
    }, 1800);
  };

  const handlePublishMenu = () => {
    setMenuLensStage('published');
    showToast('✓ Menu publish kardia bro , lezzzz GOOOOOOOO!!', 'success');
    setTimeout(() => setMenuLensStage('idle'), 3000);
  };

  const simulateVoiceUpdate = () => {
    setVoiceRecording(true);
    setTimeout(() => {
      setVoiceRecording(false);
      setVoiceParsed(true);
    }, 2000);
  };

  const handleApplyVoice = () => {
    setVoiceParsed(false);
    showToast('✓ Inventory updated from voice telemetry: Sandwich (12), Samosa (8).', 'success');
  };

  return (
    <div className="space-y-8">
      {/* ── 1. VENDOR TELEMETRY METRICS ─────────────────────────────── */}
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-6 space-y-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-violet-500/20 text-violet-400">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">Kitchen Command Centre</h2>
              <p className="text-xs text-slate-400">
                Central Mess & Canteen Production Telemetry • Live Batch Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('seller-portal')}
              className="px-3.5 py-1.5 rounded-full bg-orange-600/20 border border-orange-500/40 text-orange-400 hover:bg-orange-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Store className="w-3.5 h-3.5" />
              Manage Live Prices
            </button>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">TELEMETRY SYNCED (8:12 PM)</span>
            </div>
          </div>
        </div>

        {/* Big metrics cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Expected Diners</span>
            <span className="text-xl font-black text-white font-mono">{demandForecast.aiPredicted}</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Tonight's forecast</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Forecast Confidence</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{demandForecast.confidence}%</span>
            <span className="text-[9px] text-emerald-400/80 block mt-0.5">High precision</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Meals Prepared</span>
            <span className="text-xl font-black text-slate-200 font-mono">{demandForecast.recommendedPrep}</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Kitchen output</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Current Servings</span>
            <span className="text-xl font-black text-sky-400 font-mono">511</span>
            <span className="text-[9px] text-slate-400 block mt-0.5">Tokens cleared</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-950/30 border border-rose-500/40">
            <span className="text-[10px] uppercase font-mono text-rose-400 block mb-1 font-bold">Predicted Surplus</span>
            <span className="text-xl font-black text-rose-400 font-mono">+{liveSurplusItem.predictedSurplus}</span>
            <span className="text-[9px] text-rose-300 block mt-0.5">Needs radar rescue</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40">
            <span className="text-[10px] uppercase font-mono text-amber-400 block mb-1 font-bold">Rescue Revenue</span>
            <span className="text-xl font-black text-amber-300 font-mono">₹1,764</span>
            <span className="text-[9px] text-amber-400/80 block mt-0.5">Recovered tonight</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1 font-bold">Food Saved (Wk)</span>
            <span className="text-xl font-black text-emerald-400 font-mono">68 kg</span>
            <span className="text-[9px] text-emerald-400/80 block mt-0.5">Zero bin waste</span>
          </div>
        </div>
      </section>

      {/* ── 2. AI KITCHEN BRIEF & ITEM ANALYTICS ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* AI Kitchen Brief */}
        <section className="lg:col-span-7 rounded-3xl border border-violet-500/30 bg-slate-900/80 backdrop-blur-md p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-400" />
              <h3 className="text-sm font-black text-white">AI Kitchen Brief (Actionable Shift Directives)</h3>
            </div>
            <span className="text-[10px] font-mono text-violet-400 bg-violet-500/15 px-2 py-0.5 rounded border border-violet-500/30">
              Shift: 7:00 PM – 9:30 PM
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
              <div>
                <strong className="text-xs text-white block">Reduce rice preparation by approx. 12% tonight</strong>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Friday evening student turnout shifts towards roti & fast items. Do not cook full 4th batch.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
              <div>
                <strong className="text-xs text-white block">Paneer demand is expected to exceed standard Friday orders (+16%)</strong>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Student preference poll indicates higher Paneer Rice demand; keep diced paneer ready for fast cook-to-order.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-sky-400 mt-1.5 flex-shrink-0" />
              <div>
                <strong className="text-xs text-white block">Night Stall traffic surge expected after 9:00 PM</strong>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Post-concert crowd will migrate to snacks & momos; Night Stalls alerted for second-shift rush.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Most Wasted vs Best Performing */}
        <section className="lg:col-span-5 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-black text-white">Item Efficiency Diagnostics</h3>

          <div className="space-y-4">
            {/* Most Wasted */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono text-rose-400 font-bold block">
                Historical High-Wastage Items (Before BiteLoop)
              </span>
              <div className="space-y-1.5">
                {[
                  { name: 'Plain Cooked Rice', pct: 31, color: 'bg-rose-500' },
                  { name: 'Tandoori Roti / Bread', pct: 18, color: 'bg-rose-400' },
                  { name: 'Yellow Tadka Dal', pct: 11, color: 'bg-amber-400' },
                ].map((item) => (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-300">
                      <span>{item.name}</span>
                      <strong className="font-mono text-rose-400">{item.pct}% waste</strong>
                    </div>
                    <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct * 2}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Best Performing */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] uppercase font-mono text-emerald-400 font-bold block">
                Top Demand-Matched Items (Zero Waste)
              </span>
              <div className="flex flex-wrap gap-2">
                {['Paneer Butter Rice', 'Mysore Dosa', 'Egg Bhurji & Pav', 'Chicken Momos'].map((d) => (
                  <span
                    key={d}
                    className="px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
                  >
                    ✓ {d}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* ── 3. LIVE SURPLUS MONITOR EMBEDDED ───────────────────────────── */}
      <LiveSurplusMonitor />

      {/* ── 4. DISH PREP OPTIMIZER EMBEDDED ────────────────────────────── */}
      <DishPrepOptimizer />

      {/* ── 5. MENULENS & VENDOR VOICE ONBOARDING TOOLS ────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MenuLens Multimodal Onboarding */}
        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scan className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="text-sm font-black text-white">MenuLens™ — AI Menu Scanner</h3>
                <p className="text-xs text-slate-400">Zero-effort vendor stall onboarding via computer vision</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/30">
              Multimodal Vision
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            {menuLensStage === 'idle' && (
              <div className="text-center py-6 space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center mx-auto">
                  <Camera className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Snap a photo of the handwritten or printed canteen blackboard to auto-extract items and prices.
                </p>
                <button
                  onClick={simulateMenuLens}
                  className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-2 mx-auto"
                >
                  <Upload className="w-4 h-4" />
                  <span>Simulate Menu Image Upload</span>
                </button>
              </div>
            )}

            {menuLensStage === 'scanning' && (
              <div className="py-8 text-center space-y-3">
                <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-sky-400 font-mono animate-pulse">
                  AI Scanning Image: Detecting bounding boxes & OCR text...
                </p>
              </div>
            )}

            {menuLensStage === 'extracted' && (
              <div className="space-y-3">
                <span className="text-[11px] font-mono uppercase text-slate-400 block">
                  Extracted 4 Dishes with 98% OCR Confidence:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-200">Paneer Rice</span>
                    <strong className="text-emerald-400 font-mono">₹80</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-200">Egg Rice</span>
                    <strong className="text-emerald-400 font-mono">₹70</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-200">Mysore Dosa</span>
                    <strong className="text-emerald-400 font-mono">₹55</strong>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-200">Masala Tea</span>
                    <strong className="text-emerald-400 font-mono">₹15</strong>
                  </div>
                </div>

                <button
                  onClick={handlePublishMenu}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirm & Publish Menu</span>
                </button>
              </div>
            )}

            {menuLensStage === 'published' && (
              <div className="py-6 text-center text-emerald-400 space-y-2">
                <CheckCircle2 className="w-10 h-10 mx-auto" />
                <p className="text-xs font-bold">Menu Published Successfully!</p>
              </div>
            )}
          </div>
        </section>

        {/* Vendor Voice Update Demo */}
        <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-amber-400" />
              <div>
                <h3 className="text-sm font-black text-white">Voice Inventory Quick-Update</h3>
                <p className="text-xs text-slate-400">Hands-free voice telemetry for busy kitchen cooks</p>
              </div>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
              Speech-to-State
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <button
                onClick={simulateVoiceUpdate}
                disabled={voiceRecording}
                className={`p-4 rounded-2xl border transition-all flex items-center gap-3 ${
                  voiceRecording
                    ? 'bg-rose-500/20 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-amber-400'
                }`}
              >
                <Mic className={`w-6 h-6 ${voiceRecording ? 'text-rose-400 animate-bounce' : 'text-amber-400'}`} />
                <div className="text-left">
                  <span className="text-xs font-bold block">
                    {voiceRecording ? 'Listening to Kitchen Speech...' : 'Press Mic & Speak'}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {voiceRecording ? 'AI Processing Audio...' : 'e.g. “Only 12 sandwiches and 8 samosas left”'}
                  </span>
                </div>
              </button>

              {voiceRecording && (
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [8, 24, 8] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-amber-400 rounded-full"
                    />
                  ))}
                </div>
              )}
            </div>

            {voiceParsed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-slate-900 border border-amber-500/30 space-y-2"
              >
                <span className="text-[10px] font-mono text-amber-300 block font-bold">
                  AI Transcribed & Parsed JSON:
                </span>
                <div className="text-xs font-mono text-slate-300 space-y-0.5 bg-slate-950 p-2.5 rounded-lg">
                  <div>Sandwich: <strong className="text-emerald-400">12 remaining</strong></div>
                  <div>Samosa: <strong className="text-emerald-400">8 remaining</strong></div>
                  <div>Closing Window: <strong className="text-amber-400">9:00 PM</strong></div>
                </div>

                <button
                  onClick={handleApplyVoice}
                  className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
                >
                  Apply Inventory Update
                </button>
              </motion.div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};
