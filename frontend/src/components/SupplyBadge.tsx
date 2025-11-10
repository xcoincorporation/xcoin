"use client";
import { useEffect, useState } from "react";
import { getReadContract } from "../lib/xcoin";

function toHuman(raw: bigint, decimals: number): number {
  return Number(raw) / 10 ** decimals;
}
function fmt(n: number) {
  try { return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n); }
  catch { return n.toLocaleString(); }
}
function short(addr: string) {
  return addr ? `${addr.slice(0, 6)}…${addr.slice(-4)}` : "—";
}
async function copy(text: string) {
  try { await navigator.clipboard.writeText(text); } catch {}
}

export default function SupplyBadge() {
  const [text, setText] = useState<string>("…");
  const [open, setOpen] = useState(false);
  const [symbol, setSymbol] = useState("XCOIN");
  const [contract] = useState<string>(process.env.NEXT_PUBLIC_XCOIN_ADDRESS || "");
  const [treasury] = useState<string>(process.env.NEXT_PUBLIC_TREASURY_ADDR || "");

  useEffect(() => {
    (async () => {
      try {
        const c = getReadContract();
        const [decimals, totalSupply, sym] = await Promise.all([
          c.decimals(),
          c.totalSupply(),
          c.symbol(),
        ]);
        setSymbol(sym);
        const human = toHuman(totalSupply, Number(decimals));
        setText(fmt(human));
      } catch {
        setText("—");
      }
    })();
  }, []);

  const etherscan = (addr: string) => `https://sepolia.etherscan.io/address/${addr}`;

  return (
    <div className="relative z-[100]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/70 text-sm hover:bg-neutral-700/70 transition"
        title="Detalles on-chain"
      >
        <span className="opacity-80">Supply:</span>
        <span className="font-semibold text-[#f5c84b]">{text}</span>
        <svg width="14" height="14" viewBox="0 0 20 20" className="opacity-70">
          <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 mt-2 w-72 rounded-xl border border-white/10 bg-[#151515] shadow-lg p-3 z-[120]"
          onMouseLeave={() => setOpen(false)}
        >
          <div className="text-xs uppercase opacity-60 mb-2">On-chain</div>

          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span>Token</span>
              <span className="font-medium">{symbol}</span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span>Contrato</span>
              <div className="flex items-center gap-2">
                <a
                  className="underline opacity-90 hover:opacity-100"
                  href={etherscan(contract)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {short(contract)}
                </a>
                <button
                  onClick={() => copy(contract)}
                  className="text-xs px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              <span>Tesorería</span>
              <div className="flex items-center gap-2">
                <a
                  className="underline opacity-90 hover:opacity-100"
                  href={etherscan(treasury)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {short(treasury)}
                </a>
                <button
                  onClick={() => copy(treasury)}
                  className="text-xs px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700"
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
