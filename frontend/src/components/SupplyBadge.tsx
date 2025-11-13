"use client";

import { useEffect, useRef, useState } from "react";
import { readBasics, toHuman } from "../lib/xcoin";
import { useToast } from "@/hooks/useToast";

/** Anchora el panel al botón, sin solaparse con el navbar */
export default function SupplyBadge() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: bigint;
    token: string;     // address contrato
    treasury: string;  // address tesorería
  } | null>(null);

  const { toast } = useToast();
  const wrapRef = useRef<HTMLDivElement>(null);

  // carga inicial + auto-refresh
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const b = await readBasics();
        setData(b);
      } catch (e: any) {
        toast({ title: "No se pudo leer on-chain", description: e?.message ?? "", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    load();
    const id = setInterval(load, 15_000);
    return () => clearInterval(id);
  }, [toast]);

  // cerrar con click fuera y con Escape
  useEffect(() => {
    const onDocClick = (ev: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(ev.target as Node)) setOpen(false);
    };
    const onEsc = (ev: KeyboardEvent) => ev.key === "Escape" && setOpen(false);
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const niceSupply = data ? toHuman(data.totalSupply, data.decimals) : "—";

  return (
    <div ref={wrapRef} className="relative z-[60]">
      {/* Botón en el header */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="rounded-full bg-[#f5c84b] text-black px-3 py-1 text-sm font-medium shadow hover:brightness-95"
      >
        Supply: {niceSupply}
        <span className="ml-1 align-middle">▾</span>
      </button>

      {/* Panel anclado al botón */}
      <div
        className={[
          "absolute right-0 top-12 w-[340px] md:w-[420px]",
          "rounded-xl border border-white/10 bg-[#0f0f10]/95 backdrop-blur",
          "shadow-xl p-4",
          "transition-all duration-200 ease-out origin-top",
          open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wide text-neutral-400">ON-CHAIN</span>
          <span className="text-[11px] text-neutral-500">auto-refresh 15s</span>
        </div>

        <div className="mt-3 text-sm">
          <div className="text-neutral-400">Token</div>
          <div className="font-semibold">{data?.name ?? "—"} ({data?.symbol ?? "—"})</div>
        </div>

        <div className="mt-3 text-sm">
          <div className="text-neutral-400">Supply</div>
          <div className="font-mono">{loading ? "Cargando…" : niceSupply}</div>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          <div className="text-sm">
            <div className="text-neutral-400">Contrato</div>
            <div className="mt-1 flex items-center gap-2">
              <button
                onClick={() => data?.token && copy(data.token, "Dirección del contrato")}
                className="truncate rounded-lg border border-neutral-700/70 bg-neutral-800/40 px-2 py-1 font-mono text-xs hover:bg-neutral-800/70"
                title={data?.token}
              >
                {data?.token ? `${data.token.slice(0, 6)}…${data.token.slice(-4)}` : "—"}
              </button>
              {data?.token && (
                <a
                  href={`https://sepolia.etherscan.io/address/${data.token}`}
                  target="_blank"
                  className="text-xs text-blue-300 hover:underline"
                >
                  Ver en explorer
                </a>
              )}
            </div>
          </div>

          <div className="text-sm">
            <div className="text-neutral-400">Tesorería</div>
            <div className="mt-1 flex items-center gap-2">
              <button
                onClick={() => data?.treasury && copy(data.treasury, "Dirección de Tesorería")}
                className="truncate rounded-lg border border-neutral-700/70 bg-neutral-800/40 px-2 py-1 font-mono text-xs hover:bg-neutral-800/70"
                title={data?.treasury}
              >
                {data?.treasury ? `${data.treasury.slice(0, 6)}…${data.treasury.slice(-4)}` : "—"}
              </button>
              {data?.treasury && (
                <a
                  href={`https://sepolia.etherscan.io/address/${data.treasury}`}
                  target="_blank"
                  className="text-xs text-blue-300 hover:underline"
                >
                  Ver en explorer
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => window.location.reload()}
            className="rounded-md border border-white/10 bg-neutral-800/60 px-3 py-1 text-sm hover:bg-neutral-800"
          >
            Refrescar
          </button>
          <button
            onClick={() => setOpen(false)}
            className="rounded-md border border-white/10 bg-neutral-800/60 px-3 py-1 text-sm hover:bg-neutral-800"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
