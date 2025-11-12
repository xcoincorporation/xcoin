"use client";
import { useEffect, useState } from "react";
import { readBasics, toHuman } from "../lib/xcoin";
import Skeleton from "./ui/Skeleton";

type Basics = {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  token: string;
  treasury: string;
};

function short(addr: string) {
  return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "—";
}

export default function SupplyBadge() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<Basics | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const basics = await readBasics();
        if (mounted) setData(basics);
      } catch {
        if (mounted) setData(null);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const humanTotal = data ? toHuman(data.totalSupply, data.decimals) : "—";

  return (
    <div className="relative">
      {/* Botón en el header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="btn btn-primary xc-tooltip"
        data-tip="Ver detalles on-chain"
      >
        Supply: <span className="font-semibold ml-1">{humanTotal}</span>
        <svg className="inline-block ml-2 opacity-80" width="10" height="10" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 7l5 5 5-5H5z" />
        </svg>
      </button>

      {/* Panel fijo bajo el navbar */}
      {open && (
        <div className="fixed right-4 top-[56px] w-[320px] rounded-2xl border border-white/10 bg-[#1b1b1b]/95 backdrop-blur shadow-2xl z-[55]">
          <div className="px-4 py-3 border-b border-white/10 text-xs uppercase tracking-wider opacity-80">On-chain</div>

          <div className="p-4 space-y-3 text-sm">
            {/* Token */}
            <div className="flex items-center justify-between">
              <span className="opacity-80">Token</span>
              <div className="flex items-center gap-2">
                {!data ? (
                  <Skeleton w={80} h={16} />
                ) : (
                  <span className="font-medium">{data.symbol}</span>
                )}
              </div>
            </div>

            {/* Contrato */}
            <div className="flex items-center justify-between">
              <span className="opacity-80">Contrato</span>
              <div className="flex items-center gap-2">
                {!data ? (
                  <Skeleton w={130} h={16} />
                ) : (
                  <>
                    <a
                      className="underline decoration-dotted underline-offset-2 xc-tooltip"
                      data-tip="Abrir en Etherscan"
                      href={`https://sepolia.etherscan.io/address/${data.token}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {short(data.token)}
                    </a>
                    <button
                      className="px-2 py-1 rounded bg-neutral-800/70 hover:bg-neutral-700/70 xc-tooltip"
                      data-tip="Copiar"
                      onClick={() => navigator.clipboard.writeText(data.token)}
                    >
                      Copiar
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Tesorería */}
            <div className="flex items-center justify-between">
              <span className="opacity-80">Tesorería</span>
              <div className="flex items-center gap-2">
                {!data ? (
                  <Skeleton w={130} h={16} />
                ) : (
                  <>
                    <a
                      className="underline decoration-dotted underline-offset-2 xc-tooltip"
                      data-tip="Abrir en Etherscan"
                      href={`https://sepolia.etherscan.io/address/${data.treasury}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {short(data.treasury)}
                    </a>
                    <button
                      className="px-2 py-1 rounded bg-neutral-800/70 hover:bg-neutral-700/70 xc-tooltip"
                      data-tip="Copiar"
                      onClick={() => navigator.clipboard.writeText(data.treasury)}
                    >
                      Copiar
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="pt-2 text-xs opacity-60 text-right">auto-refresh 15s</div>
          </div>
        </div>
      )}
    </div>
  );
}
