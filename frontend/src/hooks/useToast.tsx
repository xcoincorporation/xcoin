"use client";
import React, { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";

type Variant = "info" | "success" | "error";
type Toast = { id: string; message: string; variant: Variant };

type ToastCtx = {
  toast: (message: string, variant?: Variant) => void;
};

const Ctx = createContext<ToastCtx | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, variant: Variant = "info") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, variant }]);
    // autocierre a los 2.6s
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  // Contenedor visual de toasts
  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={[
              "pointer-events-auto min-w-[220px] max-w-[360px] rounded-xl border px-4 py-2 text-sm shadow-lg backdrop-blur",
              t.variant === "success" && "border-emerald-500/30 bg-emerald-600/10 text-emerald-200",
              t.variant === "error" && "border-red-500/30 bg-red-600/10 text-red-200",
              t.variant === "info" && "border-neutral-500/30 bg-neutral-700/20 text-neutral-200",
            ].join(" ")}
          >
            {t.message}
          </div>
        ))}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>");
  return ctx;
}
