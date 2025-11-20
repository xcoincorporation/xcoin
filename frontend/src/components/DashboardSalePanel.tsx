"use client";

import { useEffect, useState } from "react";
import {
  readSaleInfo,
  readTreasuryEth,
  toHuman,
} from "@/lib/xcoin";
import { useToast } from "@/hooks/useToast";
import { ethers } from "ethers";

type Info = {
  priceEth: string;
  tokensInSale: string;
  saleAddress: string;
  treasuryEth: string;
};

export default function DashboardSalePanel() {
  const { toast } = useToast();
  const [info, setInfo] = useState<Info | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [sale, treasuryBal] = await Promise.all([
          readSaleInfo(),
          readTreasuryEth(),
        ]);

        const priceEth = ethers.formatEther(sale.priceWei);
        const tokensInSale = toHuman(
          sale.tokensInSale,
          sale.decimals,
          2
        );
        const treasuryEth = ethers.formatEther(treasuryBal);

        setInfo({
          priceEth,
          tokensInSale,
          saleAddress: sale.saleAddress,
          treasuryEth,
        });
      } catch (e) {
        console.error(e);
        toast("No se pudieron leer métricas de la venta", "error");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [toast]);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-black/50 p-5 space-y-3">
      <h3 className="text-sm font-semibold text-white">
        Estado de la venta (demo Sepolia)
      </h3>

      {loading || !info ? (
        <p className="text-xs text-neutral-400">Cargando datos on-chain…</p>
      ) : (
        <div className="grid gap-3 text-xs text-neutral-300 md:grid-cols-2">
          <div>
            <div className="text-neutral-400">Precio actual</div>
            <div className="text-sm font-semibold text-[#f5c84b]">
              {info.priceEth} ETH / XCOIN
            </div>
          </div>
          <div>
            <div className="text-neutral-400">
              Stock en contrato de venta
            </div>
            <div className="text-sm font-semibold">
              {info.tokensInSale} XCOIN
            </div>
          </div>
          <div>
            <div className="text-neutral-400">
              ETH en Tesorería (Sepolia)
            </div>
            <div className="text-sm font-semibold">
              {Number(info.treasuryEth).toFixed(4)} ETH
            </div>
          </div>
          <div className="text-[11px] text-neutral-500 break-all">
            Sale: {info.saleAddress}
          </div>
        </div>
      )}
    </div>
  );
}
