import type {
  SolarFormData,
  SolarAnalysisResult,
  SuitabilityResult,
  SystemSizeResult,
  PanelResult,
  InverterResult,
  BatteryResult,
  ProductionResult,
  SavingsResult,
  RoiResult,
  ShadingLevel,
  RoofDirection,
} from "../types";

// ---------------------------------------------------------------------------
// CONSTANTS — tweak these to recalibrate the whole engine.
// ---------------------------------------------------------------------------

const PEAK_SUN_HOURS = 4.8; // average usable sun hours/day, generic mid-latitude estimate
const PANEL_WATTAGE = 550; // W, TOPCon panel default
const PANEL_AREA_SQFT = 19; // approx sq ft per 550W panel incl. spacing
const SYSTEM_DERATE = 0.8; // inverter + wiring + soiling losses
const COST_PER_KW = 150000; // PKR per kW installed (panels + inverter + labor, generic Pakistan benchmark)
const BATTERY_COST_PER_KWH = 90000; // PKR per kWh of lithium battery storage
const DEGRADATION_RATE = 0.006; // 0.6%/year panel output degradation
const ELECTRICITY_TARIFF_ESCALATION = 0.04; // 4%/year utility price inflation
const DOD = 0.9; // battery depth of discharge
const BACKUP_HOURS_TARGET = 6; // hours of backup the battery should cover

const SHADING_FACTOR: Record<ShadingLevel, number> = {
  None: 1.0,
  Light: 0.92,
  Medium: 0.8,
  Heavy: 0.6,
};

const DIRECTION_FACTOR: Record<RoofDirection, number> = {
  South: 1.0,
  "South-East": 0.96,
  "South-West": 0.96,
  East: 0.88,
  West: 0.88,
  North: 0.75,
};

// ---------------------------------------------------------------------------
// Individual calculation steps
// ---------------------------------------------------------------------------

function calculateSystemSize(data: SolarFormData): SystemSizeResult {
  const { monthlyUnits } = data.electricity;
  const dailyUnits = monthlyUnits / 30;
  const shadingF = SHADING_FACTOR[data.roof.shading];
  const directionF = DIRECTION_FACTOR[data.roof.roofDirection];

  const rawSizeKw =
    dailyUnits / (PEAK_SUN_HOURS * SYSTEM_DERATE * shadingF * directionF);

  // Clamp to sane residential/commercial bounds and round to nearest 0.5kW
  const bounded = Math.max(1, Math.min(rawSizeKw, data.requirements.propertyType === "Commercial" ? 500 : 20));
  const usageBasedKw = Math.round(bounded * 2) / 2;

  // If the user gave an exact PKR budget, cap the system to what that budget affords.
  const { budgetAmount, batteryRequired } = data.requirements;
  if (budgetAmount && budgetAmount > 0) {
    // Reserve a slice of the budget for battery cost if one is required, so the
    // panel/inverter portion doesn't consume the entire budget.
    const reservedForBattery = batteryRequired ? Math.min(budgetAmount * 0.35, budgetAmount) : 0;
    const availableForPanels = Math.max(0, budgetAmount - reservedForBattery);
    const maxAffordableKwRaw = availableForPanels / COST_PER_KW;
    const maxAffordableKw = Math.max(0.5, Math.round(maxAffordableKwRaw * 2) / 2);

    if (maxAffordableKw < usageBasedKw) {
      return { systemSizeKw: maxAffordableKw, budgetLimited: true, maxAffordableKw };
    }
    return { systemSizeKw: usageBasedKw, budgetLimited: false, maxAffordableKw };
  }

  return { systemSizeKw: usageBasedKw, budgetLimited: false };
}

function calculatePanels(systemSizeKw: number): PanelResult {
  const panelCount = Math.max(1, Math.ceil((systemSizeKw * 1000) / PANEL_WATTAGE));
  const roofSpaceRequiredSqFt = panelCount * PANEL_AREA_SQFT;
  return { panelCount, panelWattage: PANEL_WATTAGE, roofSpaceRequiredSqFt };
}

