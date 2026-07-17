import { useEffect, useState } from "react";
import { Sun } from "lucide-react";

const messages = [
  "Analyzing electricity usage...",
  "Calculating solar potential...",
  "Estimating annual production...",
  "Selecting the ideal inverter...",
  "Preparing your solar report...",
];

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => {
        if (i >= messages.length - 1) {
          clearInterval(interval);
          setTimeout(onDone, 700);
          return i;
        }
        return i + 1;
      });
    }, 900);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="min-h-[70vh] flex flex-col items-center justify-center px-6">
      <div className="relative h-20 w-20 mb-10">
        <div className="absolute inset-0 rounded-full bg-sun-gradient opacity-20 animate-ping" />
        <div className="relative h-20 w-20 rounded-full bg-sun-gradient flex items-center justify-center shadow-[0_8px_30px_rgba(234,88,12,0.35)]">
          <Sun size={32} className="text-white animate-[spin_6s_linear_infinite]" />
        </div>
      </div>

      <div className="h-6 overflow-hidden">
        <p key={index} className="font-mono text-sm text-ink animate-fadeUp text-center">
          {messages[index]}
        </p>
      </div>

      <div className="mt-8 flex gap-1.5">
        {messages.map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= index ? "w-6 bg-sun-500" : "w-1.5 bg-line"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
