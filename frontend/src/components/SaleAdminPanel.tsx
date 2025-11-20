"use client";

import { useEffect, useState } from "react";
import { getSaleWithSigner, readSaleInfo } from "@/lib/xcoin";
import { useToast } from "@/hooks/useToast";
import { ethers } from "ethers";

export default function SaleAdminPanel() {
  const { toast } = useToast();
  const [isOwner, setIsOwner] = useState(false);
  const [currentPriceEth, setCurrentPriceEth] = useState<string>("");
  const [newPriceEth, setNewPriceEth] = useState<string>("0.0001");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const provider = new ethers.BrowserProvider(
          (window as any).ethereum
        );
        const signer = await provider.getSigner();
        const signerAddr = await signer.getAddress();

        const sale = await getSaleWithSigner();
        const owner = await sale.owner();
        const info = await readSaleInfo();

        setCurrentPriceEth(ethers.formatEther(info.priceWei));
        setIsOwner(
          owner.toLowerCase() === signerAddr.toLowerCase()
        );
      } catch {
        // silencio
      }
    };
    if (typeof window !== "undefined" && (window as any).ethereum) {
      check();
    }
  }, []);

  if (!isOwner) return null;

  async function updatePrice(e: React.FormEvent) {
    e.preventDefault();
    try {
      setBusy(true);
      const sale = await getSaleWithSigner();
      const newPriceWei = ethers.parseEther(newPriceEth);
      const tx = await sale.setPricePerTokenWei(newPriceWei);
      toast("Actualizando precio en contrato…", "info");
      await tx.wait();
      toast("Precio actualizado on-chain ✅", "success");
      setCurrentPriceEth(newPriceEth);
    } catch (e: any) {
      console.error(e);
      toast(
        e?.shortMessage || e?.reason || "No se pudo actualizar el precio",
        "error"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl border border-red-900/60 bg-red-950/20 p-5 space-y-3">
      <h3 className="text-sm font-semibold text-red-100">
        Panel admin de venta (owner)
      </h3>
      <p className="text-[11px] text-red-200/80">
        Sólo visible si la wallet conectada es el owner del contrato de
        venta. Permite ajustar el precio de XCOIN en Sepolia.
      </p>
      <div className="text-xs text-neutral-200">
        Precio actual:{" "}
        <span className="font-semibold">
          {currentPriceEth || "…"} ETH / XCOIN
        </span>
      </div>
      <form onSubmit={updatePrice} className="space-y-2">
        <label className="block text-[11px] text-neutral-300">
          Nuevo precio (ETH por XCOIN)
          <input
            type="number"
            step="0.00001"
            min="0"
            value={newPriceEth}
            onChange={(e) => setNewPriceEth(e.target.value)}
            className="mt-1 w-full rounded-lg bg-neutral-900/80 border border-neutral-700 px-3 py-1.5 text-xs text-white outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400"
          />
        </label>
        <button
          type="submit"
          disabled={busy}
          className="text-xs px-3 py-1.5 rounded-full bg-red-500 text-white font-semibold hover:bg-red-600 disabled:opacity-60"
        >
          {busy ? "Actualizando…" : "Actualizar precio"}
        </button>
      </form>
    </div>
  );
}
