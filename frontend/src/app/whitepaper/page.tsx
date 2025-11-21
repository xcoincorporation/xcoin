export default function WhitepaperPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 space-y-10 text-neutral-200">
      {/* HERO */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#f5c84b]/40 bg-[#141417] px-3 py-1 text-xs text-[#f5c84b]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#f5c84b]" />
          Whitepaper v0.1 · Laboratorio Sepolia · XCoin vs Bitcoin
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-semibold text-white">
            XCoin — La contracara disciplinada de Bitcoin
          </h1>
          <p className="text-sm md:text-base text-neutral-300 leading-relaxed">
            Documento técnico del experimento XCoin. Esta versión corresponde al
            entorno de laboratorio en testnet Sepolia y no representa una oferta
            real ni un instrumento regulado. El objetivo es definir los pilares
            conceptuales, económicos y técnicos de XCoin como contrapunto
            explícito a Bitcoin: un activo con supply fijo, pero con liberación
            dinámica, gobernanza técnica y transparencia total.
          </p>
        </div>

        {/* mini resumen visual */}
        <div className="grid gap-3 md:grid-cols-3 text-xs md:text-sm">
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-1">
            <div className="text-neutral-400">Modelo</div>
            <div className="font-semibold text-white">
              80/20 · Vault + Tesorería
            </div>
            <p className="text-neutral-400 text-xs">
              80% usuarios, 20% tesorería, con desbloqueo por fases ligadas a
              hitos objetivos de mercado.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-1">
            <div className="text-neutral-400">Posicionamiento</div>
            <div className="font-semibold text-white">
              La contracara de Bitcoin
            </div>
            <p className="text-neutral-400 text-xs">
              Si Bitcoin es rígido y estático, XCoin es disciplinado y
              adaptable, sin renunciar a un supply fijo.
            </p>
          </div>
          <div className="rounded-2xl border border-white/5 bg-black/40 p-4 space-y-1">
            <div className="text-neutral-400">Estado</div>
            <div className="font-semibold text-[#f5c84b]">
              Laboratorio · Testnet Sepolia
            </div>
            <p className="text-neutral-400 text-xs">
              Versión experimental. No inversión, no oferta pública. Sandbox
              técnico y económico.
            </p>
          </div>
        </div>
      </header>

      {/* 0. Resumen ejecutivo */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          0. Resumen ejecutivo
        </h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          XCoin es un experimento de acumulación disciplinada diseñado para
          explorar un modelo alternativo a los ciclos tradicionales de
          especulación en cripto. Su principio fundamental puede resumirse en:
        </p>
        <p className="text-sm text-neutral-100 font-semibold">
          “Acumular hoy, liberar mañana, decidir entre todos”.
        </p>
        <p className="text-sm text-neutral-300 leading-relaxed">
          El proyecto establece una distribución base{" "}
          <span className="font-semibold">80/20</span>, un esquema de
          desbloqueo progresivo ligado a hitos verificables on-chain (como
          Market Cap objetivo) y un sistema de transparencia radical a través de
          dashboards técnicos, oráculos y contratos auditables.
        </p>
        <p className="text-sm text-neutral-300 leading-relaxed">
          La versión actual se ejecuta en{" "}
          <span className="font-semibold">testnet Sepolia</span>, donde se
          validan dinámicas, reglas, seguridad y arquitectura antes de
          considerar cualquier versión candidata a mainnet. XCoin no busca
          reemplazar a Bitcoin, sino equilibrarlo, actuando como su contracara
          conceptual.
        </p>
      </section>

      {/* 1. Introducción */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">1. Introducción</h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          El mercado cripto ha crecido con rapidez, pero todavía carga con
          problemas estructurales que afectan la confianza de usuarios e
          inversores:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>Picos especulativos sin fundamento (ciclos de pump &amp; dump).</li>
          <li>Liberaciones desordenadas de tokens que generan volatilidad.</li>
          <li>Proyectos opacos que ocultan la distribución real del supply.</li>
          <li>Falta de disciplina colectiva al sostener un ecosistema.</li>
        </ul>
        <p className="text-sm text-neutral-300 leading-relaxed">
          XCoin nace como un experimento público para demostrar que es posible
          diseñar un sistema más estable, transparente y orientado al largo
          plazo, donde:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>La acumulación tenga reglas claras.</li>
          <li>El desbloqueo sea predecible y verificable.</li>
          <li>La tesorería sea auditable y visible.</li>
          <li>
            Cada movimiento relevante quede anclado en contratos inteligentes.
          </li>
        </ul>
        <p className="text-sm text-neutral-300 leading-relaxed">
          Esta fase inicial es un laboratorio en entorno seguro. No representa
          una recomendación de inversión ni un activo financiero regulado, sino
          un sandbox para validar modelos técnicos y económicos que luego podrán
          escalarse a un entorno de producción.
        </p>
      </section>

      {/* 2. Principios del proyecto */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          2. Principios del proyecto
        </h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          XCoin se fundamenta en cinco principios rectores que guían todas las
          decisiones técnicas y económicas del proyecto.
        </p>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">
            2.1 Acumulación disciplinada
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Los usuarios pueden adquirir tokens bajo reglas claras y
            transparentes. La lógica evita la emisión arbitraria o mecanismos
            inflacionarios inesperados, y prioriza un flujo de entrada legible
            para cualquier participante, con precios y cantidades explícitos.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">
            2.2 Liberación progresiva por hitos
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Los tokens no se liberan todos de inmediato. El desbloqueo ocurre
            por fases asociadas a hitos verificables, como niveles de Market Cap
            reportados por el oráculo. Cada fase define qué porcentaje de los
            grants puede efectivamente reclamarse, reduciendo el riesgo de
            ventas masivas repentinas.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">
            2.3 Transparencia on-chain
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Toda la lógica relevante se apoya en contratos inteligentes y datos
            on-chain: supply, tesorería, compras, eventos de vesting y estado de
            las fases. El dashboard técnico se alimenta directamente de la red,
            sin capas intermedias que puedan distorsionar la información.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">
            2.4 Tesorería visible y regla 80/20
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            El supply total se distribuye con una regla simple y comprobable:
            <span className="font-semibold"> 80% a usuarios</span>, asignado vía
            Vault con desbloqueo por fases, y{" "}
            <span className="font-semibold">20% a Tesorería</span>, destinada a
            estabilidad, liquidez y operaciones. Esta estructura busca alinear
            incentivos entre holders, desarrollo y futuro ecosistema.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white">
            2.5 Gobernanza técnica incremental
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            XCoin no parte de un modelo plenamente descentralizado. En esta
            etapa, el foco está en validar la arquitectura técnica. Sin
            embargo, el roadmap contempla la evolución hacia mecanismos de
            gobierno más robustos: multi-sig para Tesorería, comités técnicos,
            oráculos descentralizados y publicación abierta de cálculos
            críticos.
          </p>
        </div>
      </section>

      {/* 3. El Token XCOIN — la contracara de Bitcoin */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          3. El Token XCOIN — la contracara conceptual de Bitcoin
        </h2>

        {/* 3.1 Propósito */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">
            3.1 Propósito del token
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            XCoin no busca replicar a Bitcoin ni competir en su territorio
            técnico (Proof of Work, escasez absoluta, neutralidad monetaria).
            XCoin representa la otra mitad del paradigma:
          </p>
          <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
            <li>Si Bitcoin es rígido, XCoin es adaptativo.</li>
            <li>Si Bitcoin es estático, XCoin es dinámico.</li>
            <li>
              Si Bitcoin confía en la resistencia, XCoin confía en la curaduría
              y la evolución.
            </li>
          </ul>
          <p className="text-sm text-neutral-300 leading-relaxed">
            En el universo de pares icónicos —Coca vs Pepsi, Ferrari vs
            Lamborghini, AMD vs Intel— la existencia de una contracara
            fortalece a ambos. Ese es el rol de XCoin: ser un contrapunto
            explícito al modelo rígido y monolítico de Bitcoin, sin negar su
            importancia histórica.
          </p>
          <p className="text-sm text-neutral-300 leading-relaxed">
            El objetivo no es reemplazar. El objetivo es equilibrar.
          </p>
        </div>

        {/* 3.2 Especificación técnica */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">
            3.2 Especificación técnica
          </h3>
          <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
            <li>Estándar: ERC-20 (Ethereum, EVM compatible).</li>
            <li>Decimales: 18.</li>
            <li>Supply fijo: 1.000.000 XCOIN.</li>
            <li>Emisión: no existe minting posterior al deploy inicial.</li>
            <li>Burn: sólo mediante funciones explícitas, no automáticas.</li>
            <li>
              Transferencias: sin restricciones salvo las reglas del Vault en
              contextos de vesting.
            </li>
            <li>
              Upgradeabilidad: no; mejoras futuras implicarían versiones
              posteriores (ej. XCOIN v2).
            </li>
          </ul>
          <p className="text-sm text-neutral-300 leading-relaxed">
            El objetivo es mantener un núcleo monetario simple y auditable: el
            token es escaso, legible y estable. La dinámica la aporta el
            ecosistema mediante el Vault, la tesorería y el oráculo.
          </p>
        </div>

        {/* 3.3 Distribución 80/20 */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">
            3.3 Distribución inicial 80/20
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            La distribución inicial es uno de los pilares filosóficos del
            proyecto:
          </p>
          <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
            <li>
              <span className="font-semibold">Usuarios — 80%</span>: bloqueado
              en el Vault para liberarse por etapas. Es una declaración
              explícita de que el motor central del proyecto es la comunidad.
            </li>
            <li>
              <span className="font-semibold">Tesorería — 20%</span>: destinada
              a estabilidad, liquidez inicial, operaciones estratégicas y
              desarrollo futuro, idealmente gestionada bajo esquemas de
              gobernanza y multisig.
            </li>
          </ul>
        </div>

        {/* 3.4 Política monetaria + comparación Bitcoin */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">
            3.4 Política monetaria (XCoin vs Bitcoin)
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            XCoin implementa un modelo monetario rígido en la emisión, pero
            flexible en la liberación.
          </p>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-black/40 text-xs">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-3 py-2 text-left font-semibold text-neutral-200">
                    Componente
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-neutral-200">
                    Bitcoin
                  </th>
                  <th className="px-3 py-2 text-left font-semibold text-neutral-200">
                    XCoin
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="px-3 py-2 text-neutral-300">Emisión</td>
                  <td className="px-3 py-2 text-neutral-400">
                    Determinista, minería
                  </td>
                  <td className="px-3 py-2 text-neutral-400">
                    Fija, sin inflación posterior
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="px-3 py-2 text-neutral-300">Dinámica</td>
                  <td className="px-3 py-2 text-neutral-400">Estática</td>
                  <td className="px-3 py-2 text-neutral-400">
                    Basada en hitos (vesting por fases)
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="px-3 py-2 text-neutral-300">Distribución</td>
                  <td className="px-3 py-2 text-neutral-400">
                    Mineros / mercado
                  </td>
                  <td className="px-3 py-2 text-neutral-400">
                    Usuarios / Tesorería (80/20)
                  </td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="px-3 py-2 text-neutral-300">Liberación</td>
                  <td className="px-3 py-2 text-neutral-400">
                    Permanente, según oferta y demanda
                  </td>
                  <td className="px-3 py-2 text-neutral-400">
                    Por fases condicionadas por oráculo
                  </td>
                </tr>
                <tr>
                  <td className="px-3 py-2 text-neutral-300">Gobernanza</td>
                  <td className="px-3 py-2 text-neutral-400">
                    Prácticamente inexistente a nivel protocolo
                  </td>
                  <td className="px-3 py-2 text-neutral-400">
                    Gobernanza técnica incremental (multi-sig, comités,
                    oráculos)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-sm text-neutral-300 leading-relaxed">
            En términos de diseño, XCoin se posiciona como un “activo
            inteligente”, donde el suministro liberado evoluciona según criterios
            verificables derivados del oráculo, sin alterar el supply total.
          </p>
        </div>

        {/* 3.5–3.8 resumidos */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">
            3.5 Desbloqueo por fases y vesting dinámico
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            Los tokens asignados a los usuarios se liberan gradualmente según un
            conjunto de fases definidas en el Vault, normalmente vinculadas a
            hitos de Market Cap. Cada fase determina un porcentaje de release
            sobre el grant asignado, permitiendo que la oferta efectiva refleje
            la madurez del proyecto.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">3.6 Usos del token</h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            En la fase de laboratorio, el uso principal del token es probar la
            lógica de acumulación, vesting y transparencia. En versiones futuras
            (candidatas a mainnet) se prevén integraciones con liquidez,
            staking, incentivos por holding disciplinado y participación en
            votaciones técnicas.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">
            3.7 Seguridad del contrato
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            El contrato del token se basa en patrones ampliamente auditados
            (OpenZeppelin) y evita complejidades innecesarias: no hay mint
            posterior, no hay funciones ocultas de owner para modificar supply y
            no se usa upgradeabilidad que pueda introducir riesgos
            adicionales. La seguridad se busca por diseño simple y auditable.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white">
            3.8 Riesgos conocidos
          </h3>
          <p className="text-sm text-neutral-300 leading-relaxed">
            El proyecto identifica riesgos técnicos y económicos, incluyendo:
            dependencia del oráculo, dependencia inicial del deployer hasta
            migrar a esquemas multi-sig, liquidez inicial limitada y la
            percepción pública asociada a posicionarse como “contracara” de
            Bitcoin. Estos riesgos se abordan en las fases de seguridad y
            gobernanza del roadmap.
          </p>
        </div>
      </section>

      {/* 4. Arquitectura on-chain (resumen por ahora) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          4. Arquitectura on-chain (resumen)
        </h2>
        <p className="text-sm text-neutral-300 leading-relaxed">
          La arquitectura de XCoin se compone de cuatro piezas principales:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>XCoinToken: contrato ERC-20 principal.</li>
          <li>
            XCoinVault: contrato encargado del vesting y las fases de
            desbloqueo.
          </li>
          <li>
            XCoinSale: contrato de venta controlada de tokens en testnet.
          </li>
          <li>
            Oráculo: capa que publica datos de mercado y activa cambios de fase.
          </li>
        </ul>
        <p className="text-sm text-neutral-300 leading-relaxed">
          El dashboard lee directamente de estos contratos para reflejar el
          estado actual del sistema: balances, supply, compras, eventos y
          evolución de las fases.
        </p>
      </section>

      {/* 5. Regla 80/20 */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          5. Regla 80/20 en detalle
        </h2>
        <p className="text-sm text-neutral-300">
          La lógica 80/20 se implementa desde el deploy inicial:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>20% del supply se asigna directamente a Tesorería.</li>
          <li>80% se bloquea en el Vault para el programa de vesting.</li>
          <li>
            La Tesorería sólo se utiliza bajo reglas futuras (desarrollo,
            liquidez, market making, operaciones del proyecto).
          </li>
        </ul>
      </section>

      {/* 6. Desbloqueo por hitos de Market Cap */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          6. Desbloqueo por hitos de Market Cap
        </h2>
        <p className="text-sm text-neutral-300">
          El Vault controla qué porcentaje del saldo bloqueado está disponible
          para liberar en función de hitos de Market Cap publicados por el
          oráculo. Cada fase vincula:
        </p>
        <ul className="text-sm text-neutral-300 space-y-1 list-disc pl-5">
          <li>Un Market Cap objetivo (en USD o equivalente).</li>
          <li>Un porcentaje desbloqueado del grant asignado.</li>
          <li>Eventos on-chain que actualizan el estado del Vault.</li>
        </ul>
      </section>

      {/* 7. Alcance del laboratorio */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">
          7. Alcance de este laboratorio
        </h2>
        <p className="text-sm text-neutral-300">
          Todo lo desplegado en Sepolia es un entorno experimental. Los
          contratos, precios y reglas pueden cambiar, migrarse o eliminarse sin
          previo aviso. El objetivo es iterar sobre el modelo técnico, UX/UI y
          tokenomics antes de considerar cualquier despliegue en mainnet o
          aproximación a inversores institucionales.
        </p>
      </section>

      {/* 8. Aviso legal */}
      <section className="space-y-3 border-t border-white/5 pt-6">
        <h2 className="text-xl font-semibold text-white">8. Aviso</h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          Este documento no constituye recomendación de inversión, ni oferta
          pública, ni asesoramiento financiero. XCoin es un experimento
          educativo/técnico en redes de prueba. Cualquier versión futura en
          mainnet deberá contar con documentación actualizada, auditoría externa
          y un marco legal específico según la jurisdicción aplicable.
        </p>
      </section>
    </div>
  );
}
