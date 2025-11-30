"use client";
import { useEffect, useMemo, useState } from "react";
import { getReadContract } from "@/lib/xcoin";

const TREASURY_ADDR = process.env.NEXT_PUBLIC_TREASURY_ADDR!;

function toHuman(raw: bigint, decimals: number) {
  return Number(raw) / 10 ** decimals;
}
function fmt(n: number, maxFrac = 0) {
  try { return new Intl.NumberFormat("es-AR", { maximumFractionDigits: maxFrac }).format(n); }
  catch { return n.toLocaleString(); }
}

export default function TreasuryDonut() {
  const [decimals, setDecimals] = useState<number>(18);
  const [total, setTotal] = useState<number>(0);
  const [treasury, setTreasury] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      const c = getReadContract();
      const [dec, ts, tbal] = await Promise.all([
        c.decimals(),
        c.totalSupply(),
        c.balanceOf(TREASURY_ADDR),
      ]);
      const d = Number(dec);
      setDecimals(d);
      setTotal(toHuman(ts, d));
      setTreasury(toHuman(tbal, d));
      setErr(null);
    } catch (e: any) {
      setErr(e?.message ?? "Error de lectura on-chain");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15_000); // auto-refresh cada 15s
    return () => clearInterval(id);
  }, []);

  const pctTre = useMemo(() => (total > 0 ? (treasury / total) * 100 : 0), [total, treasury]);
  const pctUsr = useMemo(() => Math.max(0, 100 - pctTre), [pctTre]);

  // SVG donut: 2 arcos sobre un círculo usando strokeDasharray
  const R = 70;                 // radio
  const C = 2 * Math.PI * R;    // circunferencia
  const dashTre = (pctTre / 100) * C;
  const dashUsr = C - dashTre;

  return (
    <div className="rounded-2xl bg-neutral-900/50 border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Distribución actual</h3>
        <span className="text-xs opacity-60">auto-refresh 15s</span>
      </div>

      {loading ? (
        <div className="text-sm opacity-80">Cargando…</div>
      ) : err ? (
        <div className="text-sm text-red-300">⛔ {err}</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 items-center">
          {/* Donut */}
          <div className="flex items-center justify-center">
            <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-90">
              {/* fondo */}
              <circle cx="90" cy="90" r={R} fill="none" stroke="#2b2b2b" strokeWidth="22" />
              {/* usuarios */}
              <circle
                cx="90" cy="90" r={R} fill="none"
                stroke="#3f3f46" strokeWidth="22"
                strokeDasharray={`${dashUsr} ${C}`}
                strokeDashoffset={dashTre}
              />
              {/* tesorería */}
              <circle
                cx="90" cy="90" r={R} fill="none"
                stroke="#f5c84b" strokeWidth="22"
                strokeDasharray={`${dashTre} ${C}`}
                strokeDashoffset={0}
              />
            </svg>
          </div>

          {/* Datos */}
          <div className="space-y-3">
            <div className="text-3xl font-semibold">
              {fmt(total)} <span className="text-sm opacity-70">XCOIN</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#f5c84b" }} />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Tesorería</span>
                  <span className="font-medium">{fmt(treasury)} ({fmt(pctTre, 2)}%)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-block w-3 h-3 rounded-full" style={{ background: "#3f3f46" }} />
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Usuarios / Circulante</span>
                  <span className="font-medium">{fmt(total - treasury)} ({fmt(pctUsr, 2)}%)</span>
                </div>
              </div>
            </div>
            <div className="text-xs opacity-60">
              Objetivo Tesorería: {process.env.NEXT_PUBLIC_TREASURY_PCT ?? 20}% • Dirección: {TREASURY_ADDR.slice(0,6)}…{TREASURY_ADDR.slice(-4)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
