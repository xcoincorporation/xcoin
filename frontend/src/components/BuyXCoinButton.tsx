"use client";

import { useEffect, useState } from "react";
import { buyXCoinWithEth, readSaleInfo, toHuman } from "../lib/xcoin";
import { useToast } from "@/hooks/useToast";

type SaleInfo = {
  priceWei: bigint;
  decimals: number;
  tokensInSale: bigint;
  saleAddress: string;
};

export default function BuyXCoinButton() {
  const { toast } = useToast();
  const [saleInfo, setSaleInfo] = useState<SaleInfo | null>(null);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(true);
  const [amountEth, setAmountEth] = useState<string>("0.001");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoadingInfo(true);
        const info = await readSaleInfo();
        setSaleInfo(info);
      } catch (e: any) {
        console.error(e);
        toast("No se pudo leer el estado de la venta", "error");
      } finally {
        setLoadingInfo(false);
      }
    };
    load();
  }, [toast]);

  async function onBuy(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setTxHash(null);
      const tx = await buyXCoinWithEth(amountEth);
      toast("Transacción enviada a Sepolia", "info");
      const receipt = await tx.wait();
      setTxHash(tx.hash);
      toast("Compra confirmada en testnet ✅", "success");
      return receipt;
    } catch (e: any) {
      console.error(e);
      const msg =
        e?.shortMessage ||
        e?.reason ||
        e?.message ||
        "No se pudo completar la compra";
      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

  const priceEthText =
    saleInfo && saleInfo.priceWei > 0n
      ? `${Number(saleInfo.priceWei) / 1e18} ETH por XCOIN (demo)`
      : "Precio fijo de referencia";

  const tokensDisponiblesText =
    saleInfo && saleInfo.tokensInSale > 0n
      ? `${toHuman(saleInfo.tokensInSale, saleInfo.decimals)} XCOIN disponibles en este contrato de venta`
      : "Sin stock asignado al contrato de venta";

  return (
    <div className="rounded-2xl border border-neutral-800 bg-black/60 p-6 space-y-4 max-w-md">
      <h2 className="text-lg font-semibold text-white">
        Comprar XCOIN (laboratorio Sepolia)
      </h2>
      <p className="text-xs text-neutral-400">
        Esta vista es un{" "}
        <span className="font-semibold text-[#f5c84b]">
          simulador de compra
        </span>{" "}
        sobre el contrato <span className="font-mono text-[11px]">
          XCoinSale
        </span>{" "}
        desplegado en Sepolia. No es una oferta real al público.
      </p>

      {loadingInfo ? (
        <div className="text-sm text-neutral-400">Leyendo precio y stock…</div>
      ) : (
        <div className="space-y-1 text-sm text-neutral-300">
          <div>
            <span className="font-semibold">Precio demo: </span>
            <span>{priceEthText}</span>
          </div>
          <div className="text-neutral-400">
            {tokensDisponiblesText}
          </div>
          {saleInfo && (
            <div className="text-[11px] text-neutral-500 font-mono break-all">
              Sale: {saleInfo.saleAddress}
            </div>
          )}
        </div>
      )}

      <form onSubmit={onBuy} className="space-y-3 pt-2">
        <label className="block text-xs font-medium text-neutral-300">
          Monto a enviar (ETH, testnet Sepolia)
          <input
            type="number"
            step="0.0001"
            min="0"
            value={amountEth}
            onChange={(e) => setAmountEth(e.target.value)}
            className="mt-1 w-full rounded-lg bg-neutral-900/80 border border-neutral-700 px-3 py-2 text-sm text-white outline-none focus:border-[#f5c84b] focus:ring-1 focus:ring-[#f5c84b]"
          />
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#f5c84b] text-black font-semibold text-sm py-2.5 hover:brightness-95 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Enviando transacción…" : "Comprar XCOIN (demo)"}
        </button>

        <p className="text-[11px] text-neutral-500">
          Necesitás una wallet conectada (MetaMask) en{" "}
          <span className="font-mono">Sepolia</span> y ETH de prueba.
        </p>

        {txHash && (
          <p className="text-[11px] text-emerald-300 break-all">
            Última tx: {txHash}
          </p>
        )}
      </form>
    </div>
  );
}
