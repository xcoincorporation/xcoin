// frontend/src/app/roadmap/page.tsx

export const metadata = {
  title: "Roadmap — XCoin",
};

// frontend/src/app/roadmap/page.tsx

export default function RoadmapPage() {
  const phases = [
    {
      id: "F1",
      title: "Fase 1 — Concepción",
      subtitle: "Nombre, manifiesto, marca, narrativa y posicionamiento.",
      bullets: [
        "Definimos el concepto “El otro lado del bloque”.",
        "Diseño de marca XCoin y línea visual general.",
        "Primer borrador de tokenomics 80/20 y caso de uso.",
      ],
    },
    {
      id: "F2",
      title: "Fase 2 — Whitepaper & Legal",
      subtitle:
        "Documento técnico, reglas de vesting 80/20 y análisis de encuadre regulatorio.",
      bullets: [
        "Redacción del whitepaper técnico (versión laboratorio).",
        "Definición de las reglas de desbloqueo por MarketCap.",
        "Revisión de encuadre legal para no ofrecer instrumentos regulados.",
      ],
    },
    {
      id: "F3",
      title: "Fase 3 — Smart Contracts",
      subtitle: "Desarrollo y despliegue en testnet de los contratos base.",
      bullets: [
        "Token ERC-20 XCOIN (supply fijo, regla 80/20).",
        "XCoinVault con vesting dinámico por MarketCap y oráculo integrado.",
        "Módulo de venta XCoinSaleV2 en laboratorio, sin oferta pública.",
      ],
    },
    {
      id: "F4",
      title: "Fase 4 — Web + Dashboard",
      subtitle:
        "Landing multilingua, panel técnico en vivo, vistas de tokenomics y oráculo.",
      bullets: [
        "Dashboard técnico para holders (estado del token y vault en Sepolia).",
        "Vista de tokenomics 80/20 conectada a la tesorería on-chain.",
        "Módulo de Analytics y oráculo de MarketCap en entorno de laboratorio.",
      ],
    },
    {
      id: "F5",
      title: "Fase 5 — Lanzamiento",
      subtitle:
        "Eventual despliegue en mainnet (sujeto a auditoría y marco legal).",
      bullets: [
        "Auditoría de contratos y revisión final del modelo de vesting.",
        "Comunicación internacional y apertura controlada de liquidez.",
        "Seguimiento continuo de métricas de adopción y gobernanza futura.",
      ],
    },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#020617] bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.16),transparent_55%),radial-gradient(circle_at_bottom,_rgba(129,140,248,0.16),transparent_55%)] text-slate-50">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        {/* Cabecera */}
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-400/80">
            Roadmap XCoin
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Del laboratorio a un eventual mainnet
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300/80">
            Esta hoja de ruta describe las fases previstas para XCoin. Hoy todo
            sucede en un entorno de laboratorio sobre Sepolia; cualquier salto a
            mainnet dependerá de auditoría, marco legal y métricas reales de
            adopción.
          </p>
        </header>

        {/* Timeline */}
        <ol className="relative mt-4 space-y-10 border-l border-slate-700/50 pl-6">
          {phases.map((phase, index) => (
            <li key={phase.id} className="relative">
              {/* Punto luminoso */}
              <span className="absolute -left-[11px] mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 ring-2 ring-cyan-400/70">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
              </span>

              <div className="rounded-2xl border border-slate-800/60 bg-slate-900/60 px-5 py-4 shadow-[0_0_35px_rgba(15,23,42,0.9)] backdrop-blur">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-base font-semibold">
                    {phase.title}
                  </h2>
                  <span className="text-[11px] font-mono uppercase tracking-widest text-cyan-400/80">
                    {phase.id}
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-300/85">
                  {phase.subtitle}
                </p>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-200/90">
                  {phase.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-[6px] h-[3px] w-[10px] rounded-full bg-cyan-400/80" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
                {index === 0 && (
                  <p className="mt-3 text-[11px] text-amber-300/80">
                    Estado: <span className="font-semibold">completada</span> —
                    la marca, narrativa y tokenomics base ya están definidos.
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
