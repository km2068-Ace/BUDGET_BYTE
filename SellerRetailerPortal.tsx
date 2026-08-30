import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  DollarSign,
  Search,
  Plus,
  RefreshCw,
  Clock,
  History,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Percent,
  Sliders,
  Eye,
  ShieldCheck,
  ChevronDown,
  Flame,
  Zap,
  Lock,
  KeyRound,
  LogOut,
  Building2,
  FileCheck,
  UserCheck,
  Sparkles,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Dish, CampusZone } from '../types';

// Official Administration-Issued Merchant Credentials Registry
export interface RestaurantCredential {
  id: string;
  restaurantName: string;
  stallNumber: string;
  zone: CampusZone;
  adminPassword: string;
  managerName: string;
  licenseNo: string;
  fssaiGrade: string;
  category: 'Canteen' | 'Food Court' | 'Night Stall' | 'Mess' | 'Central Admin';
}

export const OFFICIAL_RESTAURANT_REGISTRY: RestaurantCredential[] = [
  {
    id: 'rest-super-admin',
    restaurantName: 'Campus Central Administration (Super Admin)',
    stallNumber: 'ADMIN-HQ-01',
    zone: 'Central Canteen',
    adminPassword: 'ADMIN@VITCampus2025',
    managerName: 'Directorate of Student Welfare & Canteens',
    licenseNo: 'VIT-ADMIN-MASTER-001',
    fssaiGrade: 'Grade A+ (Full Campus Governance)',
    category: 'Central Admin',
  },
  {
    id: 'rest-cc-north',
    restaurantName: 'Canteen Counter B (North Treats)',
    stallNumber: 'STALL-CC-02',
    zone: 'Central Canteen',
    adminPassword: 'ADMIN@NorthTreats2025',
    managerName: 'Chef Rajesh Sharma',
    licenseNo: 'VIT-FSSAI-2025/CC02',
    fssaiGrade: 'Grade A+ (Verified Clean)',
    category: 'Canteen',
  },
  {
    id: 'rest-cc-quick',
    restaurantName: 'Canteen Counter A (Quick Bites)',
    stallNumber: 'STALL-CC-01',
    zone: 'Central Canteen',
    adminPassword: 'ADMIN@QuickBites2025',
    managerName: 'Manager Dinesh M.',
    licenseNo: 'VIT-FSSAI-2025/CC01',
    fssaiGrade: 'Grade A (Verified)',
    category: 'Canteen',
  },
  {
    id: 'rest-cc-biryani',
    restaurantName: 'Canteen Counter D (Hyderabadi Pot)',
    stallNumber: 'STALL-CC-04',
    zone: 'Central Canteen',
    adminPassword: 'ADMIN@Hyderabadi2025',
    managerName: 'Chef Arshad Ali',
    licenseNo: 'VIT-FSSAI-2025/CC04',
    fssaiGrade: 'Grade A+ (Verified)',
    category: 'Canteen',
  },
  {
    id: 'rest-cc-royal',
    restaurantName: 'Canteen Counter C (Royal Thali)',
    stallNumber: 'STALL-CC-03',
    zone: 'Central Canteen',
    adminPassword: 'ADMIN@RoyalThali2025',
    managerName: 'Chef Mohan Lal',
    licenseNo: 'VIT-FSSAI-2025/CC03',
    fssaiGrade: 'Grade A (Verified)',
    category: 'Canteen',
  },
  {
    id: 'rest-fc-south',
    restaurantName: 'South Express (Food Court)',
    stallNumber: 'STALL-FC-01',
    zone: 'Food Court',
    adminPassword: 'ADMIN@SouthExpress2025',
    managerName: 'Manager Sundaram V.',
    licenseNo: 'VIT-FSSAI-2025/FC01',
    fssaiGrade: 'Grade A+ (Verified Clean)',
    category: 'Food Court',
  },
  {
    id: 'rest-fc-dragon',
    restaurantName: 'Dragon Bowl (Food Court)',
    stallNumber: 'STALL-FC-02',
    zone: 'Food Court',
    adminPassword: 'ADMIN@DragonBowl2025',
    managerName: 'Chef Lin Wang & Manoj',
    licenseNo: 'VIT-FSSAI-2025/FC02',
    fssaiGrade: 'Grade A (Verified)',
    category: 'Food Court',
  },
  {
    id: 'rest-fc-fiteats',
    restaurantName: 'FitEats Green Bar',
    stallNumber: 'STALL-FC-03',
    zone: 'Food Court',
    adminPassword: 'ADMIN@FitEats2025',
    managerName: 'Nutritionist Priya Sen',
    licenseNo: 'VIT-FSSAI-2025/FC03',
    fssaiGrade: 'Grade A+ (Certified Healthy)',
    category: 'Food Court',
  },
  {
    id: 'rest-fc-roll',
    restaurantName: 'Roll Express',
    stallNumber: 'STALL-FC-04',
    zone: 'Food Court',
    adminPassword: 'ADMIN@RollExpress2025',
    managerName: 'Manager Vikram Rathore',
    licenseNo: 'VIT-FSSAI-2025/FC04',
    fssaiGrade: 'Grade A (Verified)',
    category: 'Food Court',
  },
  {
    id: 'rest-hm-central',
    restaurantName: 'Main Campus Central Mess',
    stallNumber: 'STALL-MESS-01',
    zone: 'Hostel Mess Area',
    adminPassword: 'ADMIN@CentralMess2025',
    managerName: 'Mess Supervisor K. Venkat',
    licenseNo: 'VIT-MESS-2025/HQ01',
    fssaiGrade: 'Grade A+ (Hostel Board Certified)',
    category: 'Mess',
  },
  {
    id: 'rest-hm-snack',
    restaurantName: 'Mess Snack Corner',
    stallNumber: 'STALL-MESS-02',
    zone: 'Hostel Mess Area',
    adminPassword: 'ADMIN@MessSnack2025',
    managerName: 'Supervisor Ramesh J.',
    licenseNo: 'VIT-MESS-2025/HQ02',
    fssaiGrade: 'Grade A (Verified)',
    category: 'Mess',
  },
  {
    id: 'rest-hm-healthy',
    restaurantName: 'Mess Healthy Kitchen',
    stallNumber: 'STALL-MESS-03',
    zone: 'Hostel Mess Area',
    adminPassword: 'ADMIN@MessHealthy2025',
    managerName: 'Diet Supervisor Ananya',
    licenseNo: 'VIT-MESS-2025/HQ03',
    fssaiGrade: 'Grade A+ (Nutritional Audit Pass)',
    category: 'Mess',
  },
  {
    id: 'rest-ns-midnight',
    restaurantName: 'Midnight Fuel Stall',
    stallNumber: 'STALL-NS-01',
    zone: 'Night Stalls',
    adminPassword: 'ADMIN@Midnight2025',
    managerName: 'Stall Lead Imran Khan',
    licenseNo: 'VIT-FSSAI-2025/NS01',
    fssaiGrade: 'Grade A (Night Audit Pass)',
    category: 'Night Stall',
  },
  {
    id: 'rest-ns-momo',
    restaurantName: 'Tibetan Momo Hut',
    stallNumber: 'STALL-NS-02',
    zone: 'Night Stalls',
    adminPassword: 'ADMIN@MomoHut2025',
    managerName: 'Chef Tenzin Norbu',
    licenseNo: 'VIT-FSSAI-2025/NS02',
    fssaiGrade: 'Grade A+ (Verified Clean)',
    category: 'Night Stall',
  },
  {
    id: 'rest-ns-calcutta',
    restaurantName: 'Calcutta Roll Corner',
    stallNumber: 'STALL-NS-03',
    zone: 'Night Stalls',
    adminPassword: 'ADMIN@CalcuttaRoll2025',
    managerName: 'Chef Sourav Das',
    licenseNo: 'VIT-FSSAI-2025/NS03',
    fssaiGrade: 'Grade A (Verified)',
    category: 'Night Stall',
  },
  {
    id: 'rest-ac-sports',
    restaurantName: 'AC Sports & Nutrition Bar',
    stallNumber: 'STALL-AC-01',
    zone: 'Academic Complex',
    adminPassword: 'ADMIN@ACSports2025',
    managerName: 'Coach & Diet Specialist Kevin',
    licenseNo: 'VIT-FSSAI-2025/AC01',
    fssaiGrade: 'Grade A+ (Sports Council Audit)',
    category: 'Canteen',
  },
  {
    id: 'rest-ofw-uspizzeria',
    restaurantName: 'US. Pizzeria & One Food World',
    stallNumber: 'STALL-OFW-01',
    zone: 'One Food',
    adminPassword: 'aforapple',
    managerName: 'Chef Roberto & Vivek (The Blossom Cakes)',
    licenseNo: 'VIT-FSSAI-2025/OFW01',
    fssaiGrade: 'Grade A+ (Certified International)',
    category: 'Food Court',
  },
  {
    id: 'rest-cc-darshini',
    restaurantName: 'Campus Royal Canteen & Darshini',
    stallNumber: 'STALL-CC-05',
    zone: 'Central Canteen',
    adminPassword: 'ADMIN@RoyalDarshini2025',
    managerName: 'Chef Murugan & Raman',
    licenseNo: 'VIT-FSSAI-2025/CC05',
    fssaiGrade: 'Grade A+ (Verified Clean)',
    category: 'Canteen',
  },
  {
    id: 'rest-fp-rpl',
    restaurantName: 'Food Park RPL-P (Snacks & Dosa Hub)',
    stallNumber: 'STALL-FP-01',
    zone: 'Food Park',
    adminPassword: 'dhurandhar@vitv',
    managerName: 'Supervisor Prabhakar R. (RPL Canteen)',
    licenseNo: 'VIT-FSSAI-2025/RPL01',
    fssaiGrade: 'Grade A (Verified Daily)',
    category: 'Canteen',
  },
];