function calculateInverter(data: SolarFormData, systemSizeKw: number): InverterResult {
  const sizeKw = Math.round(systemSizeKw * 0.9 * 10) / 10; // inverters slightly undersized vs array

  if (data.requirements.batteryRequired) {
    return {
      sizeKw,
      type: "Hybrid",
      explanation:
        "A hybrid inverter is recommended because you selected battery backup. It can manage solar generation, battery charging/discharging, and grid import/export from a single unit.",
    };
  }

  if (data.requirements.backupRequired) {
    return {
      sizeKw,
      type: "On-Grid",
      explanation:
        "An on-grid inverter is recommended for your setup. Since full backup without a battery has limited standalone runtime, we suggest adding a small battery later if uninterrupted backup becomes a priority.",
    };
  }

  return {
    sizeKw,
    type: "On-Grid",
    explanation:
      "A standard on-grid (grid-tied) inverter is recommended since you don't require battery backup. This is the most cost-effective option and feeds any excess energy back to the utility grid.",
  };
}

function calculateBattery(data: SolarFormData): BatteryResult {
  if (!data.requirements.batteryRequired) {
    return {
      needed: false,
      explanation:
        "A battery isn't included in this recommendation since you indicated backup power isn't a priority. This keeps your upfront cost lower while still delivering full daytime solar savings.",
    };
  }

  const dailyLoadKwh = data.electricity.monthlyUnits / 30;
  const hourlyLoad = dailyLoadKwh / 24;
  const rawCapacity = (hourlyLoad * BACKUP_HOURS_TARGET) / DOD;
  const capacityKwh = Math.max(2.4, Math.round(rawCapacity * 2) / 2);

  return {
    needed: true,
    capacityKwh,
    explanation: `A ${capacityKwh} kWh battery is recommended to give you roughly ${BACKUP_HOURS_TARGET} hours of backup power for essential loads during a grid outage, sized to your average consumption.`,
  };
}

function calculateProduction(systemSizeKw: number, data: SolarFormData): ProductionResult {
  const shadingF = SHADING_FACTOR[data.roof.shading];
  const directionF = DIRECTION_FACTOR[data.roof.roofDirection];

  const dailyKwh = systemSizeKw * PEAK_SUN_HOURS * SYSTEM_DERATE * shadingF * directionF;
  const monthlyKwh = dailyKwh * 30;
  const annualKwh = dailyKwh * 365;

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Slight seasonal variation curve (summer peak) purely for visual realism
  const seasonalMultipliers = [0.85, 0.9, 1.0, 1.05, 1.15, 1.2, 1.15, 1.1, 1.0, 0.92, 0.83, 0.8];
  const monthlyChart = monthNames.map((month, i) => ({
    month,
    kwh: Math.round(monthlyKwh * seasonalMultipliers[i]),
  }));

  return {
    dailyKwh: Math.round(dailyKwh * 10) / 10,
    monthlyKwh: Math.round(monthlyKwh),
    annualKwh: Math.round(annualKwh),
    monthlyChart,
  };
}

function calculateSavings(data: SolarFormData, production: ProductionResult): SavingsResult {
  const currentMonthlyBill = data.electricity.monthlyBill;
  const unitRate = currentMonthlyBill / Math.max(1, data.electricity.monthlyUnits);

  // Assume solar offsets production 1:1 against usage, capped at ~95% bill offset
  const unitsOffsetMonthly = Math.min(production.monthlyKwh, data.electricity.monthlyUnits * 0.95);
  const monthlySavings = unitsOffsetMonthly * unitRate;
  const estimatedMonthlyBillAfterSolar = Math.max(0, currentMonthlyBill - monthlySavings);
  const annualSavings = monthlySavings * 12;

  let cumulative = 0;
  const yearlyChart: { year: number; cumulativeSavings: number }[] = [];
  for (let year = 1; year <= 25; year++) {
    const degradation = Math.pow(1 - DEGRADATION_RATE, year - 1);
    const tariffGrowth = Math.pow(1 + ELECTRICITY_TARIFF_ESCALATION, year - 1);
    const yearSavings = annualSavings * degradation * tariffGrowth;
    cumulative += yearSavings;
    yearlyChart.push({ year, cumulativeSavings: Math.round(cumulative) });
  }

  return {
    currentMonthlyBill: Math.round(currentMonthlyBill),
    estimatedMonthlyBillAfterSolar: Math.round(estimatedMonthlyBillAfterSolar),
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
    twentyFiveYearSavings: Math.round(cumulative),
    yearlyChart,
  };
}

function calculateRoi(
  systemSizeKw: number,
  battery: BatteryResult,
  savings: SavingsResult
): RoiResult {
  const panelSystemCost = systemSizeKw * COST_PER_KW;
  const batteryCost = battery.needed && battery.capacityKwh ? battery.capacityKwh * BATTERY_COST_PER_KWH : 0;
  const systemCost = Math.round(panelSystemCost + batteryCost);

  const paybackPeriodYears =
    savings.annualSavings > 0 ? Math.round((systemCost / savings.annualSavings) * 10) / 10 : 0;

  const lifetimeProfit = Math.round(savings.twentyFiveYearSavings - systemCost);

  return { systemCost, paybackPeriodYears, lifetimeProfit };
}

