import { useState } from "react";
import type { SolarFormData, SolarAnalysisResult } from "./types";
import { analyzeSolarSystem } from "./utils/solarCalculations";
import { Hero } from "./components/Hero";
import { SolarForm } from "./components/SolarForm";
import { LoadingScreen } from "./components/LoadingScreen";
import { ResultsDashboard } from "./components/ResultsDashboard";

type Stage = "landing" | "form" | "loading" | "results";

export default function App() {
  const [stage, setStage] = useState<Stage>("landing");
  const [formData, setFormData] = useState<SolarFormData | null>(null);
  const [result, setResult] = useState<SolarAnalysisResult | null>(null);

  const handleFormComplete = (data: SolarFormData) => {
    setFormData(data);
    setStage("loading");
  };

  const handleLoadingDone = () => {
    if (formData) {
      const analysis = analyzeSolarSystem(formData);
      setResult(analysis);
      setStage("results");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestart = () => {
    setFormData(null);
    setResult(null);
    setStage("landing");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-canvas">
      {stage === "landing" && <Hero onStart={() => setStage("form")} />}
      {stage === "form" && <SolarForm onComplete={handleFormComplete} />}
      {stage === "loading" && <LoadingScreen onDone={handleLoadingDone} />}
      {stage === "results" && result && formData && (
        <ResultsDashboard result={result} formData={formData} onRestart={handleRestart} />
      )}
    </div>
  );
}
