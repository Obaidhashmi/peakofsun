import { useState } from "react";
import type { SolarFormData } from "../types";
import { ProgressBar, PrimaryButton, SecondaryButton, Card } from "./ui";
import { StepLocation } from "./StepLocation";
import { StepElectricity } from "./StepElectricity";
import { StepRoof } from "./StepRoof";
import { StepRequirements } from "./StepRequirements";
import { ArrowLeft, ArrowRight, Sun } from "lucide-react";

const TOTAL_STEPS = 4;

const initialData: SolarFormData = {
  location: { country: "", state: "", city: "" },
  electricity: { monthlyBill: 0, monthlyUnits: 0, provider: "" },
  roof: {
    roofArea: 0,
    roofType: "Concrete",
    roofDirection: "South",
    roofTilt: undefined,
    shading: "None",
  },
  requirements: {
    propertyType: "Residential",
    batteryRequired: false,
    backupRequired: false,
    budget: "Medium",
    budgetAmount: undefined,
  },
};

export function SolarForm({ onComplete }: { onComplete: (data: SolarFormData) => void }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<SolarFormData>(initialData);

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return !!(formData.location.country && formData.location.state && formData.location.city);
      case 2:
        return formData.electricity.monthlyBill > 0 && formData.electricity.monthlyUnits > 0;
      case 3:
        return formData.roof.roofArea > 0;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else onComplete(formData);
  };

  const back = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <div className="flex items-center gap-2 justify-center mb-8">
        <div className="h-7 w-7 rounded-lg bg-sun-gradient flex items-center justify-center">
          <Sun size={14} className="text-white" />
        </div>
        <span className="font-display font-semibold">SolarScope AI</span>
      </div>

      <Card className="p-8 sm:p-10">
        <div className="mb-8">
          <ProgressBar step={step} totalSteps={TOTAL_STEPS} />
        </div>

        {step === 1 && (
          <StepLocation
            data={formData.location}
            onChange={(location) => setFormData({ ...formData, location })}
          />
        )}
        {step === 2 && (
          <StepElectricity
            data={formData.electricity}
            onChange={(electricity) => setFormData({ ...formData, electricity })}
          />
        )}
        {step === 3 && (
          <StepRoof data={formData.roof} onChange={(roof) => setFormData({ ...formData, roof })} />
        )}
        {step === 4 && (
          <StepRequirements
            data={formData.requirements}
            onChange={(requirements) => setFormData({ ...formData, requirements })}
          />
        )}

        <div className="mt-10 flex items-center justify-between">
          <SecondaryButton onClick={back} disabled={step === 1}>
            <ArrowLeft size={16} />
            Back
          </SecondaryButton>
          <PrimaryButton onClick={next} disabled={!canProceed()}>
            {step === TOTAL_STEPS ? "Analyze" : "Continue"}
            <ArrowRight size={16} />
          </PrimaryButton>
        </div>
      </Card>
    </section>
  );
}