function calculateSuitability(data: SolarFormData, panels: PanelResult): SuitabilityResult {
  let score = 100;

  // Roof space adequacy
  if (data.roof.roofArea < panels.roofSpaceRequiredSqFt) {
    const deficit = 1 - data.roof.roofArea / panels.roofSpaceRequiredSqFt;
    score -= Math.min(30, deficit * 60);
  }

  // Shading
  const shadingPenalty: Record<ShadingLevel, number> = { None: 0, Light: 5, Medium: 15, Heavy: 30 };
  score -= shadingPenalty[data.roof.shading];

  // Direction
  const directionPenalty: Record<RoofDirection, number> = {
    South: 0,
    "South-East": 2,
    "South-West": 2,
    East: 8,
    West: 8,
    North: 18,
  };
  score -= directionPenalty[data.roof.roofDirection];

  // Budget fit (Low budget + large recommended system = friction)
  if (data.requirements.budget === "Low") score -= 5;

  score = Math.max(10, Math.min(100, Math.round(score)));

  let label = "Fair";
  if (score >= 90) label = "Excellent";
  else if (score >= 75) label = "Very Good";
  else if (score >= 60) label = "Good";
  else if (score >= 40) label = "Fair";
  else label = "Limited";

  return { score, label };
}

function generateRecommendation(
  data: SolarFormData,
  systemSize: SystemSizeResult,
  panels: PanelResult,
  inverter: InverterResult,
  battery: BatteryResult
): string {
  const parts: string[] = [];

  parts.push(
    `Based on your monthly electricity usage of ${data.electricity.monthlyUnits} units and your roof's conditions, a ${systemSize.systemSizeKw} kW solar system is recommended.`
  );

  parts.push(
    `This translates to approximately ${panels.panelCount} × ${panels.panelWattage}W solar panels, requiring around ${panels.roofSpaceRequiredSqFt} sq ft of roof space.`
  );

  parts.push(
    `A ${inverter.type.toLowerCase()} inverter is advised${data.requirements.batteryRequired ? " because you selected battery backup" : ""}.`
  );

  if (data.roof.shading === "None" || data.roof.shading === "Light") {
    parts.push(`Your roof facing ${data.roof.roofDirection} has good solar exposure with minimal shading losses.`);
  } else {
    parts.push(
      `Your roof faces ${data.roof.roofDirection} with ${data.roof.shading.toLowerCase()} shading, which has been factored into a slightly larger system size to compensate for reduced output.`
    );
  }

  if (battery.needed) {
    parts.push(`A ${battery.capacityKwh} kWh battery is included to support your backup requirements.`);
  } else {
    parts.push("No battery is included, keeping your investment focused on maximizing daytime bill savings.");
  }

  if (data.requirements.budget === "Low") {
    parts.push(
      "Given your budget preference, consider a phased installation, starting with the core array and adding battery storage later."
    );
  }

  if (systemSize.budgetLimited && data.requirements.budgetAmount) {
    parts.push(
      `Note: your stated budget of Rs ${data.requirements.budgetAmount.toLocaleString()} covers approximately a ${systemSize.systemSizeKw} kW system (${panels.panelCount} panels). This is smaller than the ${
        "ideal"
      } system your usage would call for, so expect a lower bill offset than a fully-sized system would provide — you can always expand the array later.`
    );
  }

  return parts.join(" ");
}

// ---------------------------------------------------------------------------
// Public entry point
// ---------------------------------------------------------------------------

export function analyzeSolarSystem(data: SolarFormData): SolarAnalysisResult {
  const systemSize = calculateSystemSize(data);
  const panels = calculatePanels(systemSize.systemSizeKw);
  const inverter = calculateInverter(data, systemSize.systemSizeKw);
  const battery = calculateBattery(data);
  const production = calculateProduction(systemSize.systemSizeKw, data);
  const savings = calculateSavings(data, production);
  const roi = calculateRoi(systemSize.systemSizeKw, battery, savings);
  const suitability = calculateSuitability(data, panels);
  const recommendation = generateRecommendation(data, systemSize, panels, inverter, battery);

  return {
    suitability,
    systemSize,
    panels,
    inverter,
    battery,
    production,
    savings,
    roi,
    recommendation,
  };
}
