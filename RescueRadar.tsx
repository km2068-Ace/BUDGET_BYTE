import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Clock,
  MapPin,
  Flame,
  Beef,
  IndianRupee,
  Sparkles,
  CheckCircle2,
  Tag,
  AlertTriangle,
  ArrowRight,
  Filter,
  Search,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RescueOffer } from '../types';

export const RescueRadar: React.FC = () => {
  const { rescueOffers, claimRescueMeal, setIsRescueModalOpen } = useApp();
  const [filter, setFilter] = useState<'all' | 'veg' | 'non-veg' | 'high-protein' | 'nearby'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [claimedIds, setClaimedIds] = useState<Record<string, boolean>>({});

  const filteredOffers = rescueOffers.filter((o) => {
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matchName = o.dishName.toLowerCase().includes(q);
      const matchVendor = o.vendorName.toLowerCase().includes(q);
      const matchZone = o.zone.toLowerCase().includes(q);
      if (!matchName && !matchVendor && !matchZone) return false;
    }
    if (filter === 'veg') return o.dietary === 'veg';
    if (filter === 'non-veg') return o.dietary === 'non-veg';
    if (filter === 'high-protein') return o.proteinGrams >= 20;
    if (filter === 'nearby') return o.distanceMeters <= 400;
    return true;
  });

  const handleClaim = (offer: RescueOffer) => {
    if (offer.mealsLeft <= 0 || claimedIds[offer.id]) return;

    setClaimedIds((prev) => ({ ...prev, [offer.id]: true }));
    claimRescueMeal(offer.id);

    setTimeout(() => {
      setClaimedIds((prev) => ({ ...prev, [offer.id]: false }));
    }, 4000);
  };

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <section className="relative rounded-3xl border border-amber-500/40 bg-gradient-to-r from-slate-900/95 via-amber-950/20 to-slate-950/95 backdrop-blur-xl p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Rescue Radar • Live Campus Surplus Drops</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Good food. Lower price. <span className="text-amber-400">Zero unnecessary waste.</span>
          </h2>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            When campus kitchens detect likely end-of-service surplus, meals are instantly posted to Rescue Radar at 40–60% off. Claim fresh, safe food before it goes to waste.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300 bg-slate-950/70 border border-slate-800 px-3 py-1.5 rounded-xl">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>{rescueOffers.length} Active Rescue Drops Nearby</span>
            </div>

            <button
              onClick={() => setIsRescueModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 font-semibold transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Simulate Vendor Drop</span>
            </button>
          </div>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-amber-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search surplus meal or stall..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 focus:border-amber-500/50 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-500 hover:text-white p-0.5 rounded cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {[
            { id: 'all', label: 'All Drops' },
            { id: 'veg', label: '🌿 Pure Veg' },
            { id: 'non-veg', label: '🍗 Non-Veg' },
            { id: 'high-protein', label: '💪 High Protein (20g+)' },
            { id: 'nearby', label: '📍 Nearby (<400m)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                filter === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                  : 'bg-slate-900/70 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500 hidden lg:inline-block">
          Showing {filteredOffers.length} offers
        </span>
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOffers.map((offer) => {
          const discountPercent = Math.round(
            ((offer.originalPrice - offer.rescuePrice) / offer.originalPrice) * 100
          );
          const isClaimed = claimedIds[offer.id];
          const isSoldOut = offer.mealsLeft <= 0;

          return (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`relative rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 ${
                isSoldOut
                  ? 'bg-slate-950/50 border-slate-800 opacity-60'
                  : 'bg-slate-900/80 backdrop-blur-md border-amber-500/40 hover:border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.08)]'
              }`}
            >
              {/* Top ambient highlight */}
              <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-amber-500/10 to-transparent pointer-events-none" />

              <div className="p-5 space-y-4 relative z-10">
                {/* Header row: Badge + Distance */}
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Rescue Meal • {discountPercent}% OFF
                  </span>

                  <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded-lg border border-slate-800">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {offer.distanceMeters}m
                  </span>
                </div>

                {/* Dish Info */}
                <div>
                  <h3 className="text-lg font-black text-white leading-snug">{offer.dishName}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <span>{offer.vendorName}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-500">{offer.zone}</span>
                  </p>
                </div>

                {/* Pricing & Savings Hero */}
                <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">Rescue Price</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        ₹{offer.rescuePrice}
                      </span>
                      <span className="text-xs font-mono text-slate-500 line-through">
                        ₹{offer.originalPrice}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase font-mono text-emerald-400 block font-bold">You Save</span>
                    <span className="text-sm font-black text-emerald-400 font-mono">
                      ₹{offer.originalPrice - offer.rescuePrice}
                    </span>
                  </div>
                </div>

                {/* Macros & Pickup Deadline */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[9px] uppercase font-mono text-slate-500 block">Protein</span>
                    <span className="font-bold text-emerald-400 font-mono flex items-center justify-center gap-0.5">
                      <Beef className="w-3 h-3" />
                      {offer.proteinGrams}g
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[9px] uppercase font-mono text-slate-500 block">Calories</span>
                    <span className="font-bold text-slate-300 font-mono flex items-center justify-center gap-0.5">
                      <Flame className="w-3 h-3 text-orange-400" />
                      {offer.calories}
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
                    <span className="text-[9px] uppercase font-mono text-slate-500 block">Pickup</span>
                    <span className="font-bold text-amber-300 font-mono flex items-center justify-center gap-0.5 truncate">
                      <Clock className="w-3 h-3" />
                      {offer.pickupDeadline}
                    </span>
                  </div>
                </div>

                {/* AI Reason note */}
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200/90 leading-relaxed">
                  <strong>AI Note:</strong> {offer.reason}
                </div>

                {/* Inventory bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Remaining Inventory</span>
                    <strong className={offer.mealsLeft <= 5 ? 'text-rose-400 font-mono' : 'text-amber-300 font-mono'}>
                      {offer.mealsLeft} meals left
                    </strong>
                  </div>
                  <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                      style={{ width: `${(offer.mealsLeft / offer.totalInitialMeals) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Claim Button */}
              <div className="p-5 pt-0">
                <motion.button
                  whileHover={{ scale: isSoldOut ? 1 : 1.02 }}
                  whileTap={{ scale: isSoldOut ? 1 : 0.98 }}
                  disabled={isSoldOut}
                  onClick={() => handleClaim(offer)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg ${
                    isSoldOut
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : isClaimed
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-gradient-to-r from-amber-500 to-emerald-400 hover:from-amber-400 hover:to-emerald-300 text-slate-950 shadow-amber-500/20'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {isClaimed ? (
                      <motion.span
                        key="claimed"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Meal Claimed! Saved ₹{offer.originalPrice - offer.rescuePrice}</span>
                      </motion.span>
                    ) : isSoldOut ? (
                      <span>Sold Out</span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4" />
                        <span>Claim Meal (₹{offer.rescuePrice})</span>
                      </span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
