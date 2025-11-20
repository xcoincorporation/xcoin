import TokenomicsCard from "@/components/TokenomicsCard";
import TreasuryDonut from "@/components/TreasuryDonut";

export default function TokenomicsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">
          Tokenomics — XCoin
        </h1>
        <p className="text-sm text-neutral-400">
          Distribución 80/20, Tesorería visible on-chain y programa de
          desbloqueo por fases gestionado por el Vault.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          1. Distribución inicial 80/20
        </h2>
        <p className="text-sm text-neutral-300">
          El supply inicial de 1.000.000 XCOIN se asigna respetando la
          regla 80/20 desde el bloque génesis:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>20% — Tesorería (operaciones, liquidez, MM, desarrollo).</li>
          <li>80% — Usuarios, bloqueado en el Vault por fases.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          2. Vista on-chain en tiempo real
        </h2>
        <p className="text-sm text-neutral-300">
          El gráfico muestra cómo está distribuido actualmente el supply
          entre Tesorería y resto de direcciones (circulante/usuarios),
          leyendo directamente del contrato desplegado en Sepolia.
        </p>
        <TreasuryDonut />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          3. Resumen visual
        </h2>
        <TokenomicsCard />
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          4. Precio de referencia
        </h2>
        <p className="text-sm text-neutral-300">
          En el laboratorio, el contrato de venta configura un precio
          fijo inicial expresado en ETH. Ese valor representa un
          equivalente de referencia a 1 USD por XCOIN, pero puede
          ajustarse a medida que se testean distintos escenarios de
          entrada.
        </p>
      </section>
    </div>
  );
}
