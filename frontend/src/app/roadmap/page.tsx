// frontend/src/app/roadmap/page.tsx

export const metadata = {
  title: "Roadmap — XCoin",
};

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <section className="mx-auto max-w-4xl px-4 py-16 md:px-0">
        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight">Roadmap</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Del concepto al lanzamiento. Esta hoja de ruta describe las fases
            previstas para XCoin, desde el laboratorio en testnet hasta un
            eventual despliegue en mainnet.
          </p>
        </header>

        <ol className="relative border-l border-neutral-800 space-y-10 pl-6">
          {/* Fase 1 */}
          <li>
            <div className="absolute -left-2 mt-1 h-3 w-3 rounded-full bg-amber-400" />
            <h2 className="text-lg font-semibold">Fase 1 — Concepción</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Nombre, manifiesto, marca, narrativa y posicionamiento. Definimos
              el concepto “El otro lado del bloque” y la contracara de los
              modelos clásicos de emisión.
            </p>
          </li>

          {/* Fase 2 */}
          <li>
            <div className="absolute -left-2 mt-1 h-3 w-3 rounded-full bg-amber-400" />
            <h2 className="text-lg font-semibold">
              Fase 2 — Whitepaper &amp; Legal
            </h2>
            <p className="mt-1 text-sm text-neutral-400">
              Redacción del whitepaper técnico, reglas de vesting 80/20 y
              análisis de encuadre regulatorio. Esta fase define los límites de
              lo que puede hacerse en mainnet sin ofrecer instrumentos
              regulados.
            </p>
          </li>

          {/* Fase 3 */}
          <li>
            <div className="absolute -left-2 mt-1 h-3 w-3 rounded-full bg-amber-400" />
            <h2 className="text-lg font-semibold">Fase 3 — Smart Contracts</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Desarrollo y despliegue en testnet de:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-neutral-400">
              <li>Token ERC-20 XCOIN (supply fijo, regla 80/20).</li>
              <li>
                XCoinVault con vesting dinámico por MarketCap y oráculo
                integrado.
              </li>
              <li>
                Módulo de venta XCoinSaleV2 en laboratorio, sin oferta pública.
              </li>
            </ul>
          </li>

          {/* Fase 4 */}
          <li>
            <div className="absolute -left-2 mt-1 h-3 w-3 rounded-full bg-amber-400" />
            <h2 className="text-lg font-semibold">Fase 4 — Web + Dashboard</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Landing multilengua, panel técnico en vivo, vistas de tokenomics,
              oráculo y compra demo sobre testnet. Es la fase en la que estás
              ahora mismo probando el laboratorio.
            </p>
          </li>

          {/* Fase 5 */}
          <li>
            <div className="absolute -left-2 mt-1 h-3 w-3 rounded-full bg-amber-400" />
            <h2 className="text-lg font-semibold">Fase 5 — Lanzamiento</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Eventual despliegue en mainnet (sujeto a auditoría y marco legal),
              comunicación internacional, apertura controlada de liquidez y
              seguimiento continuo de métricas de adopción.
            </p>
          </li>
        </ol>
      </section>
    </main>
  );
}
