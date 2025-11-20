import BuyXCoinButton from "@/components/BuyXCoinButton";
import TreasuryDonut from "@/components/TreasuryDonut";

export default function BuyPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-10">
      <section className="space-y-4">
        <h1 className="text-2xl md:text-3xl font-semibold text-white">
          Entrada demo a XCoin
        </h1>
        <p className="text-sm text-neutral-400 max-w-2xl">
          Esta sección permite simular compras de{" "}
          <span className="font-semibold">XCOIN</span> sobre el contrato de
          venta en{" "}
          <span className="font-mono text-xs bg-neutral-900 px-1.5 py-0.5 rounded">
            Sepolia
          </span>
          . Todo es experimental: precios, supply y desbloqueos podrán
          ajustarse antes de cualquier despliegue en mainnet.
        </p>
      </section>

      <div className="grid gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,2fr)] items-start">
        <BuyXCoinButton />

        <div className="space-y-4">
          <TreasuryDonut />
          <p className="text-[11px] text-neutral-500 leading-relaxed">
            El laboratorio mantiene la lógica 80/20:{" "}
            20% tesorería, 80% destinado a usuarios, con vesting
            gestionado por el Vault y oráculo. La venta demo sólo mueve
            el balance circulante; la tesorería y el vault quedan
            visibles pero controlados por contrato.
          </p>
        </div>
      </div>
    </div>
  );
}
