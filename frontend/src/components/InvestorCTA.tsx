"use client";

import Link from "next/link";

export default function InvestorCTA() {
  return (
    <section className="mx-auto max-w-6xl px-4 mt-14 space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl md:text-2xl font-semibold text-white">
          Pensado para holders de largo plazo
        </h2>
        <p className="text-sm text-neutral-400 max-w-3xl">
          XCoin no está diseñado para especulación de minutos. El experimento
          prioriza acumulación disciplinada, tesorería estable y métricas
          on-chain públicas antes de cualquier listado en exchanges.
        </p>
      </div>

      {/* Tres pilares para inversores */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-neutral-800 bg-black/40 px-5 py-4 space-y-2">
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-neutral-500">
            Entrada
          </div>
          <h3 className="text-sm font-semibold text-white">
            Precio de referencia simple
          </h3>
          <p className="text-sm text-neutral-400">
            Durante la Fase 0 el precio de referencia se fija en{" "}
            <span className="font-semibold text-[#f5c84b]">
              1 US$ por XCOIN
            </span>{" "}
            sobre un supply total de 1.000.000. Es un laboratorio en Sepolia,
            no un listado comercial todavía.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-black/40 px-5 py-4 space-y-2">
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-neutral-500">
            Protección
          </div>
          <h3 className="text-sm font-semibold text-white">
            Diseño anti pump &amp; dump
          </h3>
          <p className="text-sm text-neutral-400">
            El modelo 80/20 reserva{" "}
            <span className="font-semibold">200.000 XCOIN</span> en tesorería
            (20%) y{" "}
            <span className="font-semibold">800.000 XCOIN</span> para usuarios
            (80%). Los hitos de desbloqueo y vesting se definen en el
            whitepaper para desalentar ciclos cortos de venta masiva.
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-black/40 px-5 py-4 space-y-2">
          <div className="text-xs font-semibold tracking-[0.18em] uppercase text-neutral-500">
            Transparencia
          </div>
          <h3 className="text-sm font-semibold text-white">
            Métricas on-chain y oráculo público
          </h3>
          <p className="text-sm text-neutral-400">
            Cualquier holder puede auditar el estado del token en el{" "}
            <span className="font-semibold">Dashboard técnico</span> y seguir
            el Market Cap objetivo desde el{" "}
            <span className="font-semibold">Oráculo</span>, ambos conectados al
            contrato de Sepolia.
          </p>
        </div>
      </div>

      {/* CTAs para gente seria */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link href="/dashboard" className="btn btn-primary text-sm">
          Ver Dashboard técnico
        </Link>
        <Link
          href="/buy"
          className="btn text-sm border border-[#f5c84b]/70 bg-[#f5c84b]/10 hover:bg-[#f5c84b]/20 text-[#f5c84b]"
        >
          Probar compra demo
        </Link>
        <Link
          href="/oraculo"
          className="btn text-sm border border-neutral-700/70 bg-neutral-900/60 hover:bg-neutral-800/80"
        >
          Ver Oráculo y Market Cap
        </Link>
        <a
          href="https://github.com/xcoincorporation/xcoin"
          target="_blank"
          rel="noreferrer"
          className="text-xs text-neutral-500 hover:text-neutral-300 underline-offset-4 hover:underline"
        >
          Ver repositorio y contratos
        </a>
      </div>
    </section>
  );
}
