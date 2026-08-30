import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  TrendingDown,
  TrendingUp,
  ShieldAlert,
  GraduationCap,
  Users,
  Utensils,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Calendar,
  Building,
  SunMedium,
  CheckCircle2,
  HelpCircle,
  LogOut,
  BarChart2,
  Info,
  Layers,
  ArrowRight,
  MapPin,
  Leaf,
  BellRing,
  ChefHat,
  TrendingUp as TrendingChart,
  Gauge,
  Activity,
  Camera,
  Upload,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEMAND_HISTORY_7DAYS, FORECAST_FACTORS_LIST } from '../data/mockData';
import { EventType } from '../types';
import { DemandAreaChart } from './Charts';
import TextType from './TextType';

const BITELOOP_STEPS = [
  {
    id: 'predict',
    title: 'PREDICT',
    subtitle: 'Demand Forecasting',
    icon: <Brain className="w-5 h-5 text-violet-400" />,
    color: 'from-violet-500/20 to-violet-500/5',
    border: 'border-violet-500/50',
    desc: 'Forecast student turnout before cooking starts.',
  },
  {
    id: 'prevent',
    title: 'PREVENT',
    subtitle: 'Kitchen Optimization',
    icon: <TrendingDown className="w-5 h-5 text-emerald-400" />,
    color: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/50',
    desc: 'Right-size batch cooking to eliminate surplus.',
  },
  {
    id: 'monitor',
    title: 'MONITOR',
    subtitle: 'Real-time Telemetry',
    icon: <BarChart2 className="w-5 h-5 text-sky-400" />,
    color: 'from-sky-500/20 to-sky-500/5',
    border: 'border-sky-500/50',
    desc: 'Track live sales vs forecasted demand curve.',
  },
  {
    id: 'rescue',
    title: 'RESCUE',
    subtitle: 'Radar Meal Drops',
    icon: <ShieldAlert className="w-5 h-5 text-amber-400" />,
    color: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/50',
    desc: 'Discount safe surplus to students in real-time.',
  },
  {
    id: 'learn',
    title: 'LEARN',
    subtitle: 'Feedback Loop',
    icon: <GraduationCap className="w-5 h-5 text-indigo-400" />,
    color: 'from-indigo-500/20 to-indigo-500/5',
    desc: 'Feed actual consumption back to improve ML models.',
    border: 'border-indigo-500/50',
  },
];

const EVENT_OPTIONS: { id: EventType; label: string; desc: string; icon: string }[] = [
  { id: 'normal', label: 'Normal Campus Day', desc: 'Standard weekday lecture schedule', icon: '🏫' },
  { id: 'gravitas', label: 'Gravitas Concert / Fest', desc: 'Major evening cultural & tech event', icon: '🎸' },
  { id: 'exam', label: 'Exam Night (FAT)', desc: 'Heavy hostel mess & late-night study rush', icon: '📚' },
  { id: 'weekend', label: 'Weekend / Outing', desc: 'Students traveling or dining off-campus', icon: '🏖️' },
  { id: 'sports', label: 'Riviera Sports Meet', desc: 'Athletic meet, high protein demand', icon: '⚽' },
  { id: 'holiday', label: 'Holiday / Break', desc: 'Reduced campus occupancy', icon: '🌴' },
];

