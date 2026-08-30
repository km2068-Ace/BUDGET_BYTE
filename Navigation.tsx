import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  Zap,
  MapPin,
  ShieldAlert,
  ChefHat,
  UtensilsCrossed,
  BarChart3,
  Play,
  Bell,
  Search,
  Wallet,
  Flame,
  ArrowRight,
  House,
  LogIn,
  LogOut,
  User,
  Store,
  X,
  Tag,
  Beef,
  Clock,
  ArrowUpRight,
  TrendingDown,
  Percent,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavTab, Dish, RescueOffer } from '../types';
import { CAMPUS_ZONES_LIST } from '../data/mockData';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    startDemo,
    isDemoRunning,
    wallet,
    proteinAchieved,
    rescueOffers,
    isAuthenticated,
    user,
    logout,
    addWalletBalance,
    dishes,
    logMealToWallet,
    setConstraints,
  } = useApp();

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [topUpValue, setTopUpValue] = useState('200');

  // Search Bar State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const totalRescueMealsAvailable = rescueOffers.reduce(
    (acc, cur) => (cur.status !== 'claimed_out' ? acc + cur.mealsLeft : acc),
    0
  );

  // Close search dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard shortcut (Ctrl+K or /) to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
        setIsSearchOpen(true);
      } else if (e.key === 'Escape') {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Results
  const normalizedQuery = searchQuery.trim().toLowerCase();

  // Dishes Search
  const matchingDishes = React.useMemo(() => {
    if (!normalizedQuery) return dishes.slice(0, 6);
    return dishes.filter((dish) => {
      const matchName = dish.name.toLowerCase().includes(normalizedQuery);
      const matchVendor = dish.vendor.toLowerCase().includes(normalizedQuery);
      const matchZone = dish.zone.toLowerCase().includes(normalizedQuery);
      const matchTags = dish.tags?.some((t) => t.toLowerCase().includes(normalizedQuery));
      const matchDiet = dish.dietary.toLowerCase().includes(normalizedQuery);
      return matchName || matchVendor || matchZone || matchTags || matchDiet;
    }).slice(0, 8);
  }, [dishes, normalizedQuery]);

  // Rescues Search
  const matchingRescues = React.useMemo(() => {
    if (!normalizedQuery) return rescueOffers.filter(r => r.mealsLeft > 0).slice(0, 3);
    return rescueOffers.filter((r) => {
      const matchDish = r.dishName.toLowerCase().includes(normalizedQuery);
      const matchVendor = r.vendorName.toLowerCase().includes(normalizedQuery);
      const matchZone = r.zone.toLowerCase().includes(normalizedQuery);
      return (matchDish || matchVendor || matchZone) && r.mealsLeft > 0;
    }).slice(0, 4);
  }, [rescueOffers, normalizedQuery]);

  const navItems: { id: NavTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'biteloop', label: 'Overview', icon: <House className="w-4 h-4" />, badge: 'Live' },
    { id: 'seller-portal', label: 'Seller Portal', icon: <Store className="w-4 h-4" />, badge: 'Retail' },
    { id: 'smart-meal', label: 'Smart Meal', icon: <UtensilsCrossed className="w-4 h-4" />, badge: 'Plan' },
    { id: 'rescue-radar', label: 'Rescue Radar', icon: <ShieldAlert className="w-4 h-4" />, badge: `${totalRescueMealsAvailable}` },
    { id: 'digital-twin', label: 'Campus Live', icon: <MapPin className="w-4 h-4" />, badge: 'AI' },
    { id: 'kitchen-command', label: 'Kitchen', icon: <ChefHat className="w-4 h-4" />, badge: 'Ops' },
    { id: 'sustainability', label: 'Impact', icon: <BarChart3 className="w-4 h-4" />, badge: 'Eco' },
  ];

  // Quick Action Handler from Search
  const handleSelectDish = (dish: Dish) => {
    setConstraints(prev => ({
      ...prev,
      zone: dish.zone,
      dietary: dish.dietary,
    }));
    setActiveTab('smart-meal');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleSelectRescue = (rescue: RescueOffer) => {
    setActiveTab('rescue-radar');
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="relative z-40">
      <aside className="fixed left-0 top-0 hidden h-screen w-72 border-r border-slate-800/80 bg-slate-950/75 backdrop-blur-2xl xl:flex xl:flex-col">
        <div className="flex items-center justify-between border-b border-slate-900/80 px-5 py-5">
          <button onClick={() => setActiveTab('biteloop')} className="flex items-center gap-3 text-left cursor-pointer">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500/50 via-fuchsia-500/35 to-rose-500/25 shadow-[0_0_30px_rgba(168,85,247,0.35)] ring-1 ring-violet-300/40">
              <Sparkles className="h-5 w-5 text-violet-100" />
              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_12px_rgba(168,85,247,0.9)]" />
            </div>
            <div>
              <div className="text-lg font-black tracking-tight text-white">
                Budget<span className="text-violet-300">-Bite</span>
              </div>
              <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">AI Campus Food</div>
            </div>
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-5">
          {navItems.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group relative flex w-full items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'border-violet-500/40 bg-gradient-to-r from-violet-500/15 via-fuchsia-500/12 to-rose-500/10 text-white shadow-[0_0_18px_rgba(168,85,247,0.22)]'
                    : 'border-transparent bg-transparent text-slate-400 hover:border-slate-800 hover:bg-slate-900/50 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active-indicator"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/15 via-fuchsia-500/10 to-rose-500/10"
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-3">
                  <span className={`rounded-xl p-2 ${isActive ? 'bg-violet-500/15 text-violet-200' : 'bg-slate-900/70 text-slate-400 group-hover:text-slate-200'}`}>
                    {tab.icon}
                  </span>
                  {tab.label}
                </span>
                {tab.badge && (
                  <span className={`relative z-10 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold tracking-wide ${
                    isActive
                      ? 'border-violet-500/30 bg-violet-500/10 text-violet-200'
                      : 'border-slate-700 bg-slate-900 text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-slate-900/80 px-3 py-4">
          <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2.5">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-emerald-500 text-sm font-bold text-white shadow-[0_0_18px_rgba(16,185,129,0.28)]">
                SB
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">Student Beta</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Campus View</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </div>
          </div>
        </div>
      </aside>

      <div className="xl:pl-72">
        <div className="sticky top-0 z-30 border-b border-slate-900/80 bg-slate-950/75 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
            {/* Global Search Bar with Live Spotlight Dropdown */}
            <div className="flex flex-1 items-center gap-3 relative" ref={searchContainerRef}>
              <div className="relative flex w-full max-w-lg items-center rounded-2xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 shadow-inner shadow-slate-950/40 focus-within:border-violet-500/60 focus-within:bg-slate-900 focus-within:ring-2 focus-within:ring-violet-500/20 transition-all">
                <Search className="h-4 w-4 text-violet-400 shrink-0 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  placeholder="Search dosa, pizza, biryani, canteens, price, high protein..."
                  className="w-full bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
                />
                {searchQuery ? (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      searchInputRef.current?.focus();
                    }}
                    className="p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-700 bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                    ⌘K
                  </kbd>
                )}
              </div>

              {/* Instant Search Spotlight Modal Dropdown */}
              <AnimatePresence>
                {isSearchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-full max-w-2xl rounded-2xl border border-violet-500/30 bg-slate-900/95 p-4 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl z-50 max-h-[80vh] overflow-y-auto"
                  >
                    {/* Quick Category Filters */}
                    {!searchQuery && (
                      <div className="mb-3.5 pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                          <span className="text-[11px] text-slate-500 mr-1 font-mono">Quick:</span>
                          {['Dosa', 'Pizza', 'High Protein', 'Pure Veg', 'Biryani', 'Chai', 'Coffee', 'One Food', 'RPL'].map((tag) => (
                            <button
                              key={tag}
                              onClick={() => {
                                setSearchQuery(tag);
                                searchInputRef.current?.focus();
                              }}
                              className="rounded-lg border border-slate-800/80 bg-slate-950/60 px-2.5 py-1 text-[11px] text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-colors cursor-pointer whitespace-nowrap"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Active Surplus Rescues Section */}
                    {matchingRescues.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                            <ShieldAlert className="w-3 h-3" />
                            Live Surplus Rescue Drops ({matchingRescues.length})
                          </span>
                          <button
                            onClick={() => {
                              setActiveTab('rescue-radar');
                              setIsSearchOpen(false);
                            }}
                            className="text-[10px] text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            View all <ArrowUpRight className="w-2.5 h-2.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matchingRescues.map((rescue) => {
                            const discountPct = Math.round(((rescue.originalPrice - rescue.rescuePrice) / rescue.originalPrice) * 100);
                            return (
                              <div
                                key={rescue.id}
                                onClick={() => handleSelectRescue(rescue)}
                                className="group p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/40 transition-all cursor-pointer flex items-center justify-between"
                              >
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="text-xs font-semibold text-white group-hover:text-amber-200">
                                      {rescue.dishName}
                                    </span>
                                    <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-bold text-amber-300">
                                      -{discountPct}%
                                    </span>
                                  </div>
                                  <p className="text-[10px] text-slate-400">
                                    {rescue.vendorName} • {rescue.mealsLeft} left
                                  </p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs font-bold text-emerald-400">
                                    ₹{rescue.rescuePrice}
                                  </span>
                                  <span className="block text-[10px] text-slate-500 line-through">
                                    ₹{rescue.originalPrice}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Matching Dishes Section */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                          <UtensilsCrossed className="w-3 h-3 text-violet-400" />
                          Matching Dishes & Menu Items ({matchingDishes.length})
                        </span>
                        <span className="text-[10px] text-slate-500">
                          Click to plan in Smart Meal
                        </span>
                      </div>

                      {matchingDishes.length === 0 ? (
                        <div className="text-center py-6 text-slate-500 text-xs">
                          No dishes found matching "<span className="text-slate-300">{searchQuery}</span>". Try searching for "Dosa", "Pizza", "Wings", or "Coffee".
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          {matchingDishes.map((dish) => (
                            <div
                              key={dish.id}
                              onClick={() => handleSelectDish(dish)}
                              className="group p-2.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-violet-500/40 hover:bg-violet-950/20 transition-all cursor-pointer flex items-center justify-between"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-2 h-2 rounded-full ${dish.dietary === 'veg' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-white group-hover:text-violet-200">
                                      {dish.name}
                                    </span>
                                    {dish.tags?.slice(0, 2).map((tag) => (
                                      <span
                                        key={tag}
                                        className="hidden sm:inline-block rounded bg-slate-800 px-1.5 py-0.2 text-[9px] text-slate-400"
                                      >
                                        #{tag}
                                      </span>
                                    ))}
                                  </div>
                                  <p className="text-[10px] text-slate-400">
                                    {dish.vendor} • <span className="text-slate-500">{dish.zone}</span>
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <div className="text-right">
                                  <div className="text-xs font-bold text-white">₹{dish.price}</div>
                                  <div className="text-[10px] text-amber-400 flex items-center gap-0.5 justify-end">
                                    <Flame className="w-2.5 h-2.5" />
                                    {dish.protein}g protein
                                  </div>
                                </div>
                                <span className="p-1 rounded-lg bg-violet-500/10 text-violet-300 group-hover:bg-violet-500 group-hover:text-slate-950 transition-colors">
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Portal Navigation Links */}
                    <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                      <span>Quick Jump:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setActiveTab('seller-portal');
                            setIsSearchOpen(false);
                          }}
                          className="text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Store className="w-3 h-3" /> Seller Portal
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => {
                            setActiveTab('smart-meal');
                            setIsSearchOpen(false);
                          }}
                          className="text-violet-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <UtensilsCrossed className="w-3 h-3" /> Meal Planner
                        </button>
                        <span>•</span>
                        <button
                          onClick={() => {
                            setActiveTab('digital-twin');
                            setIsSearchOpen(false);
                          }}
                          className="text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <MapPin className="w-3 h-3" /> Campus Map
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <div className="flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-medium text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                AI System Live
              </div>
              <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900/70 text-slate-300 transition hover:border-slate-700 hover:text-white cursor-pointer">
                <Bell className="h-4 w-4" />
                <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
              </button>
              <div className="flex items-center gap-3 rounded-full border border-slate-800 bg-slate-900/60 px-2 py-1.5 pr-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-violet-500 text-xs font-bold text-slate-950">
                  {isAuthenticated && user ? user.name.slice(0, 2).toUpperCase() : 'ST'}
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-semibold text-white">{isAuthenticated && user ? user.name : 'Student'}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{isAuthenticated ? 'Logged In' : 'Simulation'}</div>
                </div>
                {isAuthenticated ? (
                  <button
                    onClick={logout}
                    className="ml-1 inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-950/80 px-2 py-1 text-[10px] text-slate-300 hover:text-white cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    Logout
                  </button>
                ) : (
                  <button className="ml-1 inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] text-violet-200 hover:border-violet-400 cursor-pointer">
                    <LogIn className="h-3.5 w-3.5" />
                    Login
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <button className="rounded-full border border-slate-800 bg-slate-900/60 p-2 text-slate-300">
                <Bell className="h-4 w-4" />
              </button>
              <button
                onClick={startDemo}
                className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-[0_0_18px_rgba(16,185,129,0.35)]"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Demo
              </button>
            </div>
          </div>
        </div>

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('seller-portal')}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'seller-portal'
                  ? 'border-orange-500/50 bg-orange-600/20 text-orange-400 shadow-[0_0_15px_rgba(234,88,12,0.3)]'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:border-orange-500/40 hover:text-orange-300'
              }`}
            >
              <Store className="h-3.5 w-3.5 text-orange-400" />
              <span>Seller / Retailer Portal</span>
              <span className="rounded bg-orange-500/20 px-1.5 py-0.2 text-[9px] font-mono text-orange-300">
                Live Pricing
              </span>
            </button>

            <button
              onClick={() => setActiveTab('smart-meal')}
              className={`hidden sm:inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                activeTab === 'smart-meal'
                  ? 'border-violet-500/50 bg-violet-500/20 text-violet-200'
                  : 'border-white/5 bg-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <UtensilsCrossed className="h-3.5 w-3.5 text-violet-400" />
              <span>Student Meal Planner</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.18em] text-slate-400 md:flex">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              Simulation Mode
            </div>
            <div className="hidden items-center gap-2 text-xs text-slate-400 sm:flex">
              <Wallet className="h-3.5 w-3.5 text-violet-400" />
              <span>₹{Math.max(wallet.daily - wallet.spent, 0)}</span>
              <span className="text-slate-700">•</span>
              <Flame className="h-3.5 w-3.5 text-amber-400" />
              <span>{proteinAchieved}g</span>
            </div>

            <button
              onClick={() => setIsTopUpOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200 md:inline-flex cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5" />
              Add Money
            </button>

            <motion.button
              onClick={startDemo}
              whileHover={{ x: 2 }}
              whileTap={{ scale: 0.98 }}
              className={`hidden items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold text-slate-950 shadow-lg md:inline-flex cursor-pointer ${
                isDemoRunning
                  ? 'bg-amber-400 shadow-amber-500/25'
                  : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-violet-500/20'
              }`}
            >
              <span>Run AI Demo</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isTopUpOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              className="w-full max-w-md rounded-[30px] border border-violet-500/20 bg-slate-900/95 p-6 shadow-[0_30px_80px_rgba(76,29,149,0.45)]"
            >
              <div className="mb-5 flex items-start justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-violet-300">Wallet</div>
                  <h3 className="mt-2 text-2xl font-black text-white">Add money</h3>
                </div>
                <button
                  onClick={() => setIsTopUpOpen(false)}
                  className="rounded-full border border-slate-700 p-2 text-slate-300 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 text-sm text-slate-300">
                <div className="mb-2 text-[10px] uppercase tracking-[0.18em] text-slate-500">Available balance</div>
                <div className="text-2xl font-black text-white">₹{Math.max(wallet.daily - wallet.spent, 0)}</div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {[100, 250, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTopUpValue(String(amount))}
                    className={`rounded-2xl border px-3 py-2 text-sm font-semibold cursor-pointer ${
                      Number(topUpValue) === amount
                        ? 'border-violet-500/40 bg-violet-500/10 text-violet-200'
                        : 'border-slate-700 bg-slate-950/60 text-slate-300'
                    }`}
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              <label className="mt-5 block">
                <span className="mb-2 block text-[10px] uppercase tracking-[0.18em] text-slate-500">Custom amount</span>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={topUpValue}
                  onChange={(e) => setTopUpValue(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/80 px-3 py-3 text-base text-white outline-none ring-0 placeholder:text-slate-600"
                  placeholder="Enter amount"
                />
              </label>

              <button
                onClick={() => {
                  const value = Number(topUpValue);
                  if (value > 0) {
                    addWalletBalance(value);
                    setIsTopUpOpen(false);
                  }
                }}
                className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-400 px-4 py-3 text-sm font-bold text-white shadow-[0_0_22px_rgba(168,85,247,0.35)] cursor-pointer"
              >
                Top up wallet
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
