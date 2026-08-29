import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import {
  NavTab,
  EventType,
  StudentIntention,
  RescueOffer,
  ZoneIntelligence,
  CampusImpactSummary,
  PersonalImpact,
  WalletState,
  Constraints,
} from '../types';
import {
  CAMPUS_ZONES_LIST,
  INITIAL_RESCUE_OFFERS,
  CAMPUS_IMPACT_DEFAULT,
  PERSONAL_IMPACT_DEFAULT,
} from '../data/mockData';

interface AppContextType {
  // Authentication
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string, name?: string) => boolean;
  logout: () => void;

  // Navigation
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Simulator & Intentions
  currentEvent: EventType;
  setCurrentEvent: (event: EventType) => void;
  studentIntention: StudentIntention;
  submitStudentIntention: (intent: 'mess' | 'outside' | 'unsure') => void;
  intentionCounts: {
    totalHostel: number;
    confirmedMess: number;
    confirmedOutside: number;
    unsure: number;
  };

  // Forecast Metrics
  demandForecast: {
    historicalExpected: number;
    aiPredicted: number;
    confidence: number;
    recommendedPrep: number;
    overproductionAvoidedPortions: number;
    foodSavedKg: number;
    eventAdjustmentNote: string;
  };

  // Campus Zones Intelligence (reactive to events)
  zones: ZoneIntelligence[];

  // Rescue Radar
  rescueOffers: RescueOffer[];
  claimRescueMeal: (offerId: string) => { success: boolean; message: string; savedInr: number; price: number };
  addRescueDrop: (offer: Omit<RescueOffer, 'id' | 'status'>) => void;
  isRescueModalOpen: boolean;
  setIsRescueModalOpen: (open: boolean) => void;

  // Live Surplus Monitor
  liveSurplusItem: {
    name: string;
    prepared: number;
    sold: number;
    remaining: number;
    expectedDiners: number;
    predictedSurplus: number;
    status: 'HIGH SURPLUS RISK' | 'OPTIMAL' | 'CRITICAL';
    timeString: string;
  };

  // Student State
  wallet: WalletState;
  addWalletBalance: (amount: number) => void;
  proteinAchieved: number;
  constraints: Constraints;
  setConstraints: React.Dispatch<React.SetStateAction<Constraints>>;
  logMealToWallet: (price: number, protein: number) => void;
  toggleMessPlan: () => void;

  // Impact Dashboard
  campusImpact: CampusImpactSummary;
  personalImpact: PersonalImpact;

  // Notification Toast
  toast: { message: string; type: 'success' | 'alert' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'alert' | 'info') => void;

  // Interactive Review-1 Guided Demo Runner
  isDemoRunning: boolean;
  demoStep: number;
  startDemo: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  exitDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ name: string; email: string } | null>(() => {
    if (typeof window === 'undefined') return null;
    const stored = window.localStorage.getItem('budget-bite-user');
    return stored ? JSON.parse(stored) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => Boolean(
    typeof window !== 'undefined' && window.localStorage.getItem('budget-bite-user')
  ));
  const [activeTab, setActiveTab] = useState<NavTab>('biteloop');
  const [currentEvent, setCurrentEvent] = useState<EventType>('normal');
  const [studentIntention, setStudentIntention] = useState<StudentIntention>(null);
  const [intentionCounts, setIntentionCounts] = useState({
    totalHostel: 1200,
    confirmedMess: 542,
    confirmedOutside: 183,
    unsure: 116,
  });

  const [rescueOffers, setRescueOffers] = useState<RescueOffer[]>(INITIAL_RESCUE_OFFERS);
  const [isRescueModalOpen, setIsRescueModalOpen] = useState(false);

  const [wallet, setWallet] = useState<WalletState>({
    daily: 250,
    spent: 65,
    hasPrepaidMess: true,
  });
  const [proteinAchieved, setProteinAchieved] = useState(32);
  const [constraints, setConstraints] = useState<Constraints>({
    budget: 120,
    protein: 30,
    dietary: 'all',
    zone: 'FC Restaurant',
  });

  const [campusImpact, setCampusImpact] = useState<CampusImpactSummary>(CAMPUS_IMPACT_DEFAULT);
  const [personalImpact, setPersonalImpact] = useState<PersonalImpact>(PERSONAL_IMPACT_DEFAULT);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'alert' | 'info' } | null>(null);

  // Demo state
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoStep, setDemoStep] = useState(1);

  const showToast = useCallback((message: string, type: 'success' | 'alert' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const login = useCallback((email: string, password: string, name?: string) => {
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();
    if (!cleanEmail || !cleanPassword) return false;

    const nextUser = {
      name: name?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
    };

    setUser(nextUser);
    setIsAuthenticated(true);
    window.localStorage.setItem('budget-bite-user', JSON.stringify(nextUser));
    showToast('✓ Logged in successfully. Welcome back to Budget-Bite.', 'success');
    return true;
  }, [showToast]);

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    window.localStorage.removeItem('budget-bite-user');
    showToast('✓ Logged out successfully.', 'info');
  }, [showToast]);

  // Student intention vote action
  const submitStudentIntention = useCallback((intent: 'mess' | 'outside' | 'unsure') => {
    setStudentIntention(intent);
    setIntentionCounts((prev) => {
      if (intent === 'mess') return { ...prev, confirmedMess: prev.confirmedMess + 1 };
      if (intent === 'outside') return { ...prev, confirmedOutside: prev.confirmedOutside + 1 };
      return { ...prev, unsure: prev.unsure + 1 };
    });
    showToast(
      intent === 'mess'
        ? '✓ Marked Eating at Mess. Kitchen notified!'
        : intent === 'outside'
        ? '✓ Marked Eating Outside. Mess preparation adjusted!'
        : '✓ Marked Unsure. AI will reserve safety margin.',
      'success'
    );
  }, [showToast]);

  // Dynamic Demand Forecast derived from active event & student responses
  const demandForecast = useMemo(() => {
    let baseHistorical = 790;
    let predicted = 748;
    let confidence = 89;
    let recommended = 765;
    let avoidedPortions = 125;
    let foodSavedKg = 42;
    let note = 'Normal weekday campus schedule with Friday dining adjustments.';

    if (currentEvent === 'gravitas') {
      predicted = 612;
      confidence = 94;
      recommended = 625;
      avoidedPortions = 165;
      foodSavedKg = 58;
      note = 'Gravitas Tech Concert tonight: Large shift to Food Court & outdoor stalls.';
    } else if (currentEvent === 'exam') {
      predicted = 860;
      confidence = 92;
      recommended = 875;
      avoidedPortions = 45;
      foodSavedKg = 15;
      note = 'Exam Night: Heavy hostel mess turnout + late-night study rush at Night Stalls.';
    } else if (currentEvent === 'weekend') {
      predicted = 580;
      confidence = 91;
      recommended = 595;
      avoidedPortions = 195;
      foodSavedKg = 64;
      note = 'Weekend: Over 35% students traveling home or dining in town.';
    } else if (currentEvent === 'sports') {
      predicted = 780;
      confidence = 88;
      recommended = 795;
      avoidedPortions = 95;
      foodSavedKg = 31;
      note = 'Inter-University Sports Meet: High protein demand surge across campus.';
    } else if (currentEvent === 'holiday') {
      predicted = 390;
      confidence = 95;
      recommended = 410;
      avoidedPortions = 380;
      foodSavedKg = 126;
      note = 'Campus Holiday: Severe low occupancy; mess operations consolidated.';
    }

    // Adjust for student intention responses
    if (studentIntention === 'outside') {
      predicted = Math.max(predicted - 3, 200);
      confidence = Math.min(confidence + 1, 99);
    } else if (studentIntention === 'mess') {
      predicted = predicted + 2;
      confidence = Math.min(confidence + 1, 99);
    }

    return {
      historicalExpected: baseHistorical,
      aiPredicted: predicted,
      confidence,
      recommendedPrep: recommended,
      overproductionAvoidedPortions: avoidedPortions,
      foodSavedKg,
      eventAdjustmentNote: note,
    };
  }, [currentEvent, studentIntention]);

  // Zone intelligence dynamically tuned to current event
  const zones: ZoneIntelligence[] = useMemo(() => {
    return CAMPUS_ZONES_LIST.map((zone) => {
      let multiplier = 1;
      let crowd = zone.currentCrowd;
      let crowdIndex = zone.crowdIndex;
      let surplus = zone.surplusRisk;

      if (currentEvent === 'gravitas') {
        if (zone.zone === 'GN Naidu Canteen') {
          multiplier = 0.77;
          crowd = 'Low';
          crowdIndex = 35;
          surplus = 'critical';
        } else if (zone.zone === 'Food Park') {
          multiplier = 1.85;
          crowd = 'Surging';
          crowdIndex = 95;
          surplus = 'low';
        } else if (zone.zone === 'L Block Food Mall') {
          multiplier = 1.9;
          crowd = 'Surging';
          crowdIndex = 92;
          surplus = 'low';
        } else if (zone.zone === 'FC Restaurant') {
          multiplier = 1.25;
          crowd = 'High';
          crowdIndex = 79;
          surplus = 'medium';
        }
      } else if (currentEvent === 'exam') {
        if (zone.zone === 'GN Naidu Canteen') {
          multiplier = 1.15;
          crowd = 'High';
          crowdIndex = 88;
          surplus = 'low';
        } else if (zone.zone === 'L Block Food Mall') {
          multiplier = 1.6;
          crowd = 'Surging';
          crowdIndex = 94;
          surplus = 'low';
        }
      }

      const predicted = Math.round(zone.baseDemand * multiplier);

      return {
        ...zone,
        predictedDemand: predicted,
        currentCrowd: crowd,
        crowdIndex,
        surplusRisk: surplus,
      };
    });
  }, [currentEvent]);

  // Live surplus monitor state
  const liveSurplusItem = useMemo(() => {
    const isGravitas = currentEvent === 'gravitas';
    const remaining = 59;
    const expected = isGravitas ? 18 : 32;
    const surplus = remaining - expected;

    return {
      name: 'Paneer Butter Rice',
      prepared: 210,
      sold: 151,
      remaining,
      expectedDiners: expected,
      predictedSurplus: surplus,
      status: surplus > 20 ? ('HIGH SURPLUS RISK' as const) : ('OPTIMAL' as const),
      timeString: '8:12 PM',
    };
  }, [currentEvent]);

  // Claim a rescue meal
  const claimRescueMeal = useCallback((offerId: string) => {
    const target = rescueOffers.find((o) => o.id === offerId);
    if (!target || target.mealsLeft <= 0) {
      return { success: false, message: 'Meal no longer available', savedInr: 0, price: 0 };
    }

    const saved = target.originalPrice - target.rescuePrice;

    // Decrement inventory
    setRescueOffers((prev) =>
      prev.map((o) =>
        o.id === offerId
          ? {
              ...o,
              mealsLeft: o.mealsLeft - 1,
              status: o.mealsLeft - 1 === 0 ? 'claimed_out' : o.status,
            }
          : o
      )
    );

    // Update wallet
    setWallet((prev) => ({
      ...prev,
      spent: Math.min(prev.spent + target.rescuePrice, prev.daily),
    }));
    setProteinAchieved((prev) => prev + target.proteinGrams);

    // Update impact metrics
    setCampusImpact((prev) => ({
      ...prev,
      today: {
        ...prev.today,
        mealsRescued: prev.today.mealsRescued + 1,
        vendorValueRecoveredInr: prev.today.vendorValueRecoveredInr + target.rescuePrice,
        mealsRedirected: prev.today.mealsRedirected + 1,
        co2eAvoidedKg: prev.today.co2eAvoidedKg + 1.2,
      },
    }));

    setPersonalImpact((prev) => ({
      ...prev,
      mealsRescued: prev.mealsRescued + 1,
      moneySavedInr: prev.moneySavedInr + saved,
      reusableEcoChoices: prev.reusableEcoChoices + 1,
      co2PreventedKg: +(prev.co2PreventedKg + 1.2).toFixed(1),
    }));

    showToast(
      `🎉 You rescued 1 ${target.dishName}! Saved ₹${saved} and prevented food waste.`,
      'success'
    );

    return {
      success: true,
      message: `Rescued ${target.dishName}`,
      savedInr: saved,
      price: target.rescuePrice,
    };
  }, [rescueOffers, showToast]);

  // Add new rescue drop from Vendor
  const addRescueDrop = useCallback((offer: Omit<RescueOffer, 'id' | 'status'>) => {
    const newOffer: RescueOffer = {
      ...offer,
      id: `rescue-${Date.now()}`,
      status: 'active',
    };
    setRescueOffers((prev) => [newOffer, ...prev]);
    showToast(`🚀 Rescue Drop activated! ${offer.mealsLeft} nearby students notified via push alerts.`, 'success');
  }, [showToast]);

  const addWalletBalance = useCallback((amount: number) => {
    const nextTopUp = Number(amount);

    if (!Number.isFinite(nextTopUp) || nextTopUp <= 0) {
      showToast('Enter a valid amount greater than ₹0.', 'alert');
      return;
    }

    setWallet((prev) => ({
      ...prev,
      daily: prev.daily + nextTopUp,
      spent: Math.min(prev.spent, prev.daily + nextTopUp),
    }));

    showToast(`₹${nextTopUp} added to your wallet. You can keep ordering without interruption.`, 'success');
  }, [showToast]);

  const logMealToWallet = useCallback((price: number, protein: number) => {
    setWallet((prev) => ({
      ...prev,
      spent: Math.min(prev.spent + price, prev.daily),
    }));
    setProteinAchieved((prev) => prev + protein);
    showToast(`✓ Meal logged: ₹${price} added to daily spending.`, 'info');
  }, [showToast]);

  const toggleMessPlan = useCallback(() => {
    setWallet((prev) => {
      const next = !prev.hasPrepaidMess;
      showToast(next ? 'Hostel Mess prepaid plan enabled (₹0 additional spend)' : 'Mess prepaid plan disabled', 'info');
      return { ...prev, hasPrepaidMess: next };
    });
  }, [showToast]);

  // ── Guided Demo Flow (7 Steps) ──────────────────────────────
  const startDemo = useCallback(() => {
    setIsDemoRunning(true);
    setDemoStep(1);
    setCurrentEvent('normal');
    setActiveTab('biteloop');
    showToast('🎬 Review 1 Demo Scenario started. Step 1: Baseline demand view.', 'info');
  }, [showToast]);

  const nextDemoStep = useCallback(() => {
    setDemoStep((prev) => {
      const next = prev + 1;
      if (next === 2) {
        setCurrentEvent('gravitas');
        setActiveTab('biteloop');
        showToast('Step 2: Gravitas Concert activated. AI recalculates hostel demand 790 → 612.', 'alert');
      } else if (next === 3) {
        setActiveTab('kitchen-command');
        showToast('Step 3: Kitchen preparation recommendation auto-adjusted. 125+ overproduction avoided.', 'info');
      } else if (next === 4) {
        setActiveTab('kitchen-command');
        showToast('Step 4: Fast-forward to 8:12 PM. 27 surplus Paneer Rice detected by Live Monitor.', 'alert');
      } else if (next === 5) {
        setIsRescueModalOpen(true);
        showToast('Step 5: Vendor triggers Rescue Drop (₹90 → ₹42). 21 students alerted.', 'success');
      } else if (next === 6) {
        setIsRescueModalOpen(false);
        setActiveTab('rescue-radar');
        showToast('Step 6: Student views Rescue Radar and claims discounted hot meal.', 'info');
      } else if (next === 7) {
        // Claim the top meal
        if (rescueOffers.length > 0) {
          claimRescueMeal(rescueOffers[0].id);
        }
        setActiveTab('sustainability');
        showToast('Step 7: Campus & Personal Impact dashboard updated in real-time!', 'success');
      } else if (next > 7) {
        setIsDemoRunning(false);
        showToast('🎉 Demo Scenario completed successfully!', 'success');
        return 1;
      }
      return next;
    });
  }, [rescueOffers, claimRescueMeal, showToast]);

  const prevDemoStep = useCallback(() => {
    setDemoStep((prev) => Math.max(1, prev - 1));
  }, []);

  const exitDemo = useCallback(() => {
    setIsDemoRunning(false);
    setDemoStep(1);
    setIsRescueModalOpen(false);
    showToast('Exited Demo Scenario.', 'info');
  }, [showToast]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        activeTab,
        setActiveTab,
        currentEvent,
        setCurrentEvent,
        studentIntention,
        submitStudentIntention,
        intentionCounts,
        demandForecast,
        zones,
        rescueOffers,
        claimRescueMeal,
        addRescueDrop,
        isRescueModalOpen,
        setIsRescueModalOpen,
        liveSurplusItem,
        wallet,
        addWalletBalance,
        proteinAchieved,
        constraints,
        setConstraints,
        logMealToWallet,
        toggleMessPlan,
        campusImpact,
        personalImpact,
        toast,
        showToast,
        isDemoRunning,
        demoStep,
        startDemo,
        nextDemoStep,
        prevDemoStep,
        exitDemo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
