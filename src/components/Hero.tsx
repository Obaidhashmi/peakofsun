import { Sun, FileCheck2, Gauge, BatteryCharging, PanelsTopLeft, TrendingUp, LineChart } from "lucide-react";
import { PrimaryButton } from "./ui";

const features = [
  { icon: FileCheck2, label: "Professional Solar Report" },
  { icon: Gauge, label: "System Size Recommendation" },
  { icon: BatteryCharging, label: "Inverter Recommendation" },
  { icon: PanelsTopLeft, label: "Panel Recommendation" },
  { icon: TrendingUp, label: "Estimated Savings" },
  { icon: LineChart, label: "ROI Analysis" },
];

export function Hero({ onStart }: { onStart: () => void }) {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient sun-arc backdrop */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-sun-gradient opacity-[0.08] blur-3xl" />

      <nav className="relative max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-sun-gradient flex items-center justify-center">
            <Sun className="h-4.5 w-4.5 text-white" size={18} />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">SolarScope AI</span>
        </div>
        <span className="hidden sm:block font-mono text-xs text-muted uppercase tracking-wide">
          Solar Consultant · Instant Analysis
        </span>
      </nav>

      <div className="relative max-w-4xl mx-auto px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-1.5 mb-8 animate-fadeUp">
          <span className="h-1.5 w-1.5 rounded-full bg-good animate-pulseSlow" />
          <span className="font-mono text-xs text-muted">Rule-based engineering calculations, not guesswork</span>
        </div>

        <h1
          className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] text-ink animate-fadeUp"
          style={{ animationDelay: "80ms" }}
        >
          Find the Perfect Solar System for Your Home
        </h1>

        <p
          className="mt-6 text-lg text-muted max-w-2xl mx-auto leading-relaxed animate-fadeUp"
          style={{ animationDelay: "160ms" }}
        >
          Analyze your electricity usage, calculate the right solar system, estimate savings, and receive a
          professional solar recommendation in under one minute.
        </p>

        <div className="mt-10 animate-fadeUp" style={{ animationDelay: "240ms" }}>
          <PrimaryButton onClick={onStart} className="text-base px-8 py-4">
            Start Free Analysis
            <Sun size={18} />
          </PrimaryButton>
        </div>

        <div
          className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 animate-fadeUp"
          style={{ animationDelay: "320ms" }}
        >
          {features.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2.5 rounded-xl border border-line bg-panel/60 px-4 py-3 text-left"
            >
              <div className="h-7 w-7 shrink-0 rounded-lg bg-sun-50 flex items-center justify-center">
                <Icon size={15} className="text-sun-600" />
              </div>
              <span className="text-sm font-medium text-ink">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
