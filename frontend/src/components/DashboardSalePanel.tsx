"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { readSaleInfo, readTreasuryEth, toHuman } from "@/lib/xcoin";
import { useToast } from "@/hooks/useToast";

type Info = {
  priceEth: string;
  tokensInSale: string;
  saleAddress: string;
  treasuryEth: string;
};

type Analytics = {
  txCount: number;
  uniqueBuyers: number;
  totalEthFormatted: string;
  totalTokensFormatted: string;
  avgEthFormatted: string;
  avgTokensFormatted: string;
  lastBuyer: string | null;
  lastTokensFormatted: string | null;
};

export default function DashboardSalePanel() {
  const { toast } = useToast();

  const [info, setInfo] = useState<Info | null>(null);
  const [loadingInfo, setLoadingInfo] = useState<boolean>(false);

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState<boolean>(false);

  // === Carga de precio, stock y tesorería ===
  async function loadInfo() {
    try {
      setLoadingInfo(true);

      const [sale, treasuryWei] = await Promise.all([
        readSaleInfo(),
        readTreasuryEth(),
      ]);

      const priceEth =
        sale.priceWei > 0n ? ethers.formatEther(sale.priceWei) : "0";

      const tokensInSale = toHuman(
        sale.tokensInSale,
        sale.decimals
      );

      const treasuryEthNum = Number(
        ethers.formatEther(treasuryWei)
      ).toFixed(4);

      setInfo({
        priceEth,
        tokensInSale,
        saleAddress: sale.saleAddress,
        treasuryEth: treasuryEthNum,
      });
    } catch (e: any) {
      console.error("DashboardSalePanel.loadInfo error", e);
      toast(
        "No se pudo leer el estado de la venta. Verificá RPC / SALE_ADDR.",
        "error"
      );
    } finally {
      setLoadingInfo(false);
    }
  }

  // === Carga de analytics desde /api/sale-analytics ===
  async function loadAnalytics() {
    try {
      setLoadingAnalytics(true);

      const res = await fetch("/api/sale-analytics", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      // Si el backend no pudo calcular métricas, lo tratamos como "sin datos",
      // NO como error: dejamos el panel en estado neutro sin mostrar toast rojo.
      if (!data.ok || !data.metrics) {
        console.warn(
          "[DashboardSalePanel] métricas no disponibles",
          data.reason ?? "metrics-empty"
        );
        setAnalytics(null);
        return; // salimos SIN lanzar error
      }

      const m = data.metrics;

      setAnalytics({
        txCount: m.txCount ?? 0,
        uniqueBuyers: m.buyers ?? 0,
        totalEthFormatted: String(m.totalEth ?? 0),
        totalTokensFormatted: String(m.totalXcoin ?? 0),
        avgEthFormatted: String(m.avgEth ?? 0),
        avgTokensFormatted: String(m.avgTokens ?? 0),
        lastBuyer: m.lastBuyer ?? null,
        lastTokensFormatted: m.lastTokens ?? null,
      });

    } catch (e: any) {
      console.error("DashboardSalePanel.loadAnalytics error", e);
      setAnalytics(null);
      toast(
        "No se pudieron cargar las métricas de la venta (analytics).",
        "error"
      );
    } finally {
      setLoadingAnalytics(false);
    }
  }


  useEffect(() => {
    loadInfo();
    loadAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-2xl border border-neutral-800 bg-black/60 p-6 space-y-4">
      <h2 className="text-base font-semibold text-white">
        Estado de la venta (demo Sepolia)
      </h2>
      <p className="text-xs text-neutral-400">
        Lectura en vivo del contrato{" "}
        <span className="font-mono text-[11px]">XCoinSaleV2</span>{" "}
        desplegado en <span className="font-semibold">Sepolia</span>.
        Este módulo es sólo para laboratorio; no representa una oferta
        real al público.
      </p>

      {/* Bloque principal: precio + stock + tesorería */}
      {loadingInfo && (
        <div className="text-sm text-neutral-400">
          Leyendo precio, stock y tesorería…
        </div>
      )}

      {!loadingInfo && info && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl bg-neutral-900/70 p-3">
              <div className="text-[11px] text-neutral-400">
                Precio actual
              </div>
              <div className="text-sm font-semibold text-[#f5c84b]">
                {info.priceEth} ETH / XCOIN
              </div>
              <div className="mt-1 text-[11px] text-neutral-500">
                Mantenido fijo para la demo de laboratorio.
              </div>
            </div>

            <div className="rounded-xl bg-neutral-900/70 p-3">
              <div className="text-[11px] text-neutral-400">
                Stock en contrato de venta
              </div>
              <div className="text-sm font-semibold">
                {info.tokensInSale} XCOIN
              </div>
              <div className="mt-1 text-[11px] text-neutral-500">
                Tokens disponibles en el contrato de venta actual.
              </div>
            </div>

            <div className="rounded-xl bg-neutral-900/70 p-3">
              <div className="text-[11px] text-neutral-400">
                ETH en Tesorería (Sepolia)
              </div>
              <div className="text-sm font-semibold">
                {Number(info.treasuryEth).toFixed(4)} ETH
              </div>
              <div className="mt-1 text-[11px] text-neutral-500">
                Balance de ETH de la dirección de tesorería en la red
                de prueba.
              </div>
            </div>
          </div>

          <div className="text-[11px] text-neutral-500 font-mono break-all">
            Sale: {info.saleAddress}
          </div>
        </div>
      )}

      {/* Bloque de analytics con separación visual */}
      <div className="mt-4 pt-4 border-t border-neutral-800">
        <h3 className="text-xs font-semibold text-neutral-200 mb-2">
          Métricas de compra (ventana reciente)
        </h3>

        {loadingAnalytics && (
          <div className="text-xs text-neutral-400">
            Calculando métricas de la venta…
          </div>
        )}

        {!loadingAnalytics && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs text-neutral-300">
            <div>
              <div className="text-[11px] text-neutral-400">
                Total vendido (aprox.)
              </div>
              <div className="text-sm font-semibold">
                {analytics.totalTokensFormatted} XCOIN
              </div>
            </div>

            <div>
              <div className="text-[11px] text-neutral-400">
                Compradores únicos
              </div>
              <div className="text-sm font-semibold">
                {analytics.uniqueBuyers}
              </div>
            </div>

            <div>
              <div className="text-[11px] text-neutral-400">
                Tickets (transacciones)
              </div>
              <div className="text-sm font-semibold">
                {analytics.txCount}
              </div>
              <div className="text-[11px] text-neutral-500 mt-1">
                Promedio: {analytics.avgEthFormatted} ETH /{" "}
                {analytics.avgTokensFormatted} XCOIN
              </div>
            </div>

            <div>
              <div className="text-[11px] text-neutral-400">
                Última compra registrada
              </div>
              {analytics.lastBuyer ? (
                <>
                  <div className="text-[11px] font-mono break-all">
                    {analytics.lastBuyer}
                  </div>
                  {analytics.lastTokensFormatted && (
                    <div className="text-[11px] text-neutral-500 mt-1">
                      {analytics.lastTokensFormatted} XCOIN
                    </div>
                  )}
                </>
              ) : (
                <div className="text-[11px] text-neutral-500">
                  Sin compras en la ventana analizada.
                </div>
              )}
            </div>
          </div>
        )}

        {!loadingAnalytics && !analytics && (
          <div className="text-xs text-neutral-500">
            No se pudieron obtener métricas en este momento.
          </div>
        )}
      </div>
    </div>
  );
}
