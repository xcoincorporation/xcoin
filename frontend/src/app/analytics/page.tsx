"use client";

import { useEffect, useState } from "react";

type EventRow = {
  txHash: string;
  buyer: string;
  ethSpent: string;
  tokensBought: string;
  blockNumber: number;
  timestamp: number;
};

type Data = {
  ok: boolean;
  totalEth: number;
  totalTokens: number;
  count: number;
  events: EventRow[];
};

export default function AnalyticsPage() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/sale-analytics");
      const json = await res.json();
      if (json.ok) setData(json);
    };
    load();
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Analytics de XCoin (demo Sepolia)
        </h1>
        <p className="text-sm text-neutral-400">
          Resumen de compras registradas en el contrato de venta
          XCoinSale, leído directamente de los eventos on-chain.
        </p>
      </div>

      {data ? (
        <>
          <div className="grid gap-4 md:grid-cols-3 text-sm">
            <div className="rounded-2xl border border-neutral-800 bg-black/60 p-4 space-y-1">
              <div className="text-xs text-neutral-400">
                Volumen total (ETH)
              </div>
              <div className="text-lg font-semibold text-[#f5c84b]">
                {data.totalEth.toFixed(4)} ETH
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black/60 p-4 space-y-1">
              <div className="text-xs text-neutral-400">
                Tokens vendidos
              </div>
              <div className="text-lg font-semibold text-white">
                {data.totalTokens.toLocaleString("es-AR")} XCOIN
              </div>
            </div>
            <div className="rounded-2xl border border-neutral-800 bg-black/60 p-4 space-y-1">
              <div className="text-xs text-neutral-400">
                Compras registradas
              </div>
              <div className="text-lg font-semibold text-white">
                {data.count}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-800 bg-black/60 p-4 overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th className="text-left py-2">Buyer</th>
                  <th className="text-left py-2">ETH</th>
                  <th className="text-left py-2">XCOIN</th>
                  <th className="text-left py-2">Block</th>
                  <th className="text-left py-2">Tx</th>
                </tr>
              </thead>
              <tbody className="text-neutral-200">
                {data.events.map((e) => (
                  <tr key={e.txHash} className="border-b border-neutral-900">
                    <td className="py-2 font-mono text-[11px]">
                      {e.buyer}
                    </td>
                    <td className="py-2">{Number(e.ethSpent).toFixed(4)}</td>
                    <td className="py-2">
                      {Number(e.tokensBought).toLocaleString("es-AR")}
                    </td>
                    <td className="py-2">{e.blockNumber}</td>
                    <td className="py-2 font-mono text-[11px] break-all">
                      {e.txHash}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <p className="text-sm text-neutral-400">
          Leyendo eventos del contrato de venta…
        </p>
      )}
    </div>
  );
}
