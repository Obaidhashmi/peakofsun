import React from "react";
import type { LocationData } from "../types";
import { SectionLabel } from "./ui";
import { MapPin } from "lucide-react";

export function StepLocation({
  data,
  onChange,
}: {
  data: LocationData;
  onChange: (data: LocationData) => void;
}) {
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={16} className="text-sun-600" />
        <SectionLabel>Step 1</SectionLabel>
      </div>
      <h2 className="font-display text-2xl font-semibold text-ink mb-1">Where is your home?</h2>
      <p className="text-muted text-sm mb-8">Location helps us estimate sun exposure in your area.</p>

      <div className="grid gap-5">
        <Field label="Country">
          <input
            className="input"
            value={data.country}
            onChange={(e) => onChange({ ...data, country: e.target.value })}
            placeholder="e.g. United States"
          />
        </Field>
        <div className="grid grid-cols-2 gap-5">
          <Field label="State / Province">
            <input
              className="input"
              value={data.state}
              onChange={(e) => onChange({ ...data, state: e.target.value })}
              placeholder="e.g. California"
            />
          </Field>
          <Field label="City">
            <input
              className="input"
              value={data.city}
              onChange={(e) => onChange({ ...data, city: e.target.value })}
              placeholder="e.g. Fresno"
            />
          </Field>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-ink mb-1.5">{label}</span>
      {children}
    </label>
  );
}
