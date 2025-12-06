"use client";

import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function loadMetrics() {
    try {
      setLoading(true);
      const res = await fetch("/api/sale-analytics", { cache: "no-store" });
      const json = await res.json();

      if (!json.ok) {
        setError(json.reason || "No disponible");
        setMetrics(null);
      } else {
        setMetrics(json.metrics);
        setError(null);
      }
    } catch (err: any) {
      setError("fallo");
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMetrics();
  }, []);

  return (
    <main className="min-h-screen w-full bg-[#050510] px-6 py-12 text-white">

      {/* === TITULO PRINCIPAL === */}
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold tracking-wide text-transparent bg-clip-text 
                       bg-gradient-to-r from-blue-400 to-cyan-300 drop-shadow-[0_0_20px_rgba(0,150,255,0.4)]">
          XCoin Analytics
        </h1>
        <p className="mt-3 text-gray-300">
          Monitoreo en vivo – transparencia total en el “otro lado del bloque”.
        </p>
      </div>

      {/* === LOADING === */}
      {loading && (
        <div className="w-full text-center py-20 text-cyan-300 animate-pulse">
          Cargando métricas en cadena…
        </div>
      )}

      {/* === ERROR === */}
      {!loading && error && (
        <div className="w-full max-w-3xl mx-auto bg-red-900/50 border border-red-500 px-6 py-4
                        rounded-xl text-center shadow-lg shadow-red-700/40">
          <p className="text-red-300 font-semibold">
            No se pudieron cargar las métricas ({error})
          </p>
        </div>
      )}

      {/* === MÉTRICAS === */}
      {!loading && !error && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">

          {/* Tarjeta 1 */}
          <div className="p-6 rounded-xl bg-[#0A0A17] border border-blue-600/30 
                          shadow-[0_0_20px_rgba(0,120,255,0.3)] hover:shadow-[0_0_35px_rgba(0,180,255,0.5)]
                          transition-all">
            <h2 className="text-xl mb-2 text-blue-300">Transacciones (ventana)</h2>
            <p className="text-4xl font-bold text-cyan-300">{metrics.txCount}</p>
          </div>

          {/* Tarjeta 2 */}
          <div className="p-6 rounded-xl bg-[#0A0A17] border border-blue-600/30 
                          shadow-[0_0_20px_rgba(0,120,255,0.3)] hover:shadow-[0_0_35px_rgba(0,180,255,0.5)]
                          transition-all">
            <h2 className="text-xl mb-2 text-blue-300">Compradores únicos</h2>
            <p className="text-4xl font-bold text-cyan-300">{metrics.buyers}</p>
          </div>

          {/* Tarjeta 3 */}
          <div className="p-6 rounded-xl bg-[#0A0A17] border border-blue-600/30
                          shadow-[0_0_20px_rgba(0,120,255,0.3)] hover:shadow-[0_0_35px_rgba(0,180,255,0.5)]
                          transition-all">
            <h2 className="text-xl mb-2 text-blue-300">ETH total (ventana)</h2>
            <p className="text-4xl font-bold text-cyan-300">
              {metrics.totalEth.toLocaleString()}
            </p>
          </div>

        </div>
      )}

      {/* === BOTON REFRESH === */}
      <div className="mt-12 text-center">
        <button
          onClick={loadMetrics}
          className="px-6 py-3 bg-blue-700/40 border border-blue-500 
                     rounded-xl hover:bg-blue-700/60 transition-all
                     shadow-[0_0_15px_rgba(0,150,255,0.4)]">
          Refrescar métricas
        </button>
      </div>

    </main>
  );
}
