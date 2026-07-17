// ---- Form input types ----

export type RoofType = "Concrete" | "Metal" | "Tile" | "Other";
export type RoofDirection = "North" | "South" | "East" | "West" | "South-East" | "South-West";
export type ShadingLevel = "None" | "Light" | "Medium" | "Heavy";
export type PropertyType = "Residential" | "Commercial";
export type BudgetTier = "Low" | "Medium" | "High";
export type InverterType = "On-Grid" | "Hybrid" | "Off-Grid";

export interface LocationData {
  country: string;
  state: string;
  city: string;
}

export interface ElectricityData {
  monthlyBill: number;
  monthlyUnits: number;
  provider?: string;
}

export interface RoofData {
  roofArea: number; // sq ft
  roofType: RoofType;
  roofDirection: RoofDirection;
  roofTilt?: number; // degrees
  shading: ShadingLevel;
}

export interface RequirementsData {
  propertyType: PropertyType;
  batteryRequired: boolean;
  backupRequired: boolean;
  budget: BudgetTier;
  budgetAmount?: number; // exact budget in PKR, optional — caps system size if provided
}

export interface SolarFormData {
  location: LocationData;
  electricity: ElectricityData;
  roof: RoofData;
  requirements: RequirementsData;
}

// ---- Result types ----

export interface SuitabilityResult {
  score: number; // 0-100
  label: string; // e.g. "Excellent"
}

export interface SystemSizeResult {
  systemSizeKw: number;
  budgetLimited: boolean;
  maxAffordableKw?: number;
}

export interface PanelResult {
  panelCount: number;
  panelWattage: number;
  roofSpaceRequiredSqFt: number;
}

export interface InverterResult {
  sizeKw: number;
  type: InverterType;
  explanation: string;
}

export interface BatteryResult {
  needed: boolean;
  capacityKwh?: number;
  explanation: string;
}

export interface ProductionResult {
  dailyKwh: number;
  monthlyKwh: number;
  annualKwh: number;
  monthlyChart: { month: string; kwh: number }[];
}

export interface SavingsResult {
  currentMonthlyBill: number;
  estimatedMonthlyBillAfterSolar: number;
  monthlySavings: number;
  annualSavings: number;
  twentyFiveYearSavings: number;
  yearlyChart: { year: number; cumulativeSavings: number }[];
}

export interface RoiResult {
  systemCost: number;
  paybackPeriodYears: number;
  lifetimeProfit: number;
}

export interface SolarAnalysisResult {
  suitability: SuitabilityResult;
  systemSize: SystemSizeResult;
  panels: PanelResult;
  inverter: InverterResult;
  battery: BatteryResult;
  production: ProductionResult;
  savings: SavingsResult;
  roi: RoiResult;
  recommendation: string;
}
