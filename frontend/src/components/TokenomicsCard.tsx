"use client";
import React from "react";

export default function TokenomicsCard() {
  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-3 text-neutral-300">
        <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
          <div className="text-slate-100 font-semibold">Distribución inicial</div>
          <p className="text-sm mt-1">80% Usuarios (bloqueado por fases) · 20% Tesorería (estabilidad, desarrollo, MM).</p>
        </div>
        <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
          <div className="text-slate-100 font-semibold">Precio de lanzamiento</div>
          <p className="text-sm mt-1">Entrada fija a 1 USD por token.</p>
        </div>
        <div className="rounded-xl bg-carbon p-4 border border-neutral-700">
          <div className="text-slate-100 font-semibold">Oráculo</div>
          <p className="text-sm mt-1">Feed público que publica Market Cap objetivo y activa desbloqueos.</p>
        </div>
      </div>
    </div>
  );
}