export const BiteLoopHero: React.FC = () => {
  const {
    demandForecast,
    currentEvent,
    setCurrentEvent,
    studentIntention,
    submitStudentIntention,
    intentionCounts,
    setActiveTab,
    zones,
    startDemo,
    isDemoRunning,
  } = useApp();

  const [activeCycleStep, setActiveCycleStep] = useState(0);
  const [showFactors, setShowFactors] = useState(true);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setUploadedPhoto(previewUrl);
  };

  // Auto-cycle through steps every 3.5s for demo polish
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveCycleStep((prev) => (prev + 1) % BITELOOP_STEPS.length);
    }, 3800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[30px] border border-violet-500/20 bg-slate-950/70 p-5 shadow-[0_35px_90px_rgba(76,29,149,0.38)] backdrop-blur-2xl sm:p-8 lg:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.24),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(244,114,182,0.18),transparent_26%),radial-gradient(circle_at_center,rgba(59,130,246,0.14),transparent_38%)]" />
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.04) 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        <div className="relative z-10 grid items-center gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-[11px] font-semibold tracking-[0.16em] text-violet-200 uppercase"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>DevJams ’26 • AI Campus Food Intelligence</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="max-w-xl text-4xl font-black leading-[0.9] tracking-[-0.06em] text-white sm:text-5xl lg:text-[68px]"
            >
              <span className="block">Predict food demand.</span>
              <span className="block text-blue-glow">
                <TextType
                  text={['Prevent waste.', 'Rescue meals.', 'Plan smarter.']}
                  typingSpeed={80}
                  pauseDuration={1400}
                  deletingSpeed={35}
                  loop={true}
                  showCursor={true}
                  cursorCharacter="|"
                  className="inline-block"
                  textColors={['#9bd6ff', '#bfe7ff', '#dff4ff']}
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base"
            >
              Budget-Bite uses AI to understand campus food demand before cooking begins, helping kitchens prepare smarter while students discover affordable surplus meals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="flex flex-wrap items-center gap-3"
            >
              <motion.button
                whileHover={{ y: -2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={startDemo}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-400 px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(168,85,247,0.35)] ring-1 ring-violet-300/60 transition-all cursor-pointer"
              >
                <span>{isDemoRunning ? 'Restart AI Demo' : 'Run AI Demo'}</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>

              <button
                onClick={() => setActiveTab('digital-twin')}
                className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900/60 px-5 py-3 text-sm font-semibold text-white/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all hover:border-violet-500/40 hover:bg-slate-800/80 cursor-pointer"
              >
                <MapPin className="h-4 w-4 text-violet-300" />
                Explore Campus
              </button>
            </motion.div>

            <div className="grid gap-3 pt-2 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">AI Forecast</div>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-black tracking-tight text-white">748</span>
                  <span className="pb-1 text-xs text-slate-400">diners</span>
                </div>
                <div className="mt-2 text-xs text-emerald-300">89% confidence</div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
                <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Waste Prevented</div>
                <div className="mt-2 flex items-end gap-2">
                  <span className="text-3xl font-black tracking-tight text-emerald-300">43 kg</span>
                </div>
                <div className="mt-2 text-xs text-slate-400">Student savings ₹5,420</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-xl">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-slate-500">Meal Check-In</div>
                  <div className="mt-1 text-sm font-semibold text-white">Choose your plan</div>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-[10px] font-semibold text-violet-200"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Add Photo
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                {[
                  { id: 'mess', label: 'Eating in mess', accent: 'emerald' },
                  { id: 'outside', label: 'Eating out', accent: 'amber' },
                  { id: 'unsure', label: 'Not sure', accent: 'slate' },
                ].map((option) => {
                  const isSelected = studentIntention === option.id;
                  const accentClasses = option.accent === 'emerald'
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
                    : option.accent === 'amber'
                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                    : 'border-slate-700 bg-slate-900/80 text-slate-200';

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => submitStudentIntention(option.id as 'mess' | 'outside' | 'unsure')}
                      className={`rounded-2xl border px-3 py-3 text-left text-xs font-medium transition-all ${isSelected ? accentClasses : 'border-slate-800 bg-slate-950/70 text-slate-300 hover:border-slate-700'}`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {uploadedPhoto && (
                <div className="mt-3 overflow-hidden rounded-2xl border border-slate-800 bg-slate-950/80">
                  <div className="flex items-center gap-2 border-b border-slate-800 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">
                    <Camera className="h-3.5 w-3.5 text-violet-300" />
                    Uploaded Photo
                  </div>
                  <img src={uploadedPhoto} alt="student uploaded meal" className="h-28 w-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="relative flex min-h-[420px] items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="relative h-[420px] w-full max-w-[480px]"
            >
              <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/30 bg-emerald-500/5 blur-2xl" />
              <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-500/20" />
              <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-500/10" />

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, ease: 'linear', repeat: Infinity }}
                className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-violet-400/30"
              />

              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 4, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 top-1/2 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[32px] border border-emerald-300/40 bg-gradient-to-br from-emerald-400/25 via-slate-900/80 to-violet-500/20 shadow-[0_0_45px_rgba(16,185,129,0.2)] backdrop-blur-xl"
              >
                <div className="flex h-20 w-20 items-center justify-center rounded-[26px] bg-gradient-to-br from-emerald-500/30 to-slate-900 text-white shadow-inner shadow-emerald-500/20">
                  <div className="rounded-full border border-emerald-200/60 bg-emerald-400/20 p-4">
                    <Utensils className="h-9 w-9 text-emerald-200" />
                  </div>
                </div>
              </motion.div>

              <div className="absolute left-12 top-16 rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-200 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Users className="h-3.5 w-3.5" />
                  Student
                </div>
                <div className="mt-1 text-slate-400">Intent collected</div>
              </div>

              <div className="absolute right-10 top-20 rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-200 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2 text-violet-300">
                  <Brain className="h-3.5 w-3.5" />
                  AI
                </div>
                <div className="mt-1 text-slate-400">Forecasting</div>
              </div>

              <div className="absolute left-10 bottom-20 rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-200 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2 text-amber-300">
                  <ChefHat className="h-3.5 w-3.5" />
                  Kitchen
                </div>
                <div className="mt-1 text-slate-400">Prep aligned</div>
              </div>

              <div className="absolute right-12 bottom-16 rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-[11px] text-slate-200 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-2 text-emerald-300">
                  <BellRing className="h-3.5 w-3.5" />
                  Rescue
                </div>
                <div className="mt-1 text-slate-400">3 offers live</div>
              </div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-1/2 top-8 -translate-x-1/2 rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 text-sm text-white">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">₹</span>
                  <span>Budget</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute right-1 top-1/2 -translate-y-1/2 rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 text-sm text-white">
                  <TrendingChart className="h-4 w-4 text-emerald-300" />
                  <span>+11%</span>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0], x: [0, 3, 0] }}
                transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute left-8 top-1/2 -translate-y-1/2 rounded-2xl border border-slate-700 bg-slate-900/70 px-3 py-2 shadow-xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-2 text-sm text-white">
                  <Leaf className="h-4 w-4 text-emerald-300" />
                  <span>Low waste</span>
                </div>
              </motion.div>

              <div className="absolute bottom-16 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-slate-700 bg-slate-900/70 px-3 py-2 shadow-xl backdrop-blur-xl">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Campus</div>
                  <div className="text-sm font-semibold text-white">Central Food Court</div>
                </div>
              </div>

              <div className="absolute bottom-6 right-20 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-200 shadow-[0_0_25px_rgba(16,185,129,0.25)] backdrop-blur-xl">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  Rescue Meal
                </div>
              </div>

              <div className="absolute left-16 top-28 h-px w-24 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
              <div className="absolute right-16 top-24 h-px w-20 bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />
              <div className="absolute left-12 bottom-20 h-px w-20 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent" />
              <div className="absolute right-12 bottom-20 h-px w-20 bg-gradient-to-r from-transparent via-emerald-400/70 to-transparent" />
            </motion.div>
          </div>
        </div>

        <div className="relative z-10 mt-2 flex items-center justify-between gap-2 border-t border-slate-800/80 pt-4 text-[10px] uppercase tracking-[0.2em] text-slate-500">
          <span className="flex items-center gap-2"><Gauge className="h-3.5 w-3.5 text-emerald-300" /> Student → AI → Kitchen → Food → Rescue</span>
          <span className="hidden sm:inline-flex items-center gap-2"><Activity className="h-3.5 w-3.5 text-violet-300" /> Live campus flow</span>
        </div>
      </section>

      {/* ── 2. TONIGHT'S DEMAND FORECAST & STUDENT INTENTION ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols: Main Demand Forecast Hero Card */}
        <section className="lg:col-span-8 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black text-white">Tonight’s Demand Forecast</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/40">
                  AI Model v4.2
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Multi-factor prediction for Hostel Mess & Campus Dining tonight
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-xl">
                <span className="text-[11px] text-slate-400">Confidence:</span>
                <span className="text-sm font-black text-emerald-400 font-mono">
                  {demandForecast.confidence}%
                </span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Optimized</span>
              </div>
            </div>
          </div>

          {/* Metric cards grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Total Hostel</span>
              <span className="text-xl sm:text-2xl font-black text-white">{intentionCounts.totalHostel}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Students enrolled</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Historical Avg</span>
              <span className="text-xl sm:text-2xl font-black text-slate-300">{demandForecast.historicalExpected}</span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Traditional cooks</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
              <span className="text-[10px] uppercase font-mono text-violet-400 block mb-1">AI Predicted</span>
              <motion.span
                key={demandForecast.aiPredicted}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl sm:text-2xl font-black text-violet-300 block"
              >
                {demandForecast.aiPredicted}
              </motion.span>
              <span className="text-[10px] text-violet-400/80 block mt-0.5">Expected diners</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-950/30 border border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.1)]">
              <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1">Recommended Prep</span>
              <motion.span
                key={demandForecast.recommendedPrep}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl sm:text-2xl font-black text-emerald-400 block"
              >
                {demandForecast.recommendedPrep}
              </motion.span>
              <span className="text-[10px] text-emerald-400/80 block mt-0.5">Safe margin buffer</span>
            </div>
          </div>

          {/* Overproduction Avoided Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-slate-950/40 border border-emerald-500/40 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  Potential Overproduction Avoided: <span className="text-emerald-400 font-mono text-base">{demandForecast.overproductionAvoidedPortions} portions</span>
                </p>
                <p className="text-xs text-slate-400">
                  Estimated Food Waste Saved: <strong className="text-emerald-300">{demandForecast.foodSavedKg} kg</strong> (≈ ₹{demandForecast.overproductionAvoidedPortions * 45} ingredient cost saved)
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('kitchen-command')}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition-colors whitespace-nowrap"
            >
              View Kitchen Plan →
            </button>
          </div>

          {/* 7-Day Demand vs Preparation Chart */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                7-Day Demand History & Prediction Accuracy (Hostel Mess)
              </span>
              <span className="text-[11px] text-slate-500">Live Telemetry Synchronized</span>
            </div>

            <div className="rounded-2xl bg-slate-950/70 border border-slate-800/80 p-4">
              <DemandAreaChart data={DEMAND_HISTORY_7DAYS} />
            </div>
          </div>
        </section>

        {/* Right 4 cols: Student Meal Intent + Event Simulator */}
        <div className="lg:col-span-4 space-y-6">
          {/* ── STUDENT MEAL INTENT CARD ─────────────────────────────── */}
          <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-black text-white">Student Meal Intent</h3>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                Live Input
              </span>
            </div>

            <p className="text-xs text-slate-300 font-medium">
              “Dinner tonight? Help campus kitchens prep right.”
            </p>

            <div className="grid grid-cols-1 gap-2.5">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => submitStudentIntention('mess')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  studentIntention === 'mess'
                    ? 'bg-emerald-500/20 border-emerald-500 text-white ring-2 ring-emerald-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Eating at Mess</span>
                    <span className="text-[10px] text-slate-400">{intentionCounts.confirmedMess} students responded</span>
                  </div>
                </div>
                {studentIntention === 'mess' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => submitStudentIntention('outside')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  studentIntention === 'outside'
                    ? 'bg-amber-500/20 border-amber-500 text-white ring-2 ring-amber-500/40'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <LogOut className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Eating Outside</span>
                    <span className="text-[10px] text-slate-400">{intentionCounts.confirmedOutside} students marked</span>
                  </div>
                </div>
                {studentIntention === 'outside' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => submitStudentIntention('unsure')}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  studentIntention === 'unsure'
                    ? 'bg-slate-800 border-slate-600 text-white ring-2 ring-slate-600'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold block">Not Sure Yet</span>
                    <span className="text-[10px] text-slate-400">{intentionCounts.unsure} students pending</span>
                  </div>
                </div>
                {studentIntention === 'unsure' && <CheckCircle2 className="w-4 h-4 text-slate-300" />}
              </motion.button>
            </div>

            <div className="p-3 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center gap-2 text-[11px] text-violet-300">
              <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0" />
              <span>Your response directly adjusts kitchen prep and saves food!</span>
            </div>
          </section>

          {/* ── EVENT-AWARE "WHAT IF?" SIMULATOR ─────────────────────── */}
          <section className="rounded-3xl border border-amber-500/30 bg-slate-900/80 backdrop-blur-md p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-base">⚡</span>
                <h3 className="text-sm font-black text-white">Campus Event Simulator</h3>
              </div>
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                “What If?” Demo
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Simulate campus-wide dining demand shifts in real time:
            </p>

            <div className="space-y-2">
              <label className="text-[11px] font-mono uppercase text-slate-400">Select Event Scenario:</label>
              <div className="grid grid-cols-2 gap-2">
                {EVENT_OPTIONS.map((evt) => {
                  const isSelected = currentEvent === evt.id;
                  return (
                    <button
                      key={evt.id}
                      onClick={() => setCurrentEvent(evt.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-500 text-white ring-1 ring-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.2)]'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1">
                        <span>{evt.icon}</span>
                        <span className="text-xs font-bold truncate">{evt.label}</span>
                      </div>
                      <span className="text-[9px] text-slate-500 block line-clamp-1">{evt.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Event Adjustment summary */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-300">
                <span>Mess Shift:</span>
                <strong className="text-amber-400 font-mono">
                  {currentEvent === 'gravitas' ? '748 → 612 (-18%)' : currentEvent === 'exam' ? '748 → 860 (+15%)' : '748 (Normal)'}
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Food Court Shift:</span>
                <strong className="text-sky-400 font-mono">
                  {currentEvent === 'gravitas' ? '310 → 527 (+70%)' : '260 (Normal)'}
                </strong>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span>Night Stalls:</span>
                <strong className="text-emerald-400 font-mono">
                  {currentEvent === 'gravitas' ? '145 → 280 (+93%)' : '145 (Normal)'}
                </strong>
              </div>
              <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-800">
                “AI has auto-adjusted preparation across 4 campus food zones.”
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* ── 3. EXPLAINABLE AI FORECAST FACTORS ("WHY DID AI PREDICT THIS?") ── */}
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-6 space-y-4">
        <div
          onClick={() => setShowFactors(!showFactors)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
              <Brain className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Why did AI predict this? (Explainable AI Factors)</h3>
              <p className="text-xs text-slate-400">Transparent breakdown of weights driving tonight's prediction</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-mono">6 active weights</span>
            {showFactors ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
        </div>

        <AnimatePresence>
          {showFactors && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2"
            >
              {FORECAST_FACTORS_LIST.map((factor) => {
                const isPositive = factor.impactType === 'positive';
                const isNegative = factor.impactType === 'negative';
                return (
                  <div
                    key={factor.id}
                    className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition-colors space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs">
                          {factor.category === 'calendar' ? <Calendar className="w-3.5 h-3.5 text-sky-400" /> :
                           factor.category === 'event' ? <Sparkles className="w-3.5 h-3.5 text-amber-400" /> :
                           factor.category === 'sentiment' ? <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> :
                           factor.category === 'weather' ? <SunMedium className="w-3.5 h-3.5 text-yellow-400" /> :
                           <Users className="w-3.5 h-3.5 text-violet-400" />}
                        </span>
                        <h4 className="text-xs font-bold text-slate-200">{factor.title}</h4>
                      </div>

                      <span
                        className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full ${
                          isPositive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : isNegative
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {isPositive ? `+${factor.impactPercent}%` : `${factor.impactPercent}%`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">{factor.description}</p>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-900 font-mono">
                      <span>Model Confidence</span>
                      <span className="text-slate-300">{factor.confidence}%</span>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
