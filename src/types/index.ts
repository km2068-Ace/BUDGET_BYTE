export type DietaryType = 'veg' | 'non-veg' | 'all';

export type CampusZone =
  | 'FC Restaurant'
  | 'Food Park'
  | 'L Block Food Mall'
  | 'One Food'
  | 'GN Naidu Canteen'
  | 'Domino\'s'
  | 'Central Canteen'
  | 'Hostel Mess Area'
  | 'Night Stalls'
  | 'Academic Complex'
  | 'Food Court';

export type EventType =
  | 'normal'
  | 'gravitas'
  | 'exam'
  | 'weekend'
  | 'sports'
  | 'holiday';

export type StudentIntention = 'mess' | 'outside' | 'unsure' | null;

export type NavTab =
  | 'biteloop'
  | 'digital-twin'
  | 'rescue-radar'
  | 'kitchen-command'
  | 'smart-meal'
  | 'sustainability';

export type SurplusRiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface VerificationBadge {
  text: string;
  type: 'verified' | 'ai-forecast' | 'estimated' | 'real-time';
  timeAgo?: string;
  confidence?: number;
}

export interface Dish {
  id: string;
  name: string;
  vendor: string;
  zone: CampusZone;
  price: number;
  protein: number;
  calories: number;
  prepTime: number; // minutes
  dietary: 'veg' | 'non-veg';
  tags: string[];
  rating: number;
  currentStock: number;
  predictedDemand: number;
  surplusRisk: SurplusRiskLevel;
  rescueEligible: boolean;
  rescuePrice?: number;
  verificationStatus: VerificationBadge;
  image?: string;
}

export interface MealCombo {
  dishes: Dish[];
  totalPrice: number;
  totalProtein: number;
  totalCalories: number;
  maxWaitTime: number;
  reasoning: string;
  isRescueCombo?: boolean;
  isMessZeroSpend?: boolean;
  scores?: {
    budgetFit: number;
    nutritionFit: number;
    timeFit: number;
    sustainabilityFit: number;
    overallFit: number;
  };
}

export type ProposalType = 'protein' | 'speed' | 'budget' | 'rescue' | 'mess-zero';

export interface MealProposal {
  type: ProposalType;
  label: string;
  combo: MealCombo;
  badge?: string;
}

export interface WalletState {
  daily: number;
  spent: number;
  hasPrepaidMess: boolean;
}

export interface Constraints {
  budget: number;
  protein: number;
  dietary: DietaryType;
  zone: CampusZone;
}

export interface RescueOffer {
  id: string;
  dishId: string;
  dishName: string;
  vendorName: string;
  zone: CampusZone;
  originalPrice: number;
  rescuePrice: number;
  mealsLeft: number;
  totalInitialMeals: number;
  pickupDeadline: string;
  distanceMeters: number;
  proteinGrams: number;
  calories: number;
  dietary: 'veg' | 'non-veg';
  reason: string;
  status: 'active' | 'expiring' | 'claimed_out';
  confidence: number;
}

export interface ZoneIntelligence {
  zone: CampusZone;
  displayName?: string;
  shortName: string;
  location?: string;
  coordinates: { x: number; y: number; lat?: number; lng?: number }; // percentage on map + optional real-world coordinates
  currentCrowd: 'Low' | 'Moderate' | 'High' | 'Surging';
  crowdIndex: number; // 0-100
  predictedDemand: number;
  baseDemand: number;
  avgWaitTimeMin: number;
  surplusRisk: SurplusRiskLevel;
  activeRescueMeals: number;
  popularItems: string[];
  kitchenStatus: 'Optimal' | 'Overproducing Risk' | 'High Demand' | 'Closing Soon';
  trend: 'up' | 'down' | 'stable';
}

export interface DishPrepItem {
  id: string;
  name: string;
  category: string;
  vendor: string;
  normalQuantity: number;
  recommendedQuantity: number;
  currentCooked: number;
  unit: string;
  changePercent: number;
  status: 'optimized' | 'caution' | 'surge';
  wastageAvoidedPortions: number;
  wastageAvoidedKg: number;
}

export interface DemandHistoryDay {
  day: string;
  date: string;
  historicalExpected: number;
  aiPredicted: number;
  actualPrepared: number;
  actualConsumed: number;
  wasteAvoidedKg: number;
  accuracyPercent: number;
}

export interface ForecastFactor {
  id: string;
  title: string;
  category: 'calendar' | 'event' | 'sentiment' | 'behavior' | 'weather';
  impactPercent: number;
  impactType: 'positive' | 'negative' | 'neutral';
  description: string;
  iconName: string;
  confidence: number;
}

export interface PersonalImpact {
  mealsRescued: number;
  moneySavedInr: number;
  reusableEcoChoices: number;
  co2PreventedKg: number;
  campusPercentile: number;
}

export interface CampusImpactSummary {
  today: {
    foodAvoidedKg: number;
    mealsRescued: number;
    vendorValueRecoveredInr: number;
    mealsRedirected: number;
    forecastAccuracy: number;
    co2eAvoidedKg: number;
  };
  month: {
    foodSavedKg: number;
    rescueMeals: number;
    studentSavingsInr: number;
    vendorRecoveryInr: number;
    landfillDivertedKg: number;
  };
}

export interface DemoStep {
  stepNumber: number;
  title: string;
  subtitle: string;
  actionDescription: string;
  targetTab: NavTab;
  highlightCardId?: string;
  aiNarrative: string;
}
