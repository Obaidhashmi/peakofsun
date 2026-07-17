import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import type { SolarAnalysisResult, SolarFormData } from "../types";
import { Card, SectionLabel, StatBlock, PrimaryButton, SecondaryButton } from "./ui";
import { SuitabilityGauge } from "./SuitabilityGauge";
import {
  Sun,
  PanelsTopLeft,
  Cpu,
  BatteryCharging,
  Activity,
  Wallet,
  TrendingUp,
  FileText,
  RotateCcw,
  Download,
} from "lucide-react";

export function ResultsDashboard({
  result,
  formData,
  onRestart,
}: {
  result: SolarAnalysisResult;
  formData: SolarFormData;
  onRestart: () => void;
}) {
  const { suitability, systemSize, panels, inverter, battery, production, savings, roi, recommendation } = result;

  return (
    <section className="max-w-5xl mx-auto px-6 py-14">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-lg bg-sun-gradient flex items-center justify-center">
              <Sun size={14} className="text-white" />
            </div>
            <span className="font-mono text-xs uppercase tracking-wide text-muted">Solar Analysis Report</span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-ink">
            {formData.location.city ? `${formData.location.city}, ${formData.location.state}` : "Your Solar Report"}
          </h1>
        </div>
        <div className="flex gap-3">
          <SecondaryButton onClick={onRestart}>
            <RotateCcw size={15} />
            New Analysis
          </SecondaryButton>
          <PrimaryButton onClick={() => window.print()}>
            <Download size={15} />
            Save Report
          </PrimaryButton>
        </div>
      </header>

      <div className="grid gap-6">
        {/* Section 1: Suitability Score */}
        <Card className="p-8 grid sm:grid-cols-[auto_1fr] gap-8 items-center">
          <SuitabilityGauge score={suitability.score} label={suitability.label} />
          <div>
            <SectionLabel>Solar Suitability Score</SectionLabel>
            <h2 className="font-display text-xl font-semibold text-ink mb-2">
              Your roof is a {suitability.label.toLowerCase()} candidate for solar
            </h2>
            <p className="text-sm text-muted leading-relaxed">
              Calculated from your roof's available space, shading conditions, orientation, and stated budget
              tier — the same factors a field engineer would evaluate on-site.
            </p>
          </div>
        </Card>

        {/* Section 2: Recommended System */}
        <Card className="p-8">
          <SectionLabel>Recommended Solar System</SectionLabel>
          <div className="flex items-baseline gap-3">
            <span className="font-display font-mono text-5xl font-semibold text-ink">{systemSize.systemSizeKw}</span>
            <span className="text-xl text-muted font-medium">kW system</span>
          </div>
          {systemSize.budgetLimited && (
            <div className="mt-4 rounded-xl bg-sun-50 border border-sun-100 px-4 py-3">
              <p className="text-sm text-sun-700">
                Sized to fit your budget of Rs {formData.requirements.budgetAmount?.toLocaleString()} — this is
                smaller than what your usage alone would call for. You can expand the system later.
              </p>
            </div>
          )}
        </Card>

        {/* Section 3 & 4: Panels + Inverter side by side */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <PanelsTopLeft size={16} className="text-sun-600" />
              <SectionLabel>Recommended Solar Panels</SectionLabel>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <StatBlock label="Number of Panels" value={`${panels.panelCount}`} />
              <StatBlock label="Panel Wattage" value={`${panels.panelWattage}W`} sub="TOPCon" />
              <StatBlock
                label="Roof Space Required"
                value={`${panels.roofSpaceRequiredSqFt.toLocaleString()} sq ft`}
              />
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-2 mb-4">
              <Cpu size={16} className="text-sun-600" />
              <SectionLabel>Recommended Inverter</SectionLabel>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-4">
              <StatBlock label="Inverter Size" value={`${inverter.sizeKw} kW`} />
              <StatBlock label="Type" value={inverter.type} />
            </div>
            <p className="text-sm text-muted leading-relaxed">{inverter.explanation}</p>
          </Card>
        </div>

        {/* Section 5: Battery */}
        <Card className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <BatteryCharging size={16} className="text-sun-600" />
            <SectionLabel>Battery Recommendation</SectionLabel>
          </div>
          {battery.needed ? (
            <div className="grid sm:grid-cols-[auto_1fr] gap-6 items-center">
              <StatBlock label="Recommended Capacity" value={`${battery.capacityKwh} kWh`} />
              <p className="text-sm text-muted leading-relaxed">{battery.explanation}</p>
            </div>
          ) : (
            <p className="text-sm text-muted leading-relaxed">{battery.explanation}</p>
          )}
        </Card>

        {/* Section 6: Energy Production */}
        <Card className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-sun-600" />
            <SectionLabel>Estimated Energy Production</SectionLabel>
          </div>
          <div className="grid grid-cols-3 gap-6 mb-8">
            <StatBlock label="Daily Production" value={`${production.dailyKwh} kWh`} />
            <StatBlock label="Monthly Production" value={`${production.monthlyKwh.toLocaleString()} kWh`} />
            <StatBlock label="Annual Production" value={`${production.annualKwh.toLocaleString()} kWh`} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={production.monthlyChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }}
                  formatter={((value: any) => [`${Number(value).toLocaleString()} kWh`, "Production"]) as any}
                />
                <Bar dataKey="kwh" fill="#F59E0B" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Section 7: Savings */}
        <Card className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <Wallet size={16} className="text-sun-600" />
            <SectionLabel>Estimated Savings</SectionLabel>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-6 mb-8">
            <StatBlock label="Current Bill" value={`Rs ${savings.currentMonthlyBill.toLocaleString()}`} />
            <StatBlock label="Bill After Solar" value={`Rs ${savings.estimatedMonthlyBillAfterSolar.toLocaleString()}`} />
            <StatBlock label="Monthly Savings" value={`Rs ${savings.monthlySavings.toLocaleString()}`} />
            <StatBlock label="Annual Savings" value={`Rs ${savings.annualSavings.toLocaleString()}`} />
            <StatBlock label="25-Year Savings" value={`Rs ${savings.twentyFiveYearSavings.toLocaleString()}`} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={savings.yearlyChart} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={{ stroke: "#E5E7EB" }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "1px solid #E5E7EB", fontSize: 12 }}
                  formatter={((value: any) => [`Rs ${Number(value).toLocaleString()}`, "Cumulative Savings"]) as any}
                  labelFormatter={(year) => `Year ${year}`}
                />
                <Line type="monotone" dataKey="cumulativeSavings" stroke="#EA580C" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Section 8: ROI */}
        <Card className="p-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-sun-600" />
            <SectionLabel>Return on Investment</SectionLabel>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <StatBlock label="Estimated System Cost" value={`Rs ${roi.systemCost.toLocaleString()}`} />
            <StatBlock label="Estimated Payback Period" value={`${roi.paybackPeriodYears} yrs`} />
            <StatBlock label="Estimated Lifetime Profit" value={`Rs ${roi.lifetimeProfit.toLocaleString()}`} />
          </div>
        </Card>

        {/* Section 9: Professional Recommendation */}
        <Card className="p-8 bg-panel border-sun-100">
          <div className="flex items-center gap-2 mb-4">
            <FileText size={16} className="text-sun-600" />
            <SectionLabel>Professional Recommendation</SectionLabel>
          </div>
          <p className="text-[15px] leading-relaxed text-ink">{recommendation}</p>
        </Card>
      </div>

      {/* Footer disclaimer */}
      <footer className="mt-12 pt-8 border-t border-line">
        <p className="text-xs text-muted leading-relaxed max-w-3xl">
          These estimates are based on engineering calculations and average solar irradiation. Actual performance
          depends on weather conditions, installation quality, shading, and local utility regulations.
        </p>
      </footer>
    </section>
  );
}
