import type { RequirementsData, PropertyType, BudgetTier } from "../types";
import { SectionLabel } from "./ui";
import { ClipboardList } from "lucide-react";

const propertyTypes: PropertyType[] = ["Residential", "Commercial"];
const budgetTiers: BudgetTier[] = ["Low", "Medium", "High"];

export function StepRequirements({
  data,
  onChange,
}: {
  data: RequirementsData;
  onChange: (data: RequirementsData) => void;
}) {
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-2 mb-1">
        <ClipboardList size={16} className="text-sun-600" />
        <SectionLabel>Step 4</SectionLabel>
      </div>
      <h2 className="font-display text-2xl font-semibold text-ink mb-1">Your requirements</h2>
      <p className="text-muted text-sm mb-8">A few final preferences to tailor your recommendation.</p>

      <div className="grid gap-6">
        <div>
          <span className="block text-sm font-medium text-ink mb-2">Property Type</span>
          <div className="grid grid-cols-2 gap-3">
            {propertyTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ ...data, propertyType: type })}
                className={`chip ${data.propertyType === type ? "chip-active" : ""}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <span className="block text-sm font-medium text-ink mb-2">Battery Required?</span>
            <div className="grid grid-cols-2 gap-3">
              {["Yes", "No"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange({ ...data, batteryRequired: opt === "Yes" })}
                  className={`chip ${
                    (opt === "Yes") === data.batteryRequired ? "chip-active" : ""
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span className="block text-sm font-medium text-ink mb-2">Backup Required?</span>
            <div className="grid grid-cols-2 gap-3">
              {["Yes", "No"].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onChange({ ...data, backupRequired: opt === "Yes" })}
                  className={`chip ${
                    (opt === "Yes") === data.backupRequired ? "chip-active" : ""
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink mb-2">Budget</span>
          <div className="grid grid-cols-3 gap-3">
            {budgetTiers.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => onChange({ ...data, budget: tier })}
                className={`chip ${data.budget === tier ? "chip-active" : ""}`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block">
            <span className="block text-sm font-medium text-ink mb-1.5">
              Your Exact Budget in PKR (Optional)
            </span>
            <input
              type="number"
              min={0}
              className="input"
              value={data.budgetAmount || ""}
              onChange={(e) =>
                onChange({ ...data, budgetAmount: e.target.value ? Number(e.target.value) : undefined })
              }
              placeholder="e.g. 800000"
            />
          </label>
          <p className="text-xs text-muted mt-1.5">
            If you enter an amount here, we'll size the system to fit your budget and show you exactly how
            many panels and how much cost that gets you — instead of only sizing for your usage.
          </p>
        </div>
      </div>
    </div>
  );
}
