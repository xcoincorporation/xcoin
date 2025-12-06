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

export const VestingPhaseTable: React.FC<Props> = ({
  phases,
  currentPhaseId,
}) => {
  if (!phases.length) return null;

  return (
    <div className="rounded-2xl border border-neutral-800 bg-black/60 p-4 md:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-100">
          Mapa de fases del Vault 80%
        </h3>
        <span className="rounded-full bg-neutral-900 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-neutral-500">
          Vesting dinámico
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-1 text-xs">
          <thead>
            <tr className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">
              <th className="px-3 py-2 text-left">Fase</th>
              <th className="px-3 py-2 text-right">MarketCap objetivo</th>
              <th className="px-3 py-2 text-right">% desbloqueado</th>
              <th className="px-3 py-2 text-right">Estado</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((phase) => {
              const isActive = phase.id === currentPhaseId;
              const isCompleted = phase.id < currentPhaseId;

              return (
                <tr
                  key={phase.id}
                  className={[
                    "rounded-xl border border-transparent",
                    isActive
                      ? "bg-amber-500/10 border-amber-400/40"
                      : isCompleted
                      ? "bg-emerald-500/5 border-emerald-400/40"
                      : "bg-neutral-950/80 border-neutral-900",
                  ].join(" ")}
                >
                  <td className="px-3 py-2 text-left text-neutral-100">
                    <span className="font-medium">{phase.label}</span>
                  </td>
                  <td className="px-3 py-2 text-right text-neutral-200">
                    $
                    {phase.thresholdUsd.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="px-3 py-2 text-right text-neutral-200">
                    {(phase.unlockedBps / 100).toFixed(2)}%
                  </td>
                  <td className="px-3 py-2 text-right">
                    {isActive ? (
                      <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-100">
                        ACTUAL
                      </span>
                    ) : isCompleted ? (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-medium text-emerald-100">
                        COMPLETADA
                      </span>
                    ) : (
                      <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-neutral-300">
                        PENDIENTE
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-[11px] text-neutral-500">
        Los porcentajes se calculan sobre el 80% del supply total asignado al
        Vault de usuarios. El salto entre fases se dispara on-chain mediante el
        oráculo de MarketCap.
      </p>
    </div>
  );
};
