"use client";

import { useEffect, useState } from "react";
import { readWalletInfo, toHuman } from "@/lib/xcoin";
import { useToast } from "@/hooks/useToast";
import { ethers } from "ethers";

export default function DashboardWalletPanel() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [balanceToken, setBalanceToken] = useState<string>("0");
  const [balanceEth, setBalanceEth] = useState<string>("0");

  async function load() {
    try {
      setLoading(true);
      const info = await readWalletInfo();
      setAddress(info.address);
      setBalanceToken(
        toHuman(info.balanceToken, info.decimals, 4)
      );
      setBalanceEth(ethers.formatEther(info.balanceEth));
    } catch (e) {
      console.error(e);
      toast(
        "No se pudo leer el estado de tu wallet. Verificá MetaMask / red.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Carga manual al pulsar botón
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-black/50 p-5 space-y-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-white">
          Mi wallet en XCoin (Sepolia)
        </h3>
        <button
          onClick={load}
          disabled={loading}
          className="text-[11px] px-3 py-1 rounded-full border border-neutral-700 text-neutral-200 hover:border-[#f5c84b] hover:text-[#f5c84b]"
        >
          {loading ? "Actualizando…" : "Leer desde wallet"}
        </button>
      </div>

      {address ? (
        <div className="space-y-2 text-xs text-neutral-300">
          <div>
            <div className="text-neutral-400">Dirección</div>
            <div className="font-mono text-[11px] break-all">
              {address}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-neutral-400">Saldo XCOIN</div>
              <div className="text-sm font-semibold">
                {balanceToken}
              </div>
            </div>
            <div>
              <div className="text-neutral-400">Saldo ETH</div>
              <div className="text-sm font-semibold">
                {Number(balanceEth).toFixed(4)} ETH
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-xs text-neutral-400">
          Conectá MetaMask en Sepolia y pulsa{" "}
          <span className="font-semibold">“Leer desde wallet”</span>{" "}
          para ver tu saldo XCOIN y ETH en este entorno.
        </p>
      )}
    </div>
  );
}
