"use client";

import { useEffect, useState } from "react";

type OracleResponse = {
  assetSymbol?: string;
  priceUsd?: number;
  marketCapUsd?: number;
  targetMarketCapUsd?: number;
  progressPct?: number;
};

type State =
  | { status: "idle" | "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: OracleResponse };

function formatUsd(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "$ —";
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function formatPct(value?: number) {
  if (value === undefined || Number.isNaN(value)) return "— %";
  return `${value.toFixed(2)} %`;
}

export default function LandingOracleDashboard() {
  const [state, setState] = useState<State>({ status: "idle" });

  useEffect(() => {
    const load = async () => {
      try {
        setState({ status: "loading" });

        const res = await fetch("/api/oracle");
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const json = (await res.json()) as OracleResponse;
        setState({ status: "ready", data: json });
      } catch (e: any) {
        console.error("LandingOracleDashboard error", e);
        setState({
          status: "error",
          message: e?.message || "No se pudo leer el oráculo",
        });
      }
    };

    load();
  }, []);

  if (state.status === "loading" || state.status === "idle") {
    return (
      <div className="grid gap-4 md:grid-cols-3 text-sm text-neutral-400">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            BTC Market Cap (oráculo)
          </div>
          <div className="mt-2 h-6 animate-pulse rounded bg-neutral-800" />
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Objetivo XCoin
          </div>
          <div className="mt-2 h-6 animate-pulse rounded bg-neutral-800" />
        </div>
        <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Progreso
          </div>
          <div className="mt-2 h-6 animate-pulse rounded bg-neutral-800" />
        </div>
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <div className="rounded-2xl border border-red-900/60 bg-red-950/40 p-4 text-sm text-red-200">
        <div className="font-semibold">Error al leer el oráculo</div>
        <div className="text-xs text-red-300/80 mt-1">
          {state.message}. Revisá que la API <code>/api/oracle</code> esté
          respondiendo correctamente.
        </div>
      </div>
    );
  }

  const data = state.data;
  const asset = data.assetSymbol ?? "ETHEREUM";

  return (
    <div className="grid gap-4 md:grid-cols-3 text-sm">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="text-xs uppercase tracking-wide text-neutral-500">
          {asset} Market Cap (oráculo)
        </div>
        <div className="mt-2 text-xl font-semibold text-neutral-50">
          {formatUsd(data.marketCapUsd)}
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Valor reportado por el endpoint <code>/api/oracle</code>.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="text-xs uppercase tracking-wide text-neutral-500">
          Objetivo XCoin
        </div>
        <div className="mt-2 text-xl font-semibold text-neutral-50">
          {formatUsd(data.targetMarketCapUsd)}
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Objetivo configurado para el desbloqueo total del Vault.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-950/40 p-4">
        <div className="text-xs uppercase tracking-wide text-neutral-500">
          Progreso hacia el objetivo
        </div>
        <div className="mt-2 text-xl font-semibold text-[#4ade80]">
          {formatPct(data.progressPct)}
        </div>
        <p className="mt-1 text-xs text-neutral-400">
          Se calcula con los mismos datos que alimentan a XCoinVault.
        </p>
      </div>
    </div>
  );
}
