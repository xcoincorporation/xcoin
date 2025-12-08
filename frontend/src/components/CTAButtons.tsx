import Link from "next/link";

export function CTAButtons() {
  return (
    <div className="flex flex-wrap gap-3 pt-4">
      <Link
        href="/dashboard"
        className="rounded-full bg-cyan-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.8)] transition hover:bg-cyan-400"
      >
        Ver estado on-chain
      </Link>

      <Link
        href="/whitelist"
        className="rounded-full border border-emerald-400/60 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/90 hover:bg-emerald-500/10"
      >
        Unirme al laboratorio
      </Link>

      <a
        href="#"
        className="rounded-full border border-indigo-400/60 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-200/90 hover:bg-indigo-500/10"
      >
        Seguir actualizaciones
      </a>
    </div>
  );
}
