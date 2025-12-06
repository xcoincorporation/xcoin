"use client";

import Link from "next/link";

export default function InvestorCTA() {
  return (
    <section className="w-full bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950/95 py-10 pb-14 lg:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 lg:px-10">
        {/* Título + subtítulo */}
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
            XCoin · El otro lado del bloque
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-50 drop-shadow-[0_0_30px_rgba(56,189,248,0.6)] sm:text-4xl">
            Pensado para holders de largo plazo.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300/85">
            XCoin no está diseñado para especulación de minutos. El laboratorio
            prioriza acumulación disciplinada, tesorería estable y métricas
            on-chain públicas antes de cualquier listado en exchanges.
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {/* Entrada */}
          <div className="group rounded-3xl border border-cyan-500/25 bg-slate-950/90 p-5 shadow-[0_0_26px_rgba(56,189,248,0.35)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-cyan-300">
              Entrada
            </p>
            <h3 className="mt-2 text-sm font-semibold text-slate-50">
              Precio de referencia simple
            </h3>
            <p className="mt-2 text-xs text-slate-300/90">
              Durante la Fase 0 el precio de referencia se fija en{" "}
              <span className="font-semibold text-cyan-200">1 US$ por XCOIN</span>{" "}
              sobre un supply total de 1.000.000. Es un laboratorio en Sepolia,
              no un listado comercial todavía.
            </p>
          </div>

          {/* Protección */}
          <div className="group rounded-3xl border border-emerald-400/25 bg-slate-950/90 p-5 shadow-[0_0_26px_rgba(52,211,153,0.35)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-emerald-300">
              Protección
            </p>
            <h3 className="mt-2 text-sm font-semibold text-slate-50">
              Diseño anti pump & dump
            </h3>
            <p className="mt-2 text-xs text-slate-300/90">
              El modelo 80/20 reserva 200.000 XCOIN en tesorería (20%) y
              800.000 XCOIN para usuarios (80%). Los hitos de desbloqueo y
              vesting se definen en el whitepaper para desalinear ciclos cortos
              de venta masiva.
            </p>
          </div>

          {/* Transparencia */}
          <div className="group rounded-3xl border border-indigo-400/30 bg-slate-950/90 p-5 shadow-[0_0_30px_rgba(129,140,248,0.4)] transition-transform duration-300 group-hover:-translate-y-0.5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-indigo-300">
              Transparencia
            </p>
            <h3 className="mt-2 text-sm font-semibold text-slate-50">
              Métricas on-chain y oráculo público
            </h3>
            <p className="mt-2 text-xs text-slate-300/90">
              Cualquier holder puede auditar el estado del token en el
              Dashboard técnico y seguir el MarketCap objetivo desde el
              Oráculo, ambos conectados al contrato de Sepolia.
            </p>
          </div>
        </div>

        {/* Botones CTA */}
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/dashboard"
            className="rounded-full bg-cyan-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.8)] transition hover:bg-cyan-400"
          >
            Ver Dashboard técnico
          </Link>

          <Link
            href="/comprar-demo"
            className="rounded-full border border-emerald-400/60 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/90 hover:bg-emerald-500/10"
          >
            Probar compra demo
          </Link>

          <Link
            href="/oraculo"
            className="rounded-full border border-indigo-400/60 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200/90 hover:bg-indigo-500/10"
          >
            Ver Oráculo y MarketCap
          </Link>
        </div>
      </div>
    </section>
  );
}
