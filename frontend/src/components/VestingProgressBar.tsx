"use client";

import React from "react";

type VestingPhase = {
  id: number;
  label: string;
  thresholdUsd: number;
  unlockedBps: number;
};

type Props = {
  phases: VestingPhase[];
  currentPhaseId: number;
};

export const VestingProgressBar: React.FC<Props> = ({
  phases,
  currentPhaseId,
}) => {
  if (!phases.length) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>Curva de vesting por MarketCap</span>
        <span className="font-mono text-[11px] text-neutral-500">
          Fase #{currentPhaseId}
        </span>
      </div>

      <div className="relative h-4 w-full overflow-hidden rounded-full bg-neutral-900/80 border border-neutral-700/80">
        {/* Capa de “glow” detrás */}
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-fuchsia-500/15 to-emerald-500/20 opacity-70" />

        {/* Segmentar por fase */}
        <div className="relative flex h-full">
          {phases.map((phase, idx) => {
            const isActive = phase.id === currentPhaseId;
            const isCompleted = phase.id < currentPhaseId;

            return (
              <div
                key={phase.id}
                className="flex-1 border-r border-neutral-800/70 last:border-r-0"
              >
                <div
                  className={[
                    "h-full transition-all duration-500",
                    isActive
                      ? "bg-gradient-to-r from-amber-400 to-amber-300 shadow-[0_0_25px_rgba(251,191,36,0.8)]"
                      : isCompleted
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-300"
                      : "bg-transparent",
                  ].join(" ")}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Labels debajo */}
      <div className="grid grid-cols-2 gap-3 text-[11px] text-neutral-400 md:grid-cols-4">
        {phases.map((phase) => {
          const isActive = phase.id === currentPhaseId;
          const isCompleted = phase.id < currentPhaseId;

          return (
            <div
              key={phase.id}
              className={[
                "flex flex-col gap-0.5 rounded-xl border px-3 py-2",
                isActive
                  ? "border-amber-400/70 bg-amber-500/5 text-amber-50"
                  : isCompleted
                  ? "border-emerald-400/40 bg-emerald-500/5 text-emerald-50"
                  : "border-neutral-800 bg-neutral-950/60",
              ].join(" ")}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{phase.label}</span>
                <span className="font-mono text-[10px] text-neutral-400">
                  {phase.unlockedBps / 100}%
                </span>
              </div>
              <div className="text-[10px] text-neutral-500">
                Target: $
                {phase.thresholdUsd.toLocaleString("en-US", {
                  maximumFractionDigits: 0,
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
