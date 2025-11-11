// frontend/src/components/SupplyBadge.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { getReadContract } from "../lib/xcoin";

const XCOIN_ADDR = process.env.NEXT_PUBLIC_XCOIN_ADDRESS!;
const TREASURY_ADDR = process.env.NEXT_PUBLIC_TREASURY_ADDR!;

/** helpers */
const toHuman = (raw: bigint, decimals: number) => Number(raw) / 10 ** decimals;
const fmt = (n: number, maxFrac = 0) => {
  try { return new Intl.NumberFormat("es-AR", { maximumFractionDigits: maxFrac }).format(n); }
  catch { return n.toLocaleString(); }
};

export default function SupplyBadge() {
  const [open, setOpen] = useState(false);
  const [decimals, setDecimals] = useState(18);
  const [total, setTotal] = useState<number>(0);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const c = getReadContract();
        const [dec, ts] = await Promise.all([c.decimals(), c.totalSupply()]);
        const d = Number(dec);
        setDecimals(d);
        setTotal(toHuman(ts, d));
        setErr(null);
      } catch (e: any) {
        setErr(e?.message ?? "Error de lectura on-chain");
      }
    })();
  }, []);

  const supplyShort = useMemo(() => fmt(total), [total]);

  return (
    <div className="relative z-[70]">
      {/* Botón dentro del header (no fixed) */}
      <button
        onClick={() => setOpen(v => !v)}
        className="inline-flex items-center gap-2 rounded-full bg-neutral-900/80 border border-white/10 px-3 py-1.5 text-sm
                   hover:bg-neutral-800/80 transition shadow"
        title="Detalles on-chain"
      >
        <span className="opacity-80">Supply:</span>
        <span className="font-semibold text-[#f5c84b]">{supplyShort}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" className="opacity-70">
          <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {/* Panel en PORTAL visual (position: fixed) y con offset bajo el navbar */}
      {open && (
        <div
          className="fixed right-4 md:right-6 top-[56px]  // 56px = alto del navbar (h-14). Ajustar si cambias la altura.
                     w-[320px] rounded-xl border border-white/10 bg-[#101010]/95 backdrop-blur
                     shadow-xl z-[80] p-3"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="text-[10px] uppercase tracking-widest text-neutral-400 pb-2">On-chain</div>

          {err ? (
            <div className="text-sm text-red-300 px-1 py-2">⛔ {err}</div>
          ) : (
            <div className="grid gap-2 text-sm">
              <div className="flex items-center justify-between">
                <div className="text-neutral-400">Token</div>
                <div className="font-medium">XCOIN</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-neutral-400">Contrato</div>
                <div className="flex items-center gap-2">
                  <a
                    className="hover:underline"
                    href={`https://sepolia.etherscan.io/address/${XCOIN_ADDR}`} target="_blank" rel="noreferrer"
                  >
                    {XCOIN_ADDR.slice(0, 6)}…{XCOIN_ADDR.slice(-4)}
                  </a>
                  <button
                    className="text-xs opacity-70 hover:opacity-100"
                    onClick={() => navigator.clipboard.writeText(XCOIN_ADDR)}
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-neutral-400">Tesorería</div>
                <div className="flex items-center gap-2">
                  <a
                    className="hover:underline"
                    href={`https://sepolia.etherscan.io/address/${TREASURY_ADDR}`} target="_blank" rel="noreferrer"
                  >
                    {TREASURY_ADDR.slice(0, 6)}…{TREASURY_ADDR.slice(-4)}
                  </a>
                  <button
                    className="text-xs opacity-70 hover:opacity-100"
                    onClick={() => navigator.clipboard.writeText(TREASURY_ADDR)}
                  >
                    Copiar
                  </button>
                </div>
              </div>

              <div className="pt-2 text-xs text-neutral-400">
                Decimals: {decimals} · Total: <span className="text-neutral-200 font-medium">{supplyShort}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
