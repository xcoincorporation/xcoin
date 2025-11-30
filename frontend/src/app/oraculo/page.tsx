"use client";

import { useEffect, useState } from "react";

type OracleResponse = {
  ok: boolean;
  mode: string;
  assetId: string;
  priceUsd: number;
  targetMarketCapUsd: number;
  marketCapUsd: number;
  progress: number;
  error?: string;
};

export default function OraclePage() {
  const [data, setData] = useState<OracleResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function loadOracle() {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/oracle", {
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(
          `Error HTTP ${res.status} en /api/oracle: ${text}`
        );
      }

      const json = await res.json();
      // Aseguramos defaults para evitar undefined
      const safe: OracleResponse = {
        ok: json.ok ?? true,
        mode: json.mode ?? "mock",
        assetId: json.assetId ?? "unknown",
        priceUsd: Number(json.priceUsd ?? 0),
        targetMarketCapUsd: Number(json.targetMarketCapUsd ?? 0),
        marketCapUsd: Number(json.marketCapUsd ?? 0),
        progress: Number(json.progress ?? 0),
        error: json.error,
      };

      setData(safe);
    } catch (e: any) {
      console.error("OraclePage.loadOracle error", e);
      setError(
        e?.message ||
          "No se pudo leer el oráculo de MarketCap en este momento."
      );
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOracle();
  }, []);

  const price =
    data?.priceUsd != null
      ? data.priceUsd.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 6,
        })
      : "-";

  const marketCap =
    data?.marketCapUsd != null
      ? data.marketCapUsd.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "-";

  const targetCap =
    data?.targetMarketCapUsd != null
      ? data.targetMarketCapUsd.toLocaleString("en-US", {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })
      : "-";

  const progressPct =
    data?.progress != null
      ? (data.progress * 100).toFixed(2)
      : "0.00";

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">
          Oráculo de MarketCap — XCoin
        </h1>
        <p className="text-sm text-neutral-400 max-w-3xl">
          Esta vista muestra la lectura actual del oráculo de
          MarketCap que alimenta el motor de vesting en{" "}
          <span className="font-semibold">Sepolia</span>. Es
          un entorno de laboratorio: los valores se utilizan
          sólo para simulación y no representan datos de
          mercado reales ni una oferta al público.
        </p>
      </header>

      <section className="rounded-2xl border border-neutral-800 bg-black/60 p-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Estado del oráculo
            </h2>
            <p className="text-xs text-neutral-400">
              Endpoint HTTP:{" "}
              <span className="font-mono text-[11px]">
                /api/oracle
              </span>
            </p>
          </div>

          <button
            onClick={loadOracle}
            disabled={loading}
            className="rounded-full bg-neutral-800 px-3 py-1 text-xs text-neutral-100 hover:bg-neutral-700 disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </button>
        </div>

        {error && (
          <div className="text-xs text-red-400 bg-red-950/30 border border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {!error && !data && (
          <div className="text-xs text-neutral-400">
            {loading
              ? "Leyendo oráculo de MarketCap…"
              : "Sin datos del oráculo todavía."}
          </div>
        )}

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-neutral-300">
            <div className="rounded-xl bg-neutral-900/70 p-3">
              <div className="text-[11px] text-neutral-400">
                Activo de referencia
              </div>
              <div className="text-sm font-semibold uppercase">
                {data.assetId}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500">
                Modo:{" "}
                <span className="font-mono text-[11px]">
                  {data.mode}
                </span>
              </div>
            </div>

            <div className="rounded-xl bg-neutral-900/70 p-3">
              <div className="text-[11px] text-neutral-400">
                Precio simulado
              </div>
              <div className="text-sm font-semibold">
                {price === "-"
                  ? "-"
                  : `$ ${price} USD`}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500">
                Valor de referencia utilizado para construir el
                MarketCap.
              </div>
            </div>

            <div className="rounded-xl bg-neutral-900/70 p-3">
              <div className="text-[11px] text-neutral-400">
                MarketCap actual (demo)
              </div>
              <div className="text-sm font-semibold">
                {marketCap === "-"
                  ? "-"
                  : `$ ${marketCap} USD`}
              </div>
              <div className="mt-1 text-[11px] text-neutral-500">
                Entrada bruta que se utiliza para calcular la fase
                de vesting.
              </div>
            </div>

            <div className="rounded-xl bg-neutral-900/70 p-3">
              <div className="text-[11px] text-neutral-400">
                Progreso hacia el objetivo
              </div>
              <div className="text-sm font-semibold">
                {progressPct}%{" "}
                <span className="text-[11px] text-neutral-500">
                  de {targetCap === "-"
                    ? "-"
                    : `$ ${targetCap} USD`}
                </span>
              </div>
              <div className="mt-1 text-[11px] text-neutral-500">
                Objetivo configurado en el laboratorio para simular
                el desbloqueo total (100% BPS).
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-neutral-800 bg-black/40 p-6 space-y-3 text-xs text-neutral-400">
        <h3 className="text-sm font-semibold text-neutral-200">
          Notas técnicas
        </h3>
        <ul className="list-disc list-inside space-y-1">
          <li>
            El backend puede operar en modo{" "}
            <span className="font-mono text-[11px]">
              ORACLE_MODE=mock
            </span>{" "}
            (curva simulada) o{" "}
            <span className="font-mono text-[11px]">
              ORACLE_MODE=coingecko
            </span>{" "}
            para colgarse a un feed de precio real.
          </li>
          <li>
            La lógica aplica límites de variación diaria para evitar
            saltos absurdos en la fase de vesting (suavizado por
            configuración).
          </li>
          <li>
            Todos los valores mostrados en este entorno son de{" "}
            <span className="font-semibold">
              laboratorio en testnet
            </span>{" "}
            y no constituyen información financiera ni oferta de
            inversión.
          </li>
        </ul>
      </section>
    </main>
  );
}
