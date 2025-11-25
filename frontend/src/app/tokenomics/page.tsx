import TokenomicsCard from "@/components/TokenomicsCard";
import TreasuryDonut from "@/components/TreasuryDonut";
import VestingTable from "@/components/VestingTable";
import VestingCurve from "@/components/VestingCurve";

export default function TokenomicsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-12">

      {/* HEADER */}
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">Tokenomics — XCoin</h1>
        <p className="text-sm text-neutral-400">
          Modelo 80/20, tesorería on-chain y vesting dinámico dependiente del MarketCap.
        </p>
      </header>

      {/* 80/20 */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">1. Distribución inicial 80/20</h2>
        <p className="text-sm text-neutral-300">
          El supply inicial de 1.000.000 XCOIN respeta la regla 80/20 desde el génesis:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>20% — Tesorería (operaciones, liquidez, desarrollo).</li>
          <li>80% — Usuarios, bloqueado en el Vault por vesting.</li>
        </ul>
      </section>

      {/* ON-CHAIN DONUT */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">2. Vista On-Chain</h2>
        <p className="text-sm text-neutral-300">
          Distribución viva del supply entre Tesorería y resto de direcciones (on-chain, Sepolia).
        </p>
        <TreasuryDonut />
      </section>

      {/* TABLE + CURVE */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <VestingTable />
        <VestingCurve />
      </section>

      {/* RESUMEN GENERAL */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">3. Resumen visual</h2>
        <TokenomicsCard />
      </section>

      {/* PRECIO */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">4. Precio de referencia</h2>
        <p className="text-sm text-neutral-300">
          En laboratorio, el contrato de venta define un precio fijo inicial expresado en ETH.
        </p>
      </section>

      {/* CIERRE */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">5. Vesting basado en MarketCap</h2>
        <p className="text-sm text-neutral-300">
          El desbloqueo no depende del tiempo sino del crecimiento económico del ecosistema.
          El sistema avanza de fase automáticamente según el MarketCap reportado por el oráculo.
        </p>
      </section>

    </div>
  );
}
