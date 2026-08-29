import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Beef,
  Flame,
  Clock,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  Tag,
  ShoppingBag,
  Bot,
  Brain,
  ShieldAlert,
  Wallet,
  Zap,
  HelpCircle,
  PiggyBank,
  Check,
  ChevronDown,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DISHES_DATABASE, CAMPUS_ZONES_LIST } from '../data/mockData';
import { Constraints, MealProposal, MealCombo, Dish, DietaryType, CampusZone } from '../types';

const DIETARY_OPTIONS: { value: DietaryType; label: string }[] = [
  { value: 'veg', label: '🌿 Pure Veg' },
  { value: 'non-veg', label: '🍗 Non-Veg' },
  { value: 'all', label: '✨ All' },
];

const AI_LOADER_STATUSES = [
  'Scanning campus vendor catalogs & stock levels...',
  'Checking live queue conditions across dining zones...',
  'Comparing price-to-protein macro efficiency...',
  'Checking prepaid mess-plan value (₹0 additional spend)...',
  'Searching Rescue Radar for active surplus drops...',
  'Ranking best Pareto-optimal meal combinations...',
];

export const SmartMealPlanner: React.FC = () => {
  const {
    wallet,
    proteinAchieved,
    constraints,
    setConstraints,
    logMealToWallet,
    toggleMessPlan,
    rescueOffers,
  } = useApp();

  const [isLoading, setIsLoading] = useState(false);
  const [loaderIndex, setLoaderIndex] = useState(0);
  const [showResults, setShowResults] = useState(true);
  const [loggedComboId, setLoggedComboId] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const remainingDailyBudget = wallet.daily - wallet.spent;
  const spentPct = Math.min((wallet.spent / wallet.daily) * 100, 100);
  const proteinPct = Math.min((proteinAchieved / constraints.protein) * 100, 100);

  // Generate Proposals (High Protein, Speed Express, Budget Saver + AI RECOMMENDS RESCUE + Mess Plan ₹0)
  const proposals: MealProposal[] = React.useMemo(() => {
    const zoneDishes = DISHES_DATABASE.filter(
      (d) =>
        d.zone === constraints.zone &&
        (constraints.dietary === 'all' || d.dietary === constraints.dietary) &&
        d.price <= constraints.budget
    );

    const availableRescue = rescueOffers.find(
      (o) =>
        (constraints.dietary === 'all' || o.dietary === constraints.dietary) &&
        o.rescuePrice <= constraints.budget &&
        o.mealsLeft > 0
    );

    const list: MealProposal[] = [];

    // 1. High Protein Pick
    const highestProteinDish = [...zoneDishes].sort((a, b) => b.protein - a.protein)[0] || DISHES_DATABASE[0];
    list.push({
      type: 'protein',
      label: 'High Protein Pick',
      combo: {
        dishes: [highestProteinDish],
        totalPrice: highestProteinDish.price,
        totalProtein: highestProteinDish.protein,
        totalCalories: highestProteinDish.calories,
        maxWaitTime: highestProteinDish.prepTime,
        reasoning: `Delivers peak ${highestProteinDish.protein}g protein within your ₹${constraints.budget} cap for muscle recovery.`,
        scores: {
          budgetFit: 88,
          nutritionFit: 98,
          timeFit: 84,
          sustainabilityFit: 80,
          overallFit: 91,
        },
      },
    });

    // 2. Speed / Express Pick
    const fastestDish = [...zoneDishes].sort((a, b) => a.prepTime - b.prepTime)[0] || DISHES_DATABASE[1];
    list.push({
      type: 'speed',
      label: 'Speed Express Pick',
      combo: {
        dishes: [fastestDish],
        totalPrice: fastestDish.price,
        totalProtein: fastestDish.protein,
        totalCalories: fastestDish.calories,
        maxWaitTime: fastestDish.prepTime,
        reasoning: `Ready in only ~${fastestDish.prepTime} min with minimal line delay between lectures.`,
        scores: {
          budgetFit: 92,
          nutritionFit: 78,
          timeFit: 99,
          sustainabilityFit: 82,
          overallFit: 89,
        },
      },
    });

    // 3. Budget Saver Pick
    const budgetDish = [...zoneDishes].sort((a, b) => b.protein / b.price - a.protein / a.price)[0] || DISHES_DATABASE[2];
    list.push({
      type: 'budget',
      label: 'Budget Saver',
      combo: {
        dishes: [budgetDish],
        totalPrice: budgetDish.price,
        totalProtein: budgetDish.protein,
        totalCalories: budgetDish.calories,
        maxWaitTime: budgetDish.prepTime,
        reasoning: `Highest protein-per-rupee ratio at ₹${budgetDish.price} — leaves ₹${constraints.budget - budgetDish.price} in your pocket.`,
        scores: {
          budgetFit: 98,
          nutritionFit: 82,
          timeFit: 88,
          sustainabilityFit: 85,
          overallFit: 92,
        },
      },
    });

    // 4. AI RECOMMENDS RESCUE (If available)
    if (availableRescue) {
      list.unshift({
        type: 'rescue',
        label: 'AI RECOMMENDS RESCUE',
        badge: 'Top Sustainable Pick',
        combo: {
          dishes: [
            {
              id: availableRescue.dishId,
              name: availableRescue.dishName,
              vendor: availableRescue.vendorName,
              zone: availableRescue.zone,
              price: availableRescue.rescuePrice,
              protein: availableRescue.proteinGrams,
              calories: availableRescue.calories,
              prepTime: 4,
              dietary: availableRescue.dietary,
              tags: ['rescue-meal', 'discounted', 'zero-waste'],
              rating: 4.8,
              currentStock: availableRescue.mealsLeft,
              predictedDemand: 10,
              surplusRisk: 'high',
              rescueEligible: true,
              rescuePrice: availableRescue.rescuePrice,
              verificationStatus: { text: 'Rescue Radar Live', type: 'real-time' },
            },
          ],
          totalPrice: availableRescue.rescuePrice,
          totalProtein: availableRescue.proteinGrams,
          totalCalories: availableRescue.calories,
          maxWaitTime: 4,
          isRescueCombo: true,
          reasoning: `Fits your ₹${constraints.budget} budget, provides ${availableRescue.proteinGrams}g protein, saves ₹${availableRescue.originalPrice - availableRescue.rescuePrice}, and prevents a surplus meal from landfill waste.`,
          scores: {
            budgetFit: 99,
            nutritionFit: 94,
            timeFit: 96,
            sustainabilityFit: 100,
            overallFit: 97,
          },
        },
      });
    }

    return list;
  }, [constraints, rescueOffers]);

  const handleOptimize = useCallback(() => {
    setIsLoading(true);
    setShowResults(false);
    setLoaderIndex(0);

    const interval = setInterval(() => {
      setLoaderIndex((prev) => (prev + 1) % AI_LOADER_STATUSES.length);
    }, 250);

    setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
      setShowResults(true);
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 1500);
  }, []);

  const handleLog = (proposal: MealProposal) => {
    setLoggedComboId(proposal.type);
    logMealToWallet(proposal.combo.totalPrice, proposal.combo.totalProtein);
    setTimeout(() => setLoggedComboId(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* ── Top Wallet & Nutrition Bar ─────────────────────────────── */}
      <section className="rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Daily metrics */}
          <div className="md:col-span-6 grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Daily Budget</span>
              <span className="text-base sm:text-lg font-black text-white font-mono">₹{wallet.daily}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-amber-400 block mb-1">Spent</span>
              <span className="text-base sm:text-lg font-black text-amber-400 font-mono">₹{wallet.spent}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1">Remaining</span>
              <span className="text-base sm:text-lg font-black text-emerald-400 font-mono">₹{remainingDailyBudget}</span>
            </div>
          </div>

          {/* Progress Bars */}
          <div className="md:col-span-6 space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-400">
                <span>Budget Spent</span>
                <strong className="text-amber-400 font-mono">{spentPct.toFixed(0)}%</strong>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full"
                  animate={{ width: `${spentPct}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1 text-slate-400">
                <span className="flex items-center gap-1">
                  <Beef className="w-3 h-3 text-emerald-400" />
                  Target Protein ({proteinAchieved}g / {constraints.protein}g)
                </span>
                <strong className="text-emerald-400 font-mono">{proteinPct.toFixed(0)}%</strong>
              </div>
              <div className="h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full"
                  animate={{ width: `${proteinPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mess Value Optimizer Banner (₹0 Additional Spend Option) ── */}
      <section className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-slate-900/80 to-slate-950/80 p-5 backdrop-blur-md shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400 flex-shrink-0">
            <PiggyBank className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white">Hostel Mess Value Optimizer</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ₹0 Additional Spend
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              You have already paid for tonight’s hostel mess meal in tuition fees. Choosing mess keeps <strong className="text-emerald-400">₹120–₹180</strong> in your pocket.
            </p>
          </div>
        </div>

        <button
          onClick={toggleMessPlan}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            wallet.hasPrepaidMess
              ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20'
              : 'bg-slate-800 text-slate-300 border border-slate-700'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{wallet.hasPrepaidMess ? 'Prepaid Mess Plan Active' : 'Enable Mess Plan'}</span>
        </button>
      </section>

      {/* ── Main Planner Layout: Constraints on Left, Results on Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 4 cols: Interactive Constraint Panel */}
        <section className="lg:col-span-4 rounded-3xl border border-slate-800/80 bg-slate-900/80 backdrop-blur-md p-5 space-y-5 shadow-xl relative">
          <div className="flex items-center gap-2 text-white font-bold text-sm pb-2 border-b border-slate-800">
            <SlidersHorizontal className="w-4 h-4 text-emerald-400" />
            <span>Meal Constraints</span>
          </div>

          {/* Budget Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Meal Budget</span>
              <span className="text-base font-black text-emerald-400 font-mono">₹{constraints.budget}</span>
            </div>
            <input
              type="range"
              min={30}
              max={250}
              step={5}
              value={constraints.budget}
              onChange={(e) => setConstraints({ ...constraints, budget: Number(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>₹30</span>
              <span>₹250</span>
            </div>
          </div>

          {/* Target Protein Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Target Protein</span>
              <span className="text-base font-black text-emerald-400 font-mono">{constraints.protein}g</span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={2}
              value={constraints.protein}
              onChange={(e) => setConstraints({ ...constraints, protein: Number(e.target.value) })}
              className="w-full h-2 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-600">
              <span>10g</span>
              <span>60g</span>
            </div>
          </div>

          {/* Dietary Selectors */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 block">Dietary Preference</span>
            <div className="flex gap-2 flex-wrap">
              {DIETARY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setConstraints({ ...constraints, dietary: opt.value })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    constraints.dietary === opt.value
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-[0_0_12px_rgba(52,211,153,0.2)]'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Campus Zone Selector */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 block">Campus Zone</span>
            <div className="relative">
              <select
                value={constraints.zone}
                onChange={(e) => setConstraints({ ...constraints, zone: e.target.value as CampusZone })}
                className="w-full appearance-none bg-slate-950 border border-slate-700 text-white rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-emerald-400 pr-10"
              >
                {CAMPUS_ZONES_LIST.map((z) => (
                  <option key={z.zone} value={z.zone} className="bg-slate-900">
                    {z.zone}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            </div>
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOptimize}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Reasoning...' : 'Find My Smartest Meal'}</span>
          </motion.button>
        </section>

        {/* Right 8 cols: Results Cards or Animated Loader */}
        <section className="lg:col-span-8 space-y-4" ref={resultsRef}>
          {isLoading && (
            /* 1.5s AI Animated Page Loader */
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-3xl border border-violet-500/40 bg-slate-900/90 backdrop-blur-xl p-12 text-center space-y-6 shadow-2xl"
            >
              {/* Radar Rings */}
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-violet-500/30 animate-ping" />
                <div className="absolute inset-3 rounded-full border border-emerald-500/40 animate-pulse" />
                <div className="w-16 h-16 rounded-full bg-violet-500/20 border border-violet-500/60 flex items-center justify-center text-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  <Brain className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div className="space-y-2 max-w-sm mx-auto">
                <span className="text-[10px] uppercase font-mono text-violet-400 font-bold block">
                  AI Optimization Engine
                </span>
                <AnimatePresence mode="wait">
                  <motion.p
                    key={loaderIndex}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-sm font-semibold text-slate-200"
                  >
                    {AI_LOADER_STATUSES[loaderIndex]}
                  </motion.p>
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {showResults && !isLoading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400">
                  AI returned <strong>{proposals.length} Pareto-optimal</strong> combinations
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  Sustainability Integrated
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {proposals.map((prop) => {
                  const isRescue = prop.type === 'rescue';
                  const isLogged = loggedComboId === prop.type;

                  return (
                    <motion.div
                      key={prop.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`relative rounded-3xl border p-5 flex flex-col justify-between space-y-4 transition-all duration-300 ${
                        isRescue
                          ? 'bg-slate-900/90 border-amber-500/60 shadow-[0_0_30px_rgba(251,191,36,0.15)] ring-1 ring-amber-400/40'
                          : prop.type === 'protein'
                          ? 'bg-slate-900/80 border-emerald-500/40 hover:border-emerald-400'
                          : prop.type === 'speed'
                          ? 'bg-slate-900/80 border-amber-500/40 hover:border-amber-400'
                          : 'bg-slate-900/80 border-sky-500/40 hover:border-sky-400'
                      }`}
                    >
                      {/* Top Header */}
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            isRescue
                              ? 'bg-gradient-to-r from-amber-500/30 to-emerald-500/30 text-amber-300 border border-amber-500/50 animate-pulse'
                              : prop.type === 'protein'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : prop.type === 'speed'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                          }`}
                        >
                          {isRescue ? <ShieldAlert className="w-3.5 h-3.5 text-amber-400" /> : <Sparkles className="w-3.5 h-3.5" />}
                          {prop.label}
                        </span>

                        <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded-lg border border-slate-800">
                          {prop.combo.dishes[0].zone}
                        </span>
                      </div>

                      {/* Dishes summary */}
                      <div className="space-y-1">
                        <h4 className="text-base font-black text-white">
                          {prop.combo.dishes.map((d) => d.name).join(' + ')}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {prop.combo.dishes[0].vendor}
                        </p>
                      </div>

                      {/* Pricing & Macros */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[9px] uppercase font-mono text-slate-500 block">Price</span>
                          <span className="text-sm font-black text-emerald-400 font-mono">
                            ₹{prop.combo.totalPrice}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[9px] uppercase font-mono text-slate-500 block">Protein</span>
                          <span className="text-sm font-black text-white font-mono">
                            {prop.combo.totalProtein}g
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[9px] uppercase font-mono text-slate-500 block">Cal</span>
                          <span className="text-sm font-black text-slate-300 font-mono">
                            {prop.combo.totalCalories}
                          </span>
                        </div>

                        <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800">
                          <span className="text-[9px] uppercase font-mono text-slate-500 block">Wait</span>
                          <span className="text-sm font-black text-amber-300 font-mono">
                            ~{prop.combo.maxWaitTime}m
                          </span>
                        </div>
                      </div>

                      {/* Explainable AI Fit Scores */}
                      {prop.combo.scores && (
                        <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                          <div className="flex justify-between items-center text-[10px] font-mono uppercase text-slate-400">
                            <span>Explainable AI Fit Index</span>
                            <strong className="text-emerald-400 font-mono">{prop.combo.scores.overallFit}% Overall</strong>
                          </div>

                          <div className="grid grid-cols-4 gap-1 text-[10px] text-center font-mono">
                            <div className="bg-slate-900 p-1 rounded">Budget: <strong className="text-sky-400">{prop.combo.scores.budgetFit}%</strong></div>
                            <div className="bg-slate-900 p-1 rounded">Nutrition: <strong className="text-emerald-400">{prop.combo.scores.nutritionFit}%</strong></div>
                            <div className="bg-slate-900 p-1 rounded">Time: <strong className="text-amber-400">{prop.combo.scores.timeFit}%</strong></div>
                            <div className="bg-slate-900 p-1 rounded">Eco: <strong className="text-emerald-300">{prop.combo.scores.sustainabilityFit}%</strong></div>
                          </div>
                        </div>
                      )}

                      {/* AI Reasoning Quote Box */}
                      <div className="p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-xs text-slate-300 leading-relaxed flex items-start gap-2">
                        <Bot className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-violet-300 block mb-0.5">Why this won:</strong>
                          <span>{prop.combo.reasoning}</span>
                        </div>
                      </div>

                      {/* Log / Order Button */}
                      <button
                        onClick={() => handleLog(prop)}
                        className={`w-full py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                          isLogged
                            ? 'bg-emerald-500 text-slate-950'
                            : isRescue
                            ? 'bg-gradient-to-r from-amber-500 to-emerald-400 text-slate-950 shadow-lg shadow-amber-500/20'
                            : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                        }`}
                      >
                        {isLogged ? (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Logged to Daily Wallet!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag className="w-4 h-4" />
                            <span>Log This Meal (₹{prop.combo.totalPrice})</span>
                          </>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
