"use client";

import React, { useEffect, useState } from "react";
import { getReadContract, readBasics, toHuman } from "../../lib/xcoin";
import DashboardSalePanel from "@/components/DashboardSalePanel";
import DashboardWalletPanel from "@/components/DashboardWalletPanel";
import SaleAdminPanel from "@/components/SaleAdminPanel";

type Basics = Awaited<ReturnType<typeof readBasics>>;
type LoadState = "idle" | "connecting" | "refreshing";

export default function DashboardPage() {
  const [basics, setBasics] = useState<Basics | null>(null);
  const [wallet, setWallet] = useState<string | null>(null);
  const [balance, setBalance] = useState<bigint | null>(null);
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Carga básica del token (nombre, símbolo, supply, tesorería, etc.)
  useEffect(() => {
    (async () => {
      try {
        const b = await readBasics();
        setBasics(b);
      } catch (e) {
        console.error(e);
        setError("No se pudieron leer los datos on-chain del token.");
      }
    })();
  }, []);

  async function ensureBasics() {
    if (basics) return basics;
    const b = await readBasics();
    setBasics(b);
    return b;
  }

  async function loadBalance(addressParam?: string) {
    const addr = addressParam ?? wallet;
    if (!addr) return;

    try {
      const b = await ensureBasics();
      const c = getReadContract();
      const raw = await c.balanceOf(addr);
      setBalance(BigInt(raw.toString()));

      // si por algún motivo aún no tenemos basics, guardamos lo mínimo
      if (!b.totalSupply) {
        setBasics({
          ...b,
          totalSupply: BigInt(raw.toString()),
        });
      }
    } catch (e) {
      console.error(e);
      setError("No se pudo leer el balance de la wallet.");
    }
  }

  async function handleConnect() {
    setError(null);
    const ethereum =
      typeof window !== "undefined" ? (window as any).ethereum : null;

    if (!ethereum) {
      setError("MetaMask no detectado en este navegador.");
      return;
    }

    try {
      setState("connecting");
      const [addr] = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setWallet(addr);
      await loadBalance(addr);
    } catch (e: any) {
      console.error(e);
      setError(e?.message ?? "Error al conectar con MetaMask.");
    } finally {
      setState("idle");
    }
  }

  async function handleRefresh() {
    if (!wallet) return;
    setError(null);
    try {
      setState("refreshing");
      await loadBalance();
    } catch (e) {
      console.error(e);
      setError("No se pudo refrescar el balance.");
    } finally {
      setState("idle");
    }
  }

  function handleDisconnect() {
    setWallet(null);
    setBalance(null);
    setError(null);
  }

  const humanTotal =
    basics && basics.totalSupply
      ? toHuman(basics.totalSupply, basics.decimals, 0)
      : null;

  const humanBalance =
    basics && balance !== null
      ? toHuman(balance, basics.decimals, 3)
      : null;

  const pctSupply =
    basics && balance !== null
      ? Number((balance * 10000n) / basics.totalSupply) / 100
      : null;

  const isBusy = state !== "idle";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-white">
          XCoin Dashboard
        </h1>
        <p className="mt-1 text-sm text-neutral-400">
          Vista técnica para holders: estado on-chain del token y balance
          de tu wallet en Sepolia.
        </p>
      </section>

      {/* Resumen del token */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-[#151515] border border-white/5 p-4">
          <div className="text-xs text-neutral-400">Token</div>
          <div className="mt-1 text-sm font-semibold text-white">
            {basics ? `${basics.name} (${basics.symbol})` : "Cargando…"}
          </div>
          <div className="mt-2 text-xs text-neutral-500">
            Decimals: {basics ? basics.decimals : "--"}
          </div>
        </div>

        <div className="rounded-2xl bg-[#151515] border border-white/5 p-4">
          <div className="text-xs text-neutral-400">Total Supply</div>
          <div className="mt-1 text-sm font-semibold text-white">
            {humanTotal ? `${humanTotal} ${basics?.symbol}` : "Cargando…"}
          </div>
        </div>

        <div className="rounded-2xl bg-[#151515] border border-white/5 p-4">
          <div className="text-xs text-neutral-400">Tesorería</div>
          <div className="mt-1 text-xs font-mono text-neutral-300 truncate">
            {basics ? basics.treasury : "Cargando…"}
          </div>
          {basics && (
            <a
              href={`https://sepolia.etherscan.io/address/${basics.treasury}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-block text-[11px] text-[#f5c84b] hover:underline"
            >
              Ver tesorería en explorer
            </a>
          )}
        </div>
      </section>

      {/* Conexión de wallet */}
      <section className="rounded-2xl bg-[#151515] border border-white/5 p-6 space-y-4">
        <header className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Tu wallet en Sepolia
            </h2>
            <p className="text-xs text-neutral-400">
              Conecta MetaMask para ver tu balance de XCOIN y tu porcentaje del
              supply.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleConnect}
              disabled={isBusy}
              className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {wallet ? "Cambiar wallet" : "Conectar MetaMask"}
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={!wallet || isBusy}
              className="btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Refrescar
            </button>
            <button
              type="button"
              onClick={handleDisconnect}
              disabled={!wallet}
              className="btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Desconectar
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2 mt-6">
            <DashboardSalePanel />
            <DashboardWalletPanel />
          </div>
          <div className="mt-8">
            <SaleAdminPanel />
          </div>

        </header>

        {/* Estado de la wallet */}
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-xs text-neutral-400">Dirección conectada</div>
            <div className="rounded-xl bg-[#111111] border border-white/5 px-3 py-2 text-xs font-mono text-neutral-200 truncate">
              {wallet ?? "Sin conexión"}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-neutral-400">Balance XCOIN</div>
            <div className="rounded-xl bg-[#111111] border border-white/5 px-3 py-2 text-sm text-white">
              {humanBalance && basics
                ? `${humanBalance} ${basics.symbol}`
                : wallet
                ? "Cargando balance…"
                : "—"}
            </div>
            {pctSupply !== null && (
              <div className="text-[11px] text-neutral-400">
                Equivale aproximadamente al{" "}
                <span className="text-[#f5c84b] font-semibold">
                  {pctSupply.toFixed(4)}%
                </span>{" "}
                del supply total.
              </div>
            )}
          </div>
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-400">
            {error}
          </p>
        )}
      </section>
    </div>
  );
}
