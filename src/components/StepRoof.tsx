import type { RoofData, RoofType, RoofDirection, ShadingLevel } from "../types";
import { SectionLabel } from "./ui";
import { Field } from "./StepLocation";
import { Home } from "lucide-react";

const roofTypes: RoofType[] = ["Concrete", "Metal", "Tile", "Other"];
const directions: RoofDirection[] = ["North", "South", "East", "West", "South-East", "South-West"];
const shadingLevels: ShadingLevel[] = ["None", "Light", "Medium", "Heavy"];

export function StepRoof({
  data,
  onChange,
}: {
  data: RoofData;
  onChange: (data: RoofData) => void;
}) {
  return (
    <div className="animate-fadeUp">
      <div className="flex items-center gap-2 mb-1">
        <Home size={16} className="text-sun-600" />
        <SectionLabel>Step 3</SectionLabel>
      </div>
      <h2 className="font-display text-2xl font-semibold text-ink mb-1">Roof information</h2>
      <p className="text-muted text-sm mb-8">Your roof's shape and exposure directly affect system output.</p>

      <div className="grid gap-6">
        <div className="grid grid-cols-2 gap-5">
          <Field label="Roof Area (sq ft)">
            <input
              type="number"
              min={0}
              className="input"
              value={data.roofArea || ""}
              onChange={(e) => onChange({ ...data, roofArea: Number(e.target.value) })}
              placeholder="e.g. 800"
            />
          </Field>
          <Field label="Roof Tilt (Optional, degrees)">
            <input
              type="number"
              min={0}
              max={60}
              className="input"
              value={data.roofTilt ?? ""}
              onChange={(e) => onChange({ ...data, roofTilt: Number(e.target.value) })}
              placeholder="e.g. 20"
            />
          </Field>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink mb-2">Roof Type</span>
          <div className="grid grid-cols-4 gap-3">
            {roofTypes.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ ...data, roofType: type })}
                className={`chip ${data.roofType === type ? "chip-active" : ""}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink mb-2">Roof Direction</span>
          <div className="grid grid-cols-3 gap-3">
            {directions.map((dir) => (
              <button
                key={dir}
                type="button"
                onClick={() => onChange({ ...data, roofDirection: dir })}
                className={`chip ${data.roofDirection === dir ? "chip-active" : ""}`}
              >
                {dir}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="block text-sm font-medium text-ink mb-2">Roof Shading</span>
          <div className="grid grid-cols-4 gap-3">
            {shadingLevels.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => onChange({ ...data, shading: level })}
                className={`chip ${data.shading === level ? "chip-active" : ""}`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
