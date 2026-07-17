
export function SuitabilityGauge({ score, label }: { score: number; label: string }) {
  // Semi-circle arc from 180deg to 0deg (left to right), like a sun arcing over a horizon.
  const radius = 80;
  const circumference = Math.PI * radius; // half circle length
  const progress = (score / 100) * circumference;

  const color =
    score >= 90 ? "#16A34A" : score >= 75 ? "#F59E0B" : score >= 60 ? "#EA580C" : "#DC2626";

  return (
    <div className="flex flex-col items-center">
      <svg width="200" height="120" viewBox="0 0 200 120">
        {/* track */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#E5E7EB"
          strokeWidth="14"
          strokeLinecap="round"
        />
        {/* progress arc */}
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={`${circumference - progress}`}
          style={{ transition: "stroke-dashoffset 1s ease-out, stroke 0.3s" }}
        />
        {/* sun marker dot at end of progress */}
        <circle
          cx={20 + 160 * Math.min(1, score / 100)}
          cy={100 - Math.sin(Math.PI * Math.min(1, score / 100)) * 0}
          r="0"
        />
      </svg>
      <div className="-mt-8 text-center">
        <p className="font-display font-mono text-4xl font-semibold text-ink">{score}</p>
        <p className="text-xs text-muted mt-0.5">/ 100</p>
        <p className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: `${color}1A`, color }}>
          {label}
        </p>
      </div>
    </div>
  );
}
