

interface ConfluenceGaugeProps {
  score: number;
  signal: string;
  signalQuality: number;
}

export default function ConfluenceGauge({ score, signal, signalQuality }: ConfluenceGaugeProps) {
  const radius = 80;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  // Show ~270° arc (¾ of circle), starting from bottom-left
  const arcFraction = 0.75;
  const filledFraction = (score / 100) * arcFraction;
  const dashArray = circumference;
  const dashOffset = circumference * (1 - filledFraction);
  const bgDashOffset = circumference * (1 - arcFraction);

  const signalColor =
    signal === "LONG"
      ? "#22c55e"
      : signal === "SHORT"
      ? "#ef4444"
      : "#f59e0b";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 180, height: 180 }}>
        <svg
          width="180"
          height="180"
          viewBox="0 0 180 180"
          style={{ transform: "rotate(135deg)" }}
        >
          {/* Background arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={bgDashOffset}
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="none"
            stroke={signalColor}
            strokeWidth={strokeWidth}
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 0.8s ease, stroke 0.4s ease" }}
          />
        </svg>
        {/* Center text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ top: 0 }}
        >
          <span className="text-xs text-slate-400 uppercase tracking-widest mb-1">
            CONFLUENCE
          </span>
          <span className="text-5xl font-bold text-white leading-none">
            {score}
          </span>
          <span className="text-slate-400 text-sm">/100</span>
        </div>
      </div>
      {/* Signal badge */}
      <div
        className="px-6 py-1 rounded text-sm font-bold tracking-widest border"
        style={{
          color: signalColor,
          borderColor: signalColor,
          backgroundColor: `${signalColor}18`,
        }}
      >
        {signal}
      </div>
      <div className="text-xs text-slate-500">
        Signal quality{" "}
        <span className="text-slate-300 font-semibold">{signalQuality}/100</span>
      </div>
    </div>
  );
}
