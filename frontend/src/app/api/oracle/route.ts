import { NextResponse } from "next/server";
import { readBasics } from "../../../lib/xcoin";

// Pequeño helper seguro para convertir BigInt -> number
function bigToNumber(value: bigint, decimals: number): number {
  const base = 10n ** BigInt(decimals);
  const whole = Number(value / base);       // parte entera
  const frac = Number(value % base) / Number(base); // fracción
  return whole + frac;
}

export async function GET() {
  try {
    const basics = await readBasics();

    // Por ahora usamos un precio de referencia fijo (mock)
    const priceUsd = 1; // 1 USD por XCOIN (placeholder)
    const supplyHuman = bigToNumber(basics.totalSupply, basics.decimals);

    const marketCapUsd = supplyHuman * priceUsd;

    // Objetivo de Market Cap para primer desbloqueo (ejemplo)
    const targetMarketCapUsd = 5_000_000; // 5M USD
    const progress = marketCapUsd / targetMarketCapUsd;

    return NextResponse.json({
      ok: true,
      asOf: new Date().toISOString(),
      symbol: basics.symbol,
      priceUsd,
      totalSupply: supplyHuman,
      marketCapUsd,
      targetMarketCapUsd,
      progress, // 0–1
    });
  } catch (e) {
    console.error("[oracle] error leyendo on-chain", e);

    // Fallback totalmente mock si algo falla
    const priceUsd = 1;
    const totalSupply = 1_000_000;
    const marketCapUsd = priceUsd * totalSupply;
    const targetMarketCapUsd = 5_000_000;

    return NextResponse.json({
      ok: false,
      error: "oracle_unavailable",
      asOf: new Date().toISOString(),
      symbol: "XCOIN",
      priceUsd,
      totalSupply,
      marketCapUsd,
      targetMarketCapUsd,
      progress: marketCapUsd / targetMarketCapUsd,
    });
  }
}
