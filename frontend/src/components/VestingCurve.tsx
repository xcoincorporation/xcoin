"use client";

export default function VestingCurve() {
  const steps = [
    "MC < 1M → 0%",
    "MC ≥ 1M → 10%",
    "MC ≥ 2M → 20%",
    "MC ≥ 4M → 35%",
    "MC ≥ 6M → 50%",
    "MC ≥ 10M → 75%",
    "MC ≥ 20M → 100%",
  ];

  return (
    <div className="rounded-xl border border-neutral-800 p-6 bg-neutral-950/40 backdrop-blur-md">
      <h3 className="text-xl font-semibold text-white mb-4">Vesting Engine</h3>

      <div className="flex flex-col gap-2 text-sm text-neutral-300">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
