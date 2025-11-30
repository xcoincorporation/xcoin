"use client";
import React from "react";

export default function TokenomicsCard() {
  return (
    <section className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4 text-neutral-300">
        <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-200">
            Distribución inicial
          </h2>
          <p className="text-sm mt-1">
            80% usuarios (bloqueado por fases en{" "}
            <span className="font-semibold">XCoinVault</span>) y 20% tesorería
            (liquidez, desarrollo, market making y reservas estratégicas).
          </p>
        </div>

        <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-200">
            Precio de laboratorio
          </h2>
          <p className="text-sm mt-1">
            En este entorno de testnet la referencia interna es{" "}
            <span className="font-mono text-xs">0.0001 ETH</span> por XCOIN
            (aprox. 1 USD en el diseño conceptual). No representa precio real de
            mercado.
          </p>
        </div>

        <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-200">
            Oráculo de MarketCap
          </h2>
          <p className="text-sm mt-1">
            El laboratorio usa un feed de MarketCap expuesto en{" "}
            <span className="font-mono text-xs">/api/oracle</span> para simular
            los umbrales de desbloqueo del vault en Sepolia.
          </p>
          <p className="text-[11px] mt-2 text-neutral-400">
            Demo educativa en red de prueba: las métricas y valores mostrados no
            constituyen recomendación de inversión ni reflejan datos de mercado
            reales.
          </p>
        </div>
      </div>
    </section>
  );
}
