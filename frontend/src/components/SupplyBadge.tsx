// frontend/src/components/SupplyBadge.tsx
"use client";
import { useEffect, useState } from "react";
import { getReadContract } from "../lib/xcoin";

function toHuman(raw: bigint, decimals: number): number {
  return Number(raw) / 10 ** decimals;
}
function fmt(n: number) {
  try {
    return new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 }).format(n);
  } catch {
    return n.toLocaleString();
  }
}

export default function SupplyBadge() {
  const [text, setText] = useState<string>("…");

  useEffect(() => {
    (async () => {
      try {
        const c = getReadContract();
        const [decimals, totalSupply] = await Promise.all([c.decimals(), c.totalSupply()]);
        const human = toHuman(totalSupply, Number(decimals));
        setText(fmt(human));
      } catch {
        setText("—");
      }
    })();
  }, []);

  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-800/70 text-sm">
      <span className="opacity-80 mr-1">Supply:</span>
      <span className="font-semibold text-[#f5c84b]">{text}</span>
    </span>
  );
}
