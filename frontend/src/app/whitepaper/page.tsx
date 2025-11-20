export default function WhitepaperPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-white">
          Whitepaper — XCoin (laboratorio Sepolia)
        </h1>
        <p className="text-sm text-neutral-400">
          Documento técnico resumido del experimento XCoin. Esta versión
          corresponde al entorno de laboratorio en testnet Sepolia y no
          representa una oferta real ni un instrumento regulado.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">1. Visión</h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          XCoin es un experimento de acumulación disciplinada. La idea
          central es simple:{" "}
          <span className="font-semibold">
            acumular hoy, liberar mañana, decidir entre todos.
          </span>{" "}
          Los tokens se distribuyen bajo una regla clara 80/20 y un
          esquema de desbloqueo por fases ligado al Market Cap objetivo.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          2. Token (XCOIN)
        </h2>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>Estándar ERC-20 desplegado en testnet Sepolia.</li>
          <li>Supply fijo: 1.000.000 XCOIN.</li>
          <li>
            <strong>80%</strong> asignado a usuarios (vault con vesting) y{" "}
            <strong>20%</strong> a Tesorería.
          </li>
          <li>
            Precio de referencia inicial: <strong>1 USD</strong> por token
            (en entorno demo, expresado en ETH/wei).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          3. Arquitectura on-chain
        </h2>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>Contrato ERC-20 principal (XCoinToken).</li>
          <li>Vault con fases de desbloqueo según Market Cap objetivo.</li>
          <li>Contrato de venta XCoinSale para compras demo en Sepolia.</li>
          <li>Oráculo (API + futuro price feed) para publicar Market Cap.</li>
          <li>Dashboard y landing en Next.js 14 integrados vía ethers.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          4. Regla 80/20
        </h2>
        <p className="text-sm text-neutral-300">
          La lógica 80/20 se implementa desde el deploy inicial:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>20% del supply se asigna directamente a Tesorería.</li>
          <li>80% se bloquea en el Vault para el programa de vesting.</li>
          <li>
            La Tesorería sólo mueve su saldo bajo reglas futuras
            (desarrollo, MM, liquidez inicial, operaciones del proyecto).
          </li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          5. Desbloqueo por hitos de Market Cap
        </h2>
        <p className="text-sm text-neutral-300">
          El Vault controla qué porcentaje del saldo bloqueado está
          disponible para liberar en función de hitos de Market Cap
          publicados por el oráculo. Cada fase vincula:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>Un Market Cap objetivo (en USD).</li>
          <li>Un porcentaje desbloqueado del grant asignado.</li>
          <li>Eventos on-chain que actualizan el estado del Vault.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          6. Alcance de este laboratorio
        </h2>
        <p className="text-sm text-neutral-300">
          Todo lo desplegado en Sepolia es un entorno experimental. Los
          contratos, precios y reglas pueden cambiar, migrarse o
          eliminarse sin previo aviso. El objetivo es iterar sobre el
          modelo técnico, UX/UI y tokenomics antes de considerar
          cualquier despliegue en mainnet.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">7. Aviso</h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Este documento no constituye recomendación de inversión, ni
          oferta pública, ni asesoramiento financiero. XCoin es un
          experimento educativo/técnico en redes de prueba. Cualquier
          versión futura en mainnet deberá contar con documentación,
          auditoría y marco legal específicos.
        </p>
      </section>
    </div>
  );
}
