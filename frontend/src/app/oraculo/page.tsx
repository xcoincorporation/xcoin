"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type OracleResponse = {
  ok: boolean;
  asOf: string;
  symbol: string;
  priceUsd: number;
  totalSupply: number;
  marketCapUsd: number;
  targetMarketCapUsd: number;
  progress: number; // 0–1
};

function fmtUsd(value: number): string {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

function fmtPercent(value: number): string {
  return (value * 100).toFixed(2) + " %";
}

export default function OraclePage() {
  const [data, setData] = useState<OracleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setErrorMsg(null);
      const res = await fetch("/api/oracle", { cache: "no-store" });
      const json = (await res.json()) as OracleResponse;
      setData(json);
      if (!json.ok) {
        setErrorMsg("Oráculo en modo simulación (mock)");
      }
    } catch (e) {
      console.error(e);
      setErrorMsg("No se pudo obtener la información del oráculo.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const progress = data ? Math.min(Math.max(data.progress, 0), 1) : 0;
  const usersPool = data ? data.totalSupply * 0.8 : 0;
  const treasuryPool = data ? data.totalSupply * 0.2 : 0;


  return (
    <main className="mx-auto max-w-6xl px-4 py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            Oráculo XCoin · Market Cap objetivo
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Vista técnica del experimento: precio de referencia, capitalización estimada
            y progreso hacia los hitos de desbloqueo basados en Market Cap.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="btn btn-primary text-sm"
        >
          Ir al Dashboard técnico
        </Link>
      </div>

      {/* Panel principal */}
      <section className="rounded-2xl border border-neutral-800 bg-[#111111] px-6 py-5 shadow-xl shadow-black/40 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">
              Estado del oráculo
            </div>
            <div className="text-3xl font-semibold text-white flex items-baseline gap-2">
              {data ? (
                <>
                  {fmtUsd(data.priceUsd)}
                  <span className="text-sm text-neutral-400 font-normal">
                    por {data.symbol}
                  </span>
                </>
              ) : (
                <span className="text-neutral-500 text-base">
                  {loading ? "Cargando precio..." : "—"}
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-400 max-w-md">
              El precio aquí mostrado es de referencia (mock). Los hitos de desbloqueo se
              basan en la capitalización de mercado estimada en función del supply total
              on-chain.
            </p>
          </div>

          <button
            onClick={load}
            disabled={loading}
            className="btn text-sm disabled:opacity-60"
          >
            {loading ? "Actualizando..." : "Refrescar"}
          </button>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-neutral-800 bg-black/40 px-4 py-3">
            <div className="text-xs text-neutral-400 mb-1">Market Cap estimado</div>
            <div className="text-xl font-semibold text-white">
              {data ? fmtUsd(data.marketCapUsd) : "—"}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Supply total:{" "}
              {data
                ? data.totalSupply.toLocaleString("es-AR") + " " + data.symbol
                : "—"}
            </div>
          </div>
          
          {/* Fases y distribución 80/20 */}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-neutral-800 bg-black/40 px-4 py-3">
              <div className="text-xs text-neutral-400 mb-1">Fase actual</div>
              <div className="text-sm text-neutral-200">
                FASE 0 — Entorno de prueba (Sepolia) con oráculo de referencia.
              </div>
              <div className="text-xs text-neutral-500 mt-2">
                El precio mostrado es de laboratorio. Las reglas de desbloqueo se fijan
                antes de listar en exchanges para evitar ciclos de pump &amp; dump
                descontrolados.
              </div>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-black/40 px-4 py-3">
              <div className="text-xs text-neutral-400 mb-1">
                Distribución teórica 80/20 sobre el supply total
              </div>
              {data ? (
                <ul className="text-xs text-neutral-300 space-y-1">
                  <li>
                    80% Usuarios:{" "}
                    <span className="font-mono">
                      {usersPool.toLocaleString("es-AR")} {data.symbol}
                    </span>
                  </li>
                  <li>
                    20% Tesorería:{" "}
                    <span className="font-mono">
                      {treasuryPool.toLocaleString("es-AR")} {data.symbol}
                    </span>
                  </li>
                  <li className="text-neutral-500 mt-1">
                    Esta vista es explicativa; la lógica de vesting y desbloqueo se
                    implementará en los contratos en fases posteriores.
                  </li>
                </ul>
              ) : (
                <div className="text-xs text-neutral-500">
                  Cargando distribución 80/20…
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-black/40 px-4 py-3">
            <div className="text-xs text-neutral-400 mb-1">
              Market Cap objetivo (fase 1)
            </div>
            <div className="text-xl font-semibold text-white">
              {data ? fmtUsd(data.targetMarketCapUsd) : "—"}
            </div>
            <div className="text-xs text-neutral-500 mt-1">
              Definido en el whitepaper como gatillo de desbloqueo inicial.
            </div>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-black/40 px-4 py-3">
            <div className="text-xs text-neutral-400 mb-1">Progreso hacia el objetivo</div>
            <div className="text-xl font-semibold text-white">
              {data ? fmtPercent(progress) : "—"}
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-neutral-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#f5c84b]"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Cuando el Market Cap cruce el objetivo, el oráculo puede activar una nueva
              fase de desbloqueo de tokens.
            </div>
          </div>
        </div>

        {/* Meta / estado */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-neutral-500">
          <div>
            {data && (
              <>
                Última actualización:{" "}
                <span className="text-neutral-300">
                  {new Date(data.asOf).toLocaleString("es-AR")}
                </span>
              </>
            )}
          </div>
          <div>
            Estado:&nbsp;
            <span className={data?.ok ? "text-emerald-400" : "text-amber-400"}>
              {data
                ? data.ok
                  ? "On-chain OK (lectura directa del contrato)"
                  : "Modo degradado / mock"
                : "Esperando respuesta del oráculo"}
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-2 rounded-lg border border-amber-700/60 bg-amber-950/40 px-3 py-2 text-xs text-amber-200">
            {errorMsg}
          </div>
        )}
      </section>
    </main>
  );
}
