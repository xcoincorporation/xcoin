import { useVestingInfo } from "@/hooks/useVestingInfo";

export function VestingCard() {
  const { phase, unlockedPct, marketCap, nextTarget, progressPct, loading } =
    useVestingInfo();

  if (loading) {
    return (
      <div className="p-6 rounded-xl bg-[#111] border border-neutral-800 text-neutral-400">
        Cargando motor de vesting…
      </div>
    );
  }

  return (
    <div className="p-6 rounded-xl bg-[#111] border border-neutral-800 space-y-3">
      <h3 className="text-xl font-semibold text-white">Motor de Vesting</h3>

      <div className="text-neutral-300 space-y-1">
        <div>
          <span className="text-neutral-500">Fase actual:</span>{" "}
          <span className="text-white font-bold">#{phase}</span>
        </div>

        <div>
          <span className="text-neutral-500">% desbloqueado:</span>{" "}
          <span className="text-white font-bold">{unlockedPct.toFixed(1)}%</span>
        </div>

        <div>
          <span className="text-neutral-500">MarketCap actual:</span>{" "}
          <span className="text-white font-bold">
            ${marketCap.toLocaleString()}
          </span>
        </div>

        <div>
          <span className="text-neutral-500">Próximo umbral:</span>{" "}
          <span className="text-white font-bold">
            ${nextTarget.toLocaleString()}
          </span>
        </div>
      </div>

      <div className="h-3 w-full bg-neutral-800 rounded-full overflow-hidden mt-4">
        <div
          className="h-full bg-yellow-500 transition-all"
          style={{ width: `${progressPct}%` }}
        ></div>
      </div>

      <p className="text-neutral-500 text-xs">
        Progreso hacia la próxima fase basado en el MarketCap reportado por el
        oráculo.
      </p>
    </div>
  );
}
