"use client";

import { useState } from "react";
import { useToast } from "@/hooks/useToast";

export default function WhitelistPage() {
  const { toast } = useToast();
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setBusy(true);
      const res = await fetch("/api/whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, email, note }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Error");
      toast("Registrado en la whitelist demo ✅", "success");
      setAddress("");
      setEmail("");
      setNote("");
    } catch (e: any) {
      toast(
        e?.message || "No se pudo registrar en la whitelist",
        "error"
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Whitelist — Laboratorio XCoin
        </h1>
        <p className="text-sm text-neutral-400 mt-1">
          Esta whitelist es experimental y se utiliza para simular
          procesos de pre-registro antes de un lanzamiento real.
        </p>
      </div>

      <form
        onSubmit={onSubmit}
        className="space-y-4 rounded-2xl border border-neutral-800 bg-black/60 p-5"
      >
        <label className="block text-xs text-neutral-300">
          Dirección de wallet (Ethereum)
          <input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="0x..."
            className="mt-1 w-full rounded-lg bg-neutral-900/80 border border-neutral-700 px-3 py-2 text-sm text-white outline-none focus:border-[#f5c84b] focus:ring-1 focus:ring-[#f5c84b]"
          />
        </label>

        <label className="block text-xs text-neutral-300">
          Email de contacto
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="mt-1 w-full rounded-lg bg-neutral-900/80 border border-neutral-700 px-3 py-2 text-sm text-white outline-none focus:border-[#f5c84b] focus:ring-1 focus:ring-[#f5c84b]"
          />
        </label>

        <label className="block text-xs text-neutral-300">
          Notas (opcional)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg bg-neutral-900/80 border border-neutral-700 px-3 py-2 text-sm text-white outline-none focus:border-[#f5c84b] focus:ring-1 focus:ring-[#f5c84b]"
          />
        </label>

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-[#f5c84b] text-black font-semibold text-sm py-2.5 hover:brightness-95 disabled:opacity-60"
        >
          {busy ? "Enviando…" : "Registrarme en la whitelist demo"}
        </button>

        <p className="text-[11px] text-neutral-500">
          Los datos se almacenan en memoria en este entorno local. En un
          despliegue real se integraría una base de datos y validaciones
          adicionales (KYC, límites, etc.).
        </p>
      </form>
    </div>
  );
}