export const SellerRetailerPortal: React.FC = () => {
  const {
    dishes,
    updateDishPrice,
    addDish,
    deleteDish,
    batchUpdatePrices,
    resetDishesToDefault,
    priceChangeLogs,
    clearPriceLogs,
    selectedSellerVendor,
    setSelectedSellerVendor,
    setActiveTab,
    showToast,
  } = useApp();

  // ── AUTHENTICATION STATE ──────────────────────────────────────
  const [authenticatedRestaurant, setAuthenticatedRestaurant] = useState<RestaurantCredential | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = window.localStorage.getItem('budget-bite-seller-auth');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Login Form Inputs
  const [loginRestaurantName, setLoginRestaurantName] = useState<string>(
    OFFICIAL_RESTAURANT_REGISTRY[1].restaurantName
  );
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showDirectoryHelp, setShowDirectoryHelp] = useState<boolean>(false);
  const [showPasswordMask, setShowPasswordMask] = useState<boolean>(false);

  // Search & Filter in Portal
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState<string>('All');
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg' | 'vegan'>('all');
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'batch' | 'logs'>('catalog');

  // Edit / Add Dish States
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<string>('');
  const [editRescuePriceInput, setEditRescuePriceInput] = useState<string>('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Dish Form State
  const [newDishData, setNewDishData] = useState<{
    name: string;
    vendor: string;
    zone: CampusZone;
    price: number;
    rescuePrice: number;
    calories: number;
    protein: number;
    prepTime: number;
    dietary: 'veg' | 'non-veg' | 'vegan';
    packaging: 'compostable' | 'recyclable' | 'standard';
    description: string;
  }>({
    name: '',
    vendor: 'Canteen Counter B (North Treats)',
    zone: 'Central Canteen',
    price: 60,
    rescuePrice: 35,
    calories: 320,
    protein: 12,
    prepTime: 8,
    dietary: 'veg',
    packaging: 'compostable',
    description: 'Freshly prepared campus special with student nutrition balancing.',
  });

  // Batch Update State
  const [batchTarget, setBatchTarget] = useState<'all' | 'vendor' | 'zone'>('vendor');
  const [batchTargetValue, setBatchTargetValue] = useState<string>('Canteen Counter B (North Treats)');
  const [batchAdjType, setBatchAdjType] = useState<'percent' | 'fixed'>('percent');
  const [batchAmount, setBatchAmount] = useState<number>(-15);

  // Synchronize AppContext vendor filter with logged-in restaurant
  useEffect(() => {
    if (authenticatedRestaurant) {
      if (authenticatedRestaurant.category === 'Central Admin') {
        setSelectedSellerVendor('All');
      } else {
        setSelectedSellerVendor(authenticatedRestaurant.restaurantName);
        setNewDishData((prev) => ({
          ...prev,
          vendor: authenticatedRestaurant.restaurantName,
          zone: authenticatedRestaurant.zone,
        }));
      }
    }
  }, [authenticatedRestaurant, setSelectedSellerVendor]);

  // Unique vendors & zones list across existing catalog
  const uniqueVendors = useMemo(() => {
    const fromDishes = Array.from(new Set(dishes.map((d) => d.vendor)));
    const fromRegistry = OFFICIAL_RESTAURANT_REGISTRY.map((r) => r.restaurantName).filter(
      (n) => !n.includes('Super Admin')
    );
    const combined = Array.from(new Set([...fromDishes, ...fromRegistry]));
    return ['All', ...combined];
  }, [dishes]);

  const uniqueZones = useMemo(() => {
    const list = Array.from(new Set(dishes.map((d) => d.zone)));
    return ['All', ...list];
  }, [dishes]);

  // ── AUTHENTICATION HANDLERS ──────────────────────────────────
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanInputName = loginRestaurantName.trim().toLowerCase();
    const cleanInputPassword = loginPassword.trim();

    // Check against official registry
    const matchedAccount = OFFICIAL_RESTAURANT_REGISTRY.find(
      (r) => r.restaurantName.toLowerCase() === cleanInputName
    );

    // Universal Admin master passwords provided by College Administration
    const isMasterPassword =
      cleanInputPassword === 'ADMIN@VITCampus2025' ||
      cleanInputPassword === 'ADMIN@2025' ||
      cleanInputPassword === 'VIT@2025' ||
      cleanInputPassword === 'admin123' ||
      cleanInputPassword === '123456';

    if (matchedAccount) {
      if (matchedAccount.adminPassword === cleanInputPassword || isMasterPassword) {
        setAuthenticatedRestaurant(matchedAccount);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('budget-bite-seller-auth', JSON.stringify(matchedAccount));
        }
        showToast(`✓ Welcome ${matchedAccount.restaurantName}! Merchant session verified.`, 'success');
        setLoginPassword('');
        return;
      }
    } else {
      // Dynamic fallback for any custom restaurant name with master admin password
      if (isMasterPassword && cleanInputName.length > 2) {
        const dynamicAccount: RestaurantCredential = {
          id: `rest-custom-${Date.now()}`,
          restaurantName: loginRestaurantName.trim(),
          stallNumber: 'STALL-CAMPUS-VAR',
          zone: 'Central Canteen',
          adminPassword: cleanInputPassword,
          managerName: 'Campus Authorized Merchant Lead',
          licenseNo: `VIT-FSSAI-2025/MERCHANT-${Math.floor(100 + Math.random() * 900)}`,
          fssaiGrade: 'Grade A (Campus Certified)',
          category: 'Canteen',
        };
        setAuthenticatedRestaurant(dynamicAccount);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('budget-bite-seller-auth', JSON.stringify(dynamicAccount));
        }
        showToast(`✓ Verified merchant session for ${dynamicAccount.restaurantName}.`, 'success');
        setLoginPassword('');
        return;
      }
    }

    setLoginError(
      'correct password daalo baiya / pls enter the correct password !!!!'
    );
  };

  const handleQuickLogin = (account: RestaurantCredential) => {
    setLoginRestaurantName(account.restaurantName);
    setLoginPassword(account.adminPassword);
    setAuthenticatedRestaurant(account);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('budget-bite-seller-auth', JSON.stringify(account));
    }
    showToast(`✓ Authenticated as ${account.restaurantName} (Stall: ${account.stallNumber}).`, 'success');
  };

  const handleLogout = () => {
    setAuthenticatedRestaurant(null);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('budget-bite-seller-auth');
    }
    showToast('Logged out of seller console.', 'info');
  };

  // ── FILTERED CATALOG ──────────────────────────────────────────
  const filteredDishes = useMemo(() => {
    if (!authenticatedRestaurant) return [];

    const isSuperAdmin = authenticatedRestaurant.category === 'Central Admin';

    return dishes.filter((dish) => {
      // Super admin can see all or filter; specific restaurant only sees their own dishes
      const matchesVendor = isSuperAdmin
        ? selectedSellerVendor === 'All' || dish.vendor === selectedSellerVendor
        : dish.vendor.toLowerCase() === authenticatedRestaurant.restaurantName.toLowerCase();

      const matchesZone = selectedZoneFilter === 'All' || dish.zone === selectedZoneFilter;
      const matchesDietary = dietaryFilter === 'all' || dish.dietary === dietaryFilter;
      const matchesSearch =
        dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.vendor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dish.zone.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesVendor && matchesZone && matchesDietary && matchesSearch;
    });
  }, [dishes, authenticatedRestaurant, selectedSellerVendor, selectedZoneFilter, dietaryFilter, searchQuery]);

  // Summary Metrics
  const metrics = useMemo(() => {
    if (!authenticatedRestaurant) return { totalItems: 0, avgPrice: 0, rescueReady: 0, avgProtein: 0 };

    const isSuperAdmin = authenticatedRestaurant.category === 'Central Admin';
    const targetSet = isSuperAdmin
      ? selectedSellerVendor === 'All'
        ? dishes
        : dishes.filter((d) => d.vendor === selectedSellerVendor)
      : dishes.filter((d) => d.vendor.toLowerCase() === authenticatedRestaurant.restaurantName.toLowerCase());

    const avgPrice = targetSet.length
      ? Math.round(targetSet.reduce((acc, d) => acc + d.price, 0) / targetSet.length)
      : 0;
    const rescueReady = targetSet.filter((d) => d.rescuePrice).length;
    const avgProtein = targetSet.length
      ? Math.round(targetSet.reduce((acc, d) => acc + d.protein, 0) / targetSet.length)
      : 0;

    return {
      totalItems: targetSet.length,
      avgPrice,
      rescueReady,
      avgProtein,
    };
  }, [dishes, authenticatedRestaurant, selectedSellerVendor]);

  // Start inline editing
  const handleStartEdit = (dish: Dish) => {
    setEditingDishId(dish.id);
    setEditPriceInput(String(dish.price));
    setEditRescuePriceInput(dish.rescuePrice ? String(dish.rescuePrice) : '');
  };

  // Save inline edit
  const handleSaveEdit = (dishId: string) => {
    const numPrice = parseFloat(editPriceInput);
    const numRescue = editRescuePriceInput ? parseFloat(editRescuePriceInput) : undefined;

    if (isNaN(numPrice) || numPrice < 0) {
      showToast('Please enter a valid price amount.', 'error');
      return;
    }

    updateDishPrice(dishId, numPrice, numRescue);
    setEditingDishId(null);
  };

  // Quick incremental adjust
  const handleQuickAdjust = (dish: Dish, delta: number) => {
    const newPrice = Math.max(5, dish.price + delta);
    const newRescue = dish.rescuePrice ? Math.max(5, dish.rescuePrice + delta) : undefined;
    updateDishPrice(dish.id, newPrice, newRescue);
  };

  // Submit new dish
  const handleCreateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDishData.name.trim()) {
      showToast('Please provide a valid dish name.', 'error');
      return;
    }

    const assignedVendor =
      authenticatedRestaurant && authenticatedRestaurant.category !== 'Central Admin'
        ? authenticatedRestaurant.restaurantName
        : newDishData.vendor;

    const assignedZone =
      authenticatedRestaurant && authenticatedRestaurant.category !== 'Central Admin'
        ? authenticatedRestaurant.zone
        : newDishData.zone;

    addDish({
      ...newDishData,
      vendor: assignedVendor,
      zone: assignedZone,
    });

    setIsAddModalOpen(false);
    setNewDishData({
      name: '',
      vendor: assignedVendor,
      zone: assignedZone,
      price: 60,
      rescuePrice: 35,
      calories: 320,
      protein: 12,
      prepTime: 8,
      dietary: 'veg',
      packaging: 'compostable',
      description: 'Freshly prepared campus special with student nutrition balancing.',
    });
  };

  // Execute batch update
  const handleExecuteBatch = () => {
    const isSuperAdmin = authenticatedRestaurant?.category === 'Central Admin';
    const targetValue = isSuperAdmin
      ? batchTargetValue
      : authenticatedRestaurant?.restaurantName || 'All';

    batchUpdatePrices(
      {
        type: isSuperAdmin ? batchTarget : 'vendor',
        value: targetValue,
      },
      batchAdjType,
      batchAmount
    );
  };

  // ═════════════════════════════════════════════════════════════════
  // VIEW 1: RESTAURANT & SELLER LOGIN PORTAL GATE
  // ═════════════════════════════════════════════════════════════════
  if (!authenticatedRestaurant) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-slate-200 font-sans p-4 md:p-10 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Ambient subtle glow background */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-4xl relative z-10">
          {/* Header Card */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#16191E] border border-white/10 rounded-full text-xs text-orange-400 mb-3 shadow-inner">
              <ShieldCheck className="w-4 h-4 text-orange-500" />
              <span>VIT College Food Administration • Merchant Authentication</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-white tracking-tight">
              Seller & Restaurant Portal
            </h1>
            <p className="text-xs md:text-sm text-slate-400 max-w-xl mx-auto mt-2">
              Authorized login for campus canteen counters, food courts, and mess stalls. Enter your restaurant name and administration-issued password to manage live item rates and surplus rescue discounts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Login Form Box */}
            <div className="lg:col-span-6 bg-[#16191E] border border-white/10 rounded-xl p-6 md:p-8 shadow-2xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white">Merchant Login</h2>
                    <p className="text-[11px] text-slate-400">Official Campus Dining Registry</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">
                  Admin Verified
                </span>
              </div>

              {loginError && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3.5 mb-5 bg-rose-950/50 border border-rose-500/40 rounded-lg text-xs text-rose-200 flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-rose-300">Authentication Failed</p>
                    <p className="text-[11px] text-rose-200/80 mt-0.5">{loginError}</p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                {/* Restaurant Name Select / Input */}
                <div>
                  <label className="block font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Restaurant / Stall Name *</span>
                    <span className="text-[10px] text-slate-500">Select or Type Exact Stall</span>
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={loginRestaurantName}
                      onChange={(e) => {
                        setLoginRestaurantName(e.target.value);
                        setLoginError(null);
                      }}
                      className="w-full bg-[#0A0B0D] border border-white/10 rounded-lg pl-9 pr-8 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-orange-500 transition-colors font-medium cursor-pointer"
                    >
                      {OFFICIAL_RESTAURANT_REGISTRY.map((r) => (
                        <option key={r.id} value={r.restaurantName}>
                          {r.restaurantName} ({r.stallNumber} • {r.zone})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                {/* Administration-Given Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-medium text-slate-300">
                      Administration Password *
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPasswordMask(!showPasswordMask)}
                      className="text-[10px] text-orange-400 hover:text-orange-300 transition-colors cursor-pointer"
                    >
                      {showPasswordMask ? 'Hide password' : 'Show password'}
                    </button>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                    <input
                      type={showPasswordMask ? 'text' : 'password'}
                      required
                      placeholder="e.g., ADMIN@NorthTreats2025"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        setLoginError(null);
                      }}
                      className="w-full bg-[#0A0B0D] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 font-mono transition-colors"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1.5 flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    Password given by college administration for this specific stall.
                  </p>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full mt-2 py-3 bg-orange-600 hover:bg-orange-500 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Authenticate & Access Menu Portal
                </button>
              </form>

              {/* Student View Shortcut */}
              <div className="mt-6 pt-5 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-slate-400">Are you a student looking for meals?</span>
                <button
                  onClick={() => setActiveTab('smart-meal')}
                  className="text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Student Meal Planner
                </button>
              </div>
            </div>

            {/* Quick Access & Admin Credentials Directory */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#16191E] border border-white/10 rounded-xl p-5 md:p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <FileCheck className="w-4 h-4 text-orange-400" />
                    <h3 className="text-sm font-semibold text-white">
                      College Admin Credentials Directory
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                    Official Issuance
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  For demonstration and evaluation, click any restaurant below to auto-authenticate with its official college administration-assigned credentials:
                </p>

                {/* Interactive Click-to-Login Credentials List */}
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {OFFICIAL_RESTAURANT_REGISTRY.map((acc) => (
                    <div
                      key={acc.id}
                      onClick={() => handleQuickLogin(acc)}
                      className="p-3 bg-[#0A0B0D] hover:bg-orange-600/10 border border-white/5 hover:border-orange-500/40 rounded-lg cursor-pointer transition-all group flex items-center justify-between"
                    >
                      <div className="min-w-0 pr-2">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-white group-hover:text-orange-300 truncate">
                            {acc.restaurantName}
                          </p>
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                              acc.category === 'Central Admin'
                                ? 'bg-purple-950/70 text-purple-300 border border-purple-500/30'
                                : acc.category === 'Food Court'
                                ? 'bg-blue-950/70 text-blue-300 border border-blue-500/30'
                                : acc.category === 'Night Stall'
                                ? 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {acc.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Stall: <span className="text-slate-300 font-mono">{acc.stallNumber}</span> • {acc.zone}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-orange-400/90">
                          <KeyRound className="w-3 h-3" />
                          <span>Pass: {acc.adminPassword}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="px-2.5 py-1 bg-white/5 group-hover:bg-orange-600 text-slate-300 group-hover:text-white rounded text-[10px] font-medium shrink-0 transition-colors"
                      >
                        Auto Fill & Login
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Advisory */}
              <div className="p-3.5 bg-[#16191E]/60 border border-white/5 rounded-xl flex items-start gap-2.5 text-[11px] text-slate-400">
                <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <p>
                  Merchant access keys are provisioned under the Directorate of Student Welfare. Rates modified here update student meal algorithms, zero-spend recommendations, and telemetry in real time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════
  // VIEW 2: AUTHENTICATED RESTAURANT CONSOLE & LIVE CATALOG PORTAL
  // ═════════════════════════════════════════════════════════════════
  const isSuperAdmin = authenticatedRestaurant.category === 'Central Admin';

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-slate-200 font-sans p-4 md:p-8 selection:bg-orange-600/30 selection:text-orange-200">
      {/* Authenticated Top Navigation Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center flex-wrap gap-2.5">
              <span className="px-2.5 py-1 bg-orange-600/20 text-orange-400 border border-orange-500/30 rounded text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                {isSuperAdmin ? 'Central Administration Mode' : 'Merchant Portal'}
              </span>
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                College Admin Auth: Verified
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded border border-white/10">
                License: {authenticatedRestaurant.licenseNo}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-serif italic text-white mt-2 tracking-tight">
              {authenticatedRestaurant.restaurantName}
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-2xl">
              {isSuperAdmin
                ? 'Central administrative control. Manage prices and publish dynamic surplus discounts across all campus dining stalls.'
                : `Logged in as ${authenticatedRestaurant.managerName} (${authenticatedRestaurant.stallNumber} • ${authenticatedRestaurant.zone}). All updates sync instantly to student apps.`}
            </p>
          </div>

          {/* Action Quickbar & Logout */}
          <div className="flex items-center flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('smart-meal')}
              className="px-3.5 py-2 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
              title="See how students see the updated pricing in the Smart Meal Planner"
            >
              <Eye className="w-3.5 h-3.5 text-orange-400" />
              View Student App
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium shadow-lg shadow-orange-950/40 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Menu Item
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded bg-white/5 hover:bg-rose-950/50 border border-white/10 hover:border-rose-500/40 text-xs font-medium text-slate-300 hover:text-rose-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Switch restaurant account or logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              Switch Stall / Logout
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          {/* Active Outlet Details Card */}
          <div className="bg-[#16191E] border border-white/5 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                {isSuperAdmin ? 'Filter Outlet Stalls' : 'Authorized Merchant Stalls'}
              </p>
              {isSuperAdmin ? (
                <div className="relative mt-1">
                  <select
                    value={selectedSellerVendor}
                    onChange={(e) => setSelectedSellerVendor(e.target.value)}
                    className="w-full bg-[#0E1014] text-white border border-white/10 rounded px-3 py-2 text-xs appearance-none focus:outline-none focus:border-orange-500 font-medium cursor-pointer"
                  >
                    {uniqueVendors.map((vendor) => (
                      <option key={vendor} value={vendor}>
                        {vendor === 'All' ? '⚡ All Campus Stalls & Canteens' : `📍 ${vendor}`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              ) : (
                <div className="mt-1">
                  <p className="text-sm font-semibold text-white">{authenticatedRestaurant.restaurantName}</p>
                  <p className="text-[11px] text-orange-400 font-mono">{authenticatedRestaurant.stallNumber} • {authenticatedRestaurant.zone}</p>
                </div>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              {authenticatedRestaurant.fssaiGrade}
            </p>
          </div>

          {/* Metric 1 */}
          <div className="bg-[#16191E] border border-white/5 rounded-lg p-5">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              Active Menu Items
            </p>
            <p className="text-3xl font-serif italic text-white">{metrics.totalItems}</p>
            <p className="text-[11px] text-slate-500 mt-2">
              Live in student meal optimizer
            </p>
          </div>

          {/* Metric 2 */}
          <div className="bg-[#16191E] border border-white/5 rounded-lg p-5">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              Average Meal Price
            </p>
            <p className="text-3xl font-serif italic text-orange-400">₹{metrics.avgPrice}</p>
            <p className="text-[11px] text-slate-500 mt-2">
              Avg student budget ₹250/day
            </p>
          </div>

          {/* Metric 3 */}
          <div className="bg-[#16191E] border border-white/5 rounded-lg p-5">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-1">
              Surplus Rescue Ready
            </p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-serif italic text-emerald-400">{metrics.rescueReady}</p>
              <span className="text-xs text-slate-400">discounted items</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Triggers radar push notifications
            </p>
          </div>
        </div>

        {/* Tab Navigation (Catalog / Batch Adjust / History Logs) */}
        <div className="flex items-center justify-between border-b border-white/10 mt-8 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSubTab('catalog')}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'catalog'
                  ? 'border-orange-500 text-orange-400 bg-white/[0.02]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              Live Menu Catalog ({filteredDishes.length})
            </button>

            <button
              onClick={() => setActiveSubTab('batch')}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'batch'
                  ? 'border-orange-500 text-orange-400 bg-white/[0.02]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Batch Price Adjuster
            </button>

            <button
              onClick={() => setActiveSubTab('logs')}
              className={`px-4 py-2.5 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
                activeSubTab === 'logs'
                  ? 'border-orange-500 text-orange-400 bg-white/[0.02]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Price Change Audit Logs ({priceChangeLogs.length})
            </button>
          </div>

          <button
            onClick={resetDishesToDefault}
            className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1.5 px-2 py-1 rounded transition-colors cursor-pointer"
            title="Reset all prices to campus defaults"
          >
            <RefreshCw className="w-3 h-3" />
            Reset to Default
          </button>
        </div>

        {/* SUB-VIEW 1: LIVE CATALOG & INLINE PRICE EDITOR */}
        {activeSubTab === 'catalog' && (
          <div className="space-y-4">
            {/* Filter bar */}
            <div className="bg-[#16191E] border border-white/5 rounded-lg p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search item, vendor or zone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#0A0B0D] border border-white/10 rounded pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500/50"
                />
              </div>

              {/* Zone and Dietary filters */}
              <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
                {isSuperAdmin && (
                  <div className="flex items-center gap-1 bg-[#0A0B0D] p-1 rounded border border-white/10 text-xs">
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 px-2">Zone:</span>
                    <select
                      value={selectedZoneFilter}
                      onChange={(e) => setSelectedZoneFilter(e.target.value)}
                      className="bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer pr-2"
                    >
                      {uniqueZones.map((z) => (
                        <option key={z} value={z} className="bg-[#16191E] text-white">
                          {z}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="flex items-center gap-1 bg-[#0A0B0D] p-1 rounded border border-white/10 text-xs">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 px-2">Diet:</span>
                  {(['all', 'veg', 'non-veg', 'vegan'] as const).map((diet) => (
                    <button
                      key={diet}
                      onClick={() => setDietaryFilter(diet)}
                      className={`px-2 py-0.5 rounded text-[11px] capitalize cursor-pointer transition-colors ${
                        dietaryFilter === diet
                          ? 'bg-orange-600 text-white font-medium'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {diet}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Catalog Table */}
            <div className="bg-[#16191E] border border-white/5 rounded-lg overflow-hidden">
              <div className="grid grid-cols-12 p-3.5 border-b border-white/10 text-[10px] uppercase tracking-[0.15em] font-semibold text-slate-400 bg-[#0E1014]">
                <div className="col-span-4 px-2">Item & Stall Details</div>
                <div className="col-span-2 text-center">Nutrition & Prep</div>
                <div className="col-span-2 text-center">Current Price</div>
                <div className="col-span-2 text-center">Surplus Rescue Price</div>
                <div className="col-span-2 text-right pr-2">Quick Actions</div>
              </div>

              <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
                {filteredDishes.length === 0 ? (
                  <div className="p-12 text-center text-slate-500">
                    <p className="text-sm">No menu items found for this restaurant stall.</p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="mt-3 px-3 py-1.5 bg-orange-600 text-white rounded text-xs inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add first item for {authenticatedRestaurant.restaurantName}
                    </button>
                  </div>
                ) : (
                  filteredDishes.map((dish) => {
                    const isEditing = editingDishId === dish.id;

                    return (
                      <div
                        key={dish.id}
                        className="grid grid-cols-12 p-4 items-center group hover:bg-white/[0.02] transition-colors"
                      >
                        {/* Item Info */}
                        <div className="col-span-4 flex items-center gap-3 px-2">
                          <div className="w-10 h-10 rounded bg-[#252A31] border border-white/10 flex items-center justify-center font-serif text-orange-400 font-bold shrink-0">
                            {dish.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium text-white truncate">{dish.name}</p>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-mono uppercase ${
                                  dish.dietary === 'veg'
                                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                                }`}
                              >
                                {dish.dietary}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400 truncate">
                              {dish.vendor} • <span className="text-slate-500">{dish.zone}</span>
                            </p>
                          </div>
                        </div>

                        {/* Nutrition & Prep Time */}
                        <div className="col-span-2 text-center text-xs">
                          <div className="flex items-center justify-center gap-2 text-slate-300 font-mono">
                            <span className="text-orange-400 font-bold">{dish.protein}g</span> prot
                            <span className="text-slate-600">•</span>
                            <span>{dish.calories} kcal</span>
                          </div>
                          <p className="text-[10px] text-slate-500 flex items-center justify-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3" />
                            ~{dish.prepTime} min prep
                          </p>
                        </div>

                        {/* Current Price & Inline Edit */}
                        <div className="col-span-2 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-xs text-orange-400 font-mono">₹</span>
                              <input
                                type="number"
                                min="0"
                                value={editPriceInput}
                                onChange={(e) => setEditPriceInput(e.target.value)}
                                className="bg-[#0A0B0D] border border-orange-500 rounded w-20 px-2 py-1 text-xs font-mono text-orange-300 focus:outline-none"
                                autoFocus
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <span className="text-base font-bold font-mono text-white">
                                ₹{dish.price}
                              </span>
                              <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleQuickAdjust(dish, -5)}
                                  className="w-5 h-5 bg-white/5 hover:bg-white/10 rounded text-[10px] font-mono text-slate-300 flex items-center justify-center cursor-pointer"
                                  title="Decrease ₹5"
                                >
                                  -5
                                </button>
                                <button
                                  onClick={() => handleQuickAdjust(dish, 5)}
                                  className="w-5 h-5 bg-white/5 hover:bg-white/10 rounded text-[10px] font-mono text-slate-300 flex items-center justify-center cursor-pointer"
                                  title="Increase ₹5"
                                >
                                  +5
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Rescue Price */}
                        <div className="col-span-2 text-center">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <span className="text-xs text-emerald-400 font-mono">₹</span>
                              <input
                                type="number"
                                min="0"
                                placeholder="None"
                                value={editRescuePriceInput}
                                onChange={(e) => setEditRescuePriceInput(e.target.value)}
                                className="bg-[#0A0B0D] border border-emerald-500/50 rounded w-20 px-2 py-1 text-xs font-mono text-emerald-300 focus:outline-none"
                              />
                            </div>
                          ) : dish.rescuePrice ? (
                            <div>
                              <span className="text-sm font-mono text-emerald-400 font-bold">
                                ₹{dish.rescuePrice}
                              </span>
                              <span className="block text-[10px] text-emerald-500/70">
                                {Math.round(((dish.price - dish.rescuePrice) / dish.price) * 100)}% off
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-600 font-mono">—</span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 text-right pr-2">
                          {isEditing ? (
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleSaveEdit(dish.id)}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingDishId(null)}
                                className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-[11px] transition-colors cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleStartEdit(dish)}
                                className="px-2.5 py-1 bg-white/5 hover:bg-orange-600/20 text-slate-300 hover:text-orange-400 border border-white/10 rounded text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Edit Price
                              </button>
                              <button
                                onClick={() => deleteDish(dish.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Delete item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUB-VIEW 2: BATCH PRICE ADJUSTER */}
        {activeSubTab === 'batch' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-[#16191E] border border-white/5 rounded-lg p-6">
              <h2 className="text-lg font-serif italic text-white mb-1">
                Batch Price Rule Engine
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                {isSuperAdmin
                  ? 'Apply bulk price adjustments or rush-hour discounts across any food court, vendor stall, or all menu items in one click.'
                  : `Apply bulk price adjustments or peak rush discounts across all dishes for ${authenticatedRestaurant.restaurantName}.`}
              </p>

              <div className="space-y-5">
                {/* Step 1: Target Selector (Available for Super Admin, or locked to Stall for Vendor) */}
                {isSuperAdmin && (
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                      1. Select Target Scope
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => {
                          setBatchTarget('vendor');
                          setBatchTargetValue(uniqueVendors[1] || 'Canteen Counter B (North Treats)');
                        }}
                        className={`p-3 rounded border text-left transition-all cursor-pointer ${
                          batchTarget === 'vendor'
                            ? 'border-orange-500 bg-orange-600/10 text-white'
                            : 'border-white/10 bg-[#0E1014] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <p className="text-xs font-medium">By Vendor Stall</p>
                        <p className="text-[10px] opacity-60">Specific canteen or counter</p>
                      </button>

                      <button
                        onClick={() => {
                          setBatchTarget('zone');
                          setBatchTargetValue(uniqueZones[1] || 'Central Canteen');
                        }}
                        className={`p-3 rounded border text-left transition-all cursor-pointer ${
                          batchTarget === 'zone'
                            ? 'border-orange-500 bg-orange-600/10 text-white'
                            : 'border-white/10 bg-[#0E1014] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <p className="text-xs font-medium">By Campus Zone</p>
                        <p className="text-[10px] opacity-60">Entire block or cafeteria</p>
                      </button>

                      <button
                        onClick={() => {
                          setBatchTarget('all');
                          setBatchTargetValue('All Campus');
                        }}
                        className={`p-3 rounded border text-left transition-all cursor-pointer ${
                          batchTarget === 'all'
                            ? 'border-orange-500 bg-orange-600/10 text-white'
                            : 'border-white/10 bg-[#0E1014] text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <p className="text-xs font-medium">Entire Campus</p>
                        <p className="text-[10px] opacity-60">All {dishes.length} menu items</p>
                      </button>
                    </div>
                  </div>
                )}

                {/* Sub target selection dropdown for Super Admin */}
                {isSuperAdmin && batchTarget === 'vendor' && (
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Select Vendor:</label>
                    <select
                      value={batchTargetValue}
                      onChange={(e) => setBatchTargetValue(e.target.value)}
                      className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                    >
                      {uniqueVendors.filter((v) => v !== 'All').map((v) => (
                        <option key={v} value={v}>
                          {v}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Step 2: Adjustment Mode */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
                    {isSuperAdmin ? '2.' : '1.'} Choose Price Adjustment Mode
                  </label>
                  <div className="flex items-center gap-3 mb-3">
                    <button
                      onClick={() => setBatchAdjType('percent')}
                      className={`px-4 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                        batchAdjType === 'percent'
                          ? 'bg-orange-600 text-white'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <Percent className="w-3.5 h-3.5" />
                      Percentage (%)
                    </button>
                    <button
                      onClick={() => setBatchAdjType('fixed')}
                      className={`px-4 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 cursor-pointer ${
                        batchAdjType === 'fixed'
                          ? 'bg-orange-600 text-white'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Flat Rupee Amount (₹)
                    </button>
                  </div>

                  {/* Presets */}
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider">Presets:</span>
                    {batchAdjType === 'percent' ? (
                      <>
                        <button
                          onClick={() => setBatchAmount(-20)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-mono text-emerald-400 cursor-pointer"
                        >
                          -20% Flash Discount
                        </button>
                        <button
                          onClick={() => setBatchAmount(-10)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-mono text-emerald-400 cursor-pointer"
                        >
                          -10% Happy Hour
                        </button>
                        <button
                          onClick={() => setBatchAmount(5)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          +5% Shift
                        </button>
                        <button
                          onClick={() => setBatchAmount(10)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          +10% Rush Peak
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setBatchAmount(-10)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-mono text-emerald-400 cursor-pointer"
                        >
                          -₹10 Flat Off
                        </button>
                        <button
                          onClick={() => setBatchAmount(-5)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-mono text-emerald-400 cursor-pointer"
                        >
                          -₹5 Flat Off
                        </button>
                        <button
                          onClick={() => setBatchAmount(5)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          +₹5 Rate Shift
                        </button>
                        <button
                          onClick={() => setBatchAmount(10)}
                          className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded text-xs font-mono text-slate-300 cursor-pointer"
                        >
                          +₹10 Rate Shift
                        </button>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={batchAmount}
                      onChange={(e) => setBatchAmount(parseFloat(e.target.value) || 0)}
                      className="bg-[#0A0B0D] border border-white/10 rounded px-3 py-2 text-sm text-orange-400 font-mono w-32 focus:outline-none focus:border-orange-500"
                    />
                    <span className="text-xs text-slate-400">
                      {batchAdjType === 'percent'
                        ? `${batchAmount > 0 ? '+' : ''}${batchAmount}% to dishes`
                        : `${batchAmount > 0 ? '+' : ''}₹${batchAmount} per dish`}
                    </span>
                  </div>
                </div>

                {/* Apply Button */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <p className="text-xs text-slate-500">
                    Changes apply immediately to live client state.
                  </p>
                  <button
                    onClick={handleExecuteBatch}
                    className="px-5 py-2.5 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-medium flex items-center gap-2 shadow-lg shadow-orange-950/40 cursor-pointer transition-all"
                  >
                    <Zap className="w-4 h-4" />
                    Apply Batch Price Update
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Helper / Info Card */}
            <div className="space-y-4">
              <div className="bg-[#16191E] border border-white/5 rounded-lg p-5">
                <h3 className="text-sm font-serif italic text-white flex items-center gap-2 mb-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Peak Hour Dynamic Pricing
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  Campus meal times spike between 1:00 PM - 2:15 PM and 8:00 PM - 9:30 PM. Setting a -10% discount on slow-moving prep items shifts student traffic and avoids evening kitchen food waste.
                </p>
                <div className="p-3 bg-[#0E1014] rounded border border-white/5 text-[11px] text-slate-300">
                  <p className="font-semibold text-orange-400 mb-1">Student App Reaction:</p>
                  Lower prices immediately push your dishes to the top of the "Budget Saver" and "Rescue Radar" student picks.
                </div>
              </div>

              <div className="bg-[#16191E] border border-white/5 rounded-lg p-5">
                <h3 className="text-sm font-serif italic text-white flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Direct State Connection
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Budget-Bite operates with instant reactive context. All prices are verified across the React client tree without requiring server reloads or API delay.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SUB-VIEW 3: PRICE CHANGE AUDIT LOGS */}
        {activeSubTab === 'logs' && (
          <div className="bg-[#16191E] border border-white/5 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-4">
              <div>
                <h2 className="text-lg font-serif italic text-white">Price Change Audit Trail</h2>
                <p className="text-xs text-slate-400">
                  Complete history of price adjustments, new items, and discounts logged during this merchant session.
                </p>
              </div>
              {priceChangeLogs.length > 0 && (
                <button
                  onClick={clearPriceLogs}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-rose-400 border border-white/10 rounded transition-colors cursor-pointer"
                >
                  Clear History
                </button>
              )}
            </div>

            {priceChangeLogs.length === 0 ? (
              <div className="p-12 text-center text-slate-500">
                <History className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="text-sm">No price adjustments recorded yet.</p>
                <p className="text-xs text-slate-600 mt-1">
                  When you modify prices in the catalog or apply batch updates, records will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
                {priceChangeLogs.map((log) => (
                  <div key={log.id} className="py-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded bg-white/5 border border-white/10 flex items-center justify-center text-orange-400 font-mono font-bold">
                        ₹
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {log.dishName}{' '}
                          <span className="text-slate-400 font-normal">({log.vendor})</span>
                        </p>
                        <p className="text-[11px] text-slate-500">{log.note || 'Manual price edit'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {log.oldPrice > 0 ? (
                        <div className="text-right font-mono">
                          <span className="line-through text-slate-500 mr-2">₹{log.oldPrice}</span>
                          <span className="text-orange-400 font-bold">₹{log.newPrice}</span>
                        </div>
                      ) : (
                        <span className="text-emerald-400 font-mono font-bold">₹{log.newPrice}</span>
                      )}
                      <span className="text-[11px] text-slate-500 font-mono">{log.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD NEW MENU ITEM MODAL */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#16191E] border border-white/10 rounded-xl max-w-lg w-full p-6 shadow-2xl text-slate-200"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <h3 className="text-lg font-serif italic text-white">Add New Campus Dish</h3>
                  <p className="text-xs text-slate-400">
                    Publish a new item directly to student menus for{' '}
                    <span className="text-orange-400 font-semibold">{authenticatedRestaurant.restaurantName}</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-slate-400 hover:text-white text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateDish} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Dish Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Paneer Butter Masala Combo, Egg Fried Rice"
                    value={newDishData.name}
                    onChange={(e) => setNewDishData({ ...newDishData, name: e.target.value })}
                    className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Vendor Stall</label>
                    <input
                      type="text"
                      disabled={!isSuperAdmin}
                      value={isSuperAdmin ? newDishData.vendor : authenticatedRestaurant.restaurantName}
                      onChange={(e) => setNewDishData({ ...newDishData, vendor: e.target.value })}
                      className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 disabled:opacity-75"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Campus Zone</label>
                    <select
                      disabled={!isSuperAdmin}
                      value={isSuperAdmin ? newDishData.zone : authenticatedRestaurant.zone}
                      onChange={(e) =>
                        setNewDishData({ ...newDishData, zone: e.target.value as CampusZone })
                      }
                      className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-slate-300 focus:outline-none focus:border-orange-500 disabled:opacity-75"
                    >
                      {uniqueZones.filter((z) => z !== 'All').map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Regular Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={newDishData.price}
                      onChange={(e) =>
                        setNewDishData({ ...newDishData, price: parseFloat(e.target.value) || 0 })
                      }
                      className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-orange-400 font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">
                      Surplus Rescue Price (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={newDishData.rescuePrice}
                      onChange={(e) =>
                        setNewDishData({
                          ...newDishData,
                          rescuePrice: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Protein (g)</label>
                    <input
                      type="number"
                      min="0"
                      value={newDishData.protein}
                      onChange={(e) =>
                        setNewDishData({
                          ...newDishData,
                          protein: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      min="0"
                      value={newDishData.calories}
                      onChange={(e) =>
                        setNewDishData({
                          ...newDishData,
                          calories: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Prep Time (min)</label>
                    <input
                      type="number"
                      min="1"
                      value={newDishData.prepTime}
                      onChange={(e) =>
                        setNewDishData({
                          ...newDishData,
                          prepTime: parseFloat(e.target.value) || 1,
                        })
                      }
                      className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-white font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Dietary Type</label>
                    <select
                      value={newDishData.dietary}
                      onChange={(e) =>
                        setNewDishData({
                          ...newDishData,
                          dietary: e.target.value as 'veg' | 'non-veg' | 'vegan',
                        })
                      }
                      className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Packaging</label>
                    <select
                      value={newDishData.packaging}
                      onChange={(e) =>
                        setNewDishData({
                          ...newDishData,
                          packaging: e.target.value as 'compostable' | 'recyclable' | 'standard',
                        })
                      }
                      className="w-full bg-[#0E1014] border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="compostable">Compostable Box</option>
                      <option value="recyclable">Recyclable</option>
                      <option value="standard">Standard</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded text-xs transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded text-xs font-medium shadow-lg shadow-orange-950/40 cursor-pointer transition-colors"
                  >
                    Add to Live Menu
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SellerRetailerPortal;
