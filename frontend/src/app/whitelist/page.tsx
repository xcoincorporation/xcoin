"use client";

import React from "react";

export default function WhitelistPage() {
  return (
    <main className="min-h-screen bg-[#050711] text-slate-100">
      <section className="mx-auto max-w-4xl px-4 pt-16 pb-10">
        <p className="text-xs uppercase tracking-[0.25em] text-cyan-400">
          whitelist xcoin
        </p>
        <h1 className="mt-3 text-4xl md:text-5xl font-semibold tracking-tight text-slate-50">
          Acceso anticipado al{" "}
          <span className="text-cyan-400">laboratorio XCoin</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm md:text-base text-slate-300">
          Esta whitelist es una lista de interés para seguir de cerca la
          evolución de XCoin en testnet (Sepolia). No representa una
          oferta pública, ni promesa de retorno, ni acceso garantizado a
          ningún tipo de emisión en mainnet.
        </p>
      </section>

      {/* QUE ES */}
      <section className="mx-auto max-w-4xl px-4 pb-10 grid md:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-cyan-700/40 bg-[#070a17] p-4">
          <h3 className="text-sm font-semibold text-cyan-300">
            Actualizaciones tempranas
          </h3>
          <p className="mt-2 text-xs text-slate-300">
            Novedades sobre el laboratorio, mejoras del Dashboard y avances
            del motor de vesting.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-700/40 bg-[#070a17] p-4">
          <h3 className="text-sm font-semibold text-cyan-300">
            Acceso a pruebas cerradas
          </h3>
          <p className="mt-2 text-xs text-slate-300">
            Posible prioridad para participar en futuras pruebas demo
            sobre testnet, sujetas a cupo y a criterios técnicos.
          </p>
        </div>
        <div className="rounded-2xl border border-cyan-700/40 bg-[#070a17] p-4">
          <h3 className="text-sm font-semibold text-cyan-300">
            Transparencia on-chain
          </h3>
          <p className="mt-2 text-xs text-slate-300">
            Comunicación cuando se actualicen contratos, parámetros de
            vesting o métricas clave de adopción.
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="mx-auto max-w-4xl px-4 pb-10">
        <h2 className="text-lg font-semibold text-slate-50">
          Cómo funcionará la whitelist
        </h2>
        <ol className="mt-3 space-y-2 text-sm text-slate-300">
          <li>
            <span className="font-semibold text-cyan-300">Paso 1 —</span>{" "}
            completar el registro cuando se habilite el formulario.
          </li>
          <li>
            <span className="font-semibold text-cyan-300">Paso 2 —</span>{" "}
            recibir confirmación por correo si se aprueba la solicitud
            (sujeto a criterios técnicos y de cumplimiento).
          </li>
          <li>
            <span className="font-semibold text-cyan-300">Paso 3 —</span>{" "}
            participar en actualizaciones, pruebas cerradas o demos que se
            definan para el laboratorio en Sepolia.
          </li>
        </ol>
      </section>

      {/* FORM PLACEHOLDER */}
      <section className="mx-auto max-w-4xl px-4 pb-12">
        <div className="rounded-2xl border border-cyan-700/40 bg-[#070a17] p-6">
          <h3 className="text-base font-semibold text-slate-50">
            Registro de whitelist (laboratorio)
          </h3>
          <p className="mt-2 text-xs text-slate-300">
            El formulario aún no está habilitado. Esta sección refleja
            únicamente el diseño previsto para una futura lista de interés.
          </p>

          <form
            className="mt-5 grid gap-4 md:grid-cols-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-200">
                Correo electrónico
              </label>
              <input
                type="email"
                disabled
                placeholder="nombre@ejemplo.com"
                className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-700/40 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-200">
                País de residencia
              </label>
              <input
                type="text"
                disabled
                placeholder="Argentina, España, etc."
                className="mt-1 w-full rounded-lg bg-black/40 border border-cyan-700/40 px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 cursor-not-allowed"
              />
            </div>
            <div className="md:col-span-2 flex items-start gap-2">
              <input
                type="checkbox"
                disabled
                className="mt-1 h-4 w-4 rounded border-cyan-700/40 bg-black/40 cursor-not-allowed"
              />
              <p className="text-[11px] leading-snug text-slate-400">
                Confirmo que entiendo que XCoin se encuentra en un entorno de
                laboratorio sobre testnet y que esta whitelist no constituye
                oferta de inversión ni garantiza acceso a ninguna emisión en
                mainnet.
              </p>
            </div>
            <div className="md:col-span-2">
              <button
                disabled
                className="w-full md:w-auto rounded-full bg-gradient-to-r from-[#243bff] to-[#00e5ff] px-6 py-2 text-sm font-semibold text-slate-50 opacity-50 cursor-not-allowed"
              >
                Próximamente — whitelist en preparación
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* LEGAL */}
      <section className="mx-auto max-w-4xl px-4 pb-16">
        <p className="text-[11px] leading-relaxed text-slate-500">
          XCoin es un experimento de laboratorio sobre la red de pruebas
          Sepolia. La información presentada en este sitio tiene fines
          educativos y de transparencia técnica. No constituye recomendación
          de inversión, asesoramiento financiero ni oferta pública de valores.
          La participación en cualquier prueba o whitelist estará sujeta a
          requisitos adicionales de cumplimiento y a la normativa aplicable en
          cada jurisdicción.
        </p>
      </section>
    </main>
  );
}
