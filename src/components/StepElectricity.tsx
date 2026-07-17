import type { ElectricityData } from "../types";
import { SectionLabel } from "./ui";
import { Field } from "./StepLocation";
import { Zap } from "lucide-react";

export function StepElectricity({
  data,
  onChange,
}: {
  data: ElectricityData;
  onChange: (data: ElectricityData) => void;
}) {
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-2 mb-1">
        <Zap size={16} className="text-sun-600" />
        <SectionLabel>Step 2</SectionLabel>
      </div>
      <h2 className="font-display text-2xl font-semibold text-ink mb-1">Electricity information</h2>
      <p className="text-muted text-sm mb-8">This determines how much energy your system needs to produce.</p>

      <div className="grid gap-5">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Monthly Electricity Bill">
            <input
              type="number"
              min={0}
              className="input"
              value={data.monthlyBill || ""}
              onChange={(e) => onChange({ ...data, monthlyBill: Number(e.target.value) })}
              placeholder="e.g. 150"
            />
          </Field>
          <Field label="Monthly Units Consumed (kWh)">
            <input
              type="number"
              min={0}
              className="input"
              value={data.monthlyUnits || ""}
              onChange={(e) => onChange({ ...data, monthlyUnits: Number(e.target.value) })}
              placeholder="e.g. 600"
            />
          </Field>
        </div>
        <Field label="Electricity Provider (Optional)">
          <input
            className="input"
            value={data.provider || ""}
            onChange={(e) => onChange({ ...data, provider: e.target.value })}
            placeholder="e.g. PG&E"
          />
        </Field>
      </div>
    </div>
  );
}
