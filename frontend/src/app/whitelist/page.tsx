export default function WhitelistPage() {
  return (
    <main className="min-h-screen w-full bg-[#020617] bg-[radial-gradient(circle_at_top,_#0f172a_0,_#020617_45%,_#000_100%)] px-6 py-12 lg:px-10 lg:py-16 text-slate-50">
      <div className="mx-auto max-w-4xl">

        {/* Encabezado */}
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
          Whitelist XCoin · Laboratorio
        </p>
        <h1 className="mt-3 text-3xl font-semibold drop-shadow-[0_0_25px_rgba(56,189,248,0.45)]">
          Inscripción preliminar a pruebas cerradas y actualizaciones clave
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-slate-300/90 leading-relaxed">
          Esta whitelist corresponde al entorno de laboratorio sobre testnet
          (Sepolia). No representa una oferta pública, no garantiza acceso
          privilegiado a emisiones en mainnet y no implica promesa de retorno.
          Su propósito es informar, coordinar pruebas técnicas y comunicar
          avances del proyecto.
        </p>

        {/* Cards explicativas */}
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-cyan-500/30 bg-slate-950/80 p-5 shadow-[0_0_20px_rgba(56,189,248,0.25)]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Actualizaciones tempranas
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-50">
              Notificaciones del laboratorio
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Comunicaciones técnicas sobre mejoras del Dashboard, oráculo,
              métricas on-chain y fases del vesting.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/30 bg-slate-950/80 p-5 shadow-[0_0_20px_rgba(52,211,153,0.25)]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-emerald-300">
              Acceso a pruebas cerradas
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-50">
              Participación técnica opcional
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Invitaciones a tests privados sobre smart contracts, nuevas
              herramientas y módulos experimentales del ecosistema.
            </p>
          </div>

          <div className="rounded-2xl border border-indigo-400/30 bg-slate-950/80 p-5 shadow-[0_0_20px_rgba(129,140,248,0.25)]">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-indigo-300">
              Transparencia on-chain
            </p>
            <p className="mt-2 text-sm font-semibold text-slate-50">
              Seguimiento público del proyecto
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Comunicación sobre actualizaciones críticas del vesting,
              parámetros del oráculo y métricas clave de adopción.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <section className="mt-12 rounded-3xl bg-slate-950/60 p-8 ring-1 ring-slate-800/50 shadow-[0_0_20px_rgba(56,189,248,0.12)]">
          <h2 className="text-xl font-semibold text-slate-50">
            Registro preliminar (laboratorio)
          </h2>
          <p className="mt-2 text-xs text-slate-400">
            Este formulario refleja la versión de diseño. La recopilación de
            datos se activará cuando se inicien las pruebas cerradas.
          </p>

          <form className="mt-6 grid gap-6">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-300">
                Correo electrónico
              </label>
              <input
                disabled
                type="email"
                className="mt-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 placeholder-slate-500 disabled:opacity-50"
                placeholder="nombre@ejemplo.com"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-300">
                País de residencia
              </label>
              <input
                disabled
                type="text"
                className="mt-1 rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-sm text-slate-200 placeholder-slate-500 disabled:opacity-50"
                placeholder="Argentina, España, etc."
              />
            </div>

            <div className="flex items-start gap-3">
              <input
                disabled
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-600 bg-slate-900 disabled:opacity-50"
              />
              <p className="text-xs text-slate-400 leading-relaxed">
                Confirmo que entiendo que XCoin se encuentra en un entorno de
                laboratorio sobre testnet y que esta whitelist no constituye
                oferta de inversión ni garantiza acceso a ningún instrumento en
                mainnet.
              </p>
            </div>

            <button
              disabled
              className="rounded-full bg-cyan-700/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-300 disabled:opacity-50"
            >
              Próximamente — whitelist en preparación
            </button>
          </form>
        </section>

        {/* Legal Final */}
        <p className="mt-10 text-[0.65rem] text-slate-500/80 leading-relaxed">
          XCoin es un experimento técnico de laboratorio sobre la red de
          pruebas Sepolia. El material presentado en este sitio tiene fines
          educativos y de transparencia técnica. No constituye recomendación de
          inversión, asesoramiento financiero ni oferta pública de valores.
          La participación en cualquier prueba o whitelist estará sujeta a
          requisitos adicionales de cumplimiento y a la normativa aplicable en
          cada jurisdicción.
        </p>
      </div>
    </main>
  );
}
