"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { ethers } from "ethers";
import { buyXCoinWithEth, readSaleInfo, toHuman } from "@/lib/xcoin";
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

  // === Carga inicial de info de la venta ===
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoadingInfo(true);
        const info = await readSaleInfo();
        if (!cancelled) setSaleInfo(info);
      } catch (e: any) {
        console.error(e);
        if (!cancelled) {
          const msg =
            e?.message && typeof e.message === "string"
              ? e.message
              : "No se pudo leer el estado de la venta. Verificá SALE_ADDR / RPC.";
          toast(msg, "error");
        }
      } finally {
        if (!cancelled) setLoadingInfo(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [toast]);

  // === Texto de ayuda (precio y stock) ===
  const priceEthText =
    saleInfo && saleInfo.priceWei > 0n
      ? `${ethers.formatEther(saleInfo.priceWei)} ETH por XCOIN (demo)`
      : "Precio fijo de referencia";

  const tokensDisponiblesText =
    saleInfo && saleInfo.tokensInSale > 0n
      ? `${toHuman(
          saleInfo.tokensInSale,
          saleInfo.decimals
        )} XCOIN disponibles en este contrato de venta`
      : "Sin stock asignado al contrato de venta";

  // === Preview de tokens a recibir según el input ===
  const tokensPreview = (() => {
    if (!saleInfo) return "-";

    try {
      const normalized = amountEth.replace(",", ".").trim();
      if (!normalized) return "-";

      const valueWei = ethers.parseEther(normalized);
      if (valueWei <= 0n || saleInfo.priceWei <= 0n) return "-";

      const factor = 10n ** BigInt(saleInfo.decimals);
      const tokens = (valueWei * factor) / saleInfo.priceWei;

      if (tokens <= 0n) return "-";

      return toHuman(tokens, saleInfo.decimals);
    } catch {
      return "-";
    }
  })();

  // === Handler principal de compra ===
  async function onBuy(e: FormEvent) {
    e.preventDefault();

    if (!saleInfo) {
      toast(
        "Todavía no se cargó la información de la venta. Probá de nuevo en unos segundos.",
        "error"
      );
      return;
    }

    if (saleInfo.tokensInSale <= 0n) {
      toast("No hay stock asignado a este contrato de venta.", "error");
      return;
    }

    const normalized = amountEth.replace(",", ".").trim();
    const parsed = Number(normalized);

    if (!isFinite(parsed) || parsed <= 0) {
      toast("Ingresá un monto válido en ETH mayor a 0.", "error");
      return;
    }

    let valueWei: bigint;
    try {
      valueWei = ethers.parseEther(normalized);
    } catch {
      toast("Monto en ETH inválido.", "error");
      return;
    }

    if (saleInfo.priceWei <= 0n) {
      toast("El precio de la venta todavía no está configurado.", "error");
      return;
    }

    const factor = 10n ** BigInt(saleInfo.decimals);
    const estimatedTokens = (valueWei * factor) / saleInfo.priceWei;

    if (estimatedTokens <= 0n) {
      toast(
        "El monto es demasiado pequeño para obtener al menos una fracción de XCOIN.",
        "error"
      );
      return;
    }

    if (estimatedTokens > saleInfo.tokensInSale) {
      toast(
        "No hay stock suficiente en este contrato para ese monto. Reducí el ETH o recargá la página.",
        "error"
      );
      return;
    }

    try {
      setSubmitting(true);
      setTxHash(null);

      const tx = await buyXCoinWithEth(normalized);
      const hash = (tx as any).hash ?? String(tx);
      setTxHash(hash);

      toast(
        "Transacción enviada a Sepolia. Esperá la confirmación en la red de prueba.",
        "info"
      );

      if (typeof (tx as any).wait === "function") {
        await (tx as any).wait();

        // 🔄 refrescar datos de la venta en la misma pantalla
        try {
          const updated = await readSaleInfo();
          setSaleInfo(updated);
        } catch (err) {
          console.error("No se pudo refrescar la venta después de comprar", err);
        }

        toast("Compra confirmada en testnet ✅", "success");
      }
    } catch (e: any) {
      console.error(e);

      let msg =
        e?.shortMessage ||
        e?.reason ||
        e?.message ||
        "No se pudo completar la compra.";

      if (e?.code === "INSUFFICIENT_FUNDS") {
        msg =
          "No tenés suficiente ETH en Sepolia para cubrir el monto y el gas.";
      } else if (e?.code === "ACTION_REJECTED" || e?.code === 4001) {
        msg = "La transacción fue rechazada desde la wallet.";
      } else if (e?.code === "CALL_EXCEPTION") {
        msg =
          "El contrato de venta revirtió la llamada (CALL_EXCEPTION). Revisá que estés en Sepolia, el SALE_ADDR y el monto ingresado.";
      }

      toast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  }

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
        sobre el contrato{" "}
        <span className="font-mono text-[11px]">XCoinSaleV2</span> desplegado en
        Sepolia. No es una oferta real al público.
      </p>

      {loadingInfo ? (
        <div className="text-sm text-neutral-400">Leyendo precio y stock…</div>
      ) : (
        <div className="space-y-1 text-sm text-neutral-300">
          <div>
            <span className="font-semibold">Precio demo: </span>
            <span>{priceEthText}</span>
          </div>
          <div className="text-neutral-400">{tokensDisponiblesText}</div>
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

        <div className="text-xs text-neutral-400">
          Preview estimado:{" "}
          <span className="font-semibold text-[#f5c84b]">
            {tokensPreview} XCOIN
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-[#f5c84b] text-black font-semibold text-sm py-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Enviando compra…" : "Comprar XCOIN (demo)"}
        </button>

        {txHash && (
          <p className="text-[11px] text-neutral-500 break-all mt-1">
            Última tx:{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="underline"
            >
              {txHash}
            </a>
          </p>
        )}
      </form>
    </div>
  );
}
