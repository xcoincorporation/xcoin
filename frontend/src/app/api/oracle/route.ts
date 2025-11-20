import { NextResponse } from "next/server";
import { readBasics } from "@/lib/xcoin";

/**
 * Configuración del oráculo “market-ready”.
 * - priceUsd: precio de referencia por XCOIN (luego puedes enchufar un feed real aquí).
 * - targetMarketCapUsd: objetivo de Market Cap para la Fase 1 de desbloqueo.
 */
const ORACLE_CONFIG = {
  priceUsd: 1,            // US$ 1 por XCOIN (mock configurable)
  targetMarketCapUsd: 5_000_000, // Fase 1: 5M de Market Cap
};

export async function GET() {
  try {
    // 1) Leemos datos on-chain reales del contrato
    const basics = await readBasics();

    const { symbol, decimals, totalSupply } = basics;

    // Pasamos el totalSupply a unidades humanas (ej: 1_000_000 XCOIN)
    const totalSupplyHuman =
      Number(totalSupply) / Math.pow(10, decimals);

    // 2) Tomamos el precio desde la config (fácil de cambiar en el futuro)
    const priceUsd = ORACLE_CONFIG.priceUsd;

    // 3) Calculamos Market Cap y progreso hacia el objetivo
    const marketCapUsd = totalSupplyHuman * priceUsd;
    const targetMarketCapUsd = ORACLE_CONFIG.targetMarketCapUsd;

    const progress =
      targetMarketCapUsd > 0
        ? Math.min(marketCapUsd / targetMarketCapUsd, 1)
        : 0;

    return NextResponse.json({
      ok: true,
      asOf: new Date().toISOString(),
      symbol,
      priceUsd,
      totalSupply: totalSupplyHuman,
      marketCapUsd,
      targetMarketCapUsd,
      progress,
    });
  } catch (err) {
    console.error("[oracle] Error leyendo on-chain:", err);

    // Modo degradado (pero con forma bonita para no romper el front)
    return NextResponse.json(
      {
        ok: false,
        asOf: new Date().toISOString(),
        symbol: "XCOIN",
        priceUsd: ORACLE_CONFIG.priceUsd,
        totalSupply: 1_000_000,
        marketCapUsd: 1_000_000 * ORACLE_CONFIG.priceUsd,
        targetMarketCapUsd: ORACLE_CONFIG.targetMarketCapUsd,
        progress: 1_000_000 * ORACLE_CONFIG.priceUsd / ORACLE_CONFIG.targetMarketCapUsd,
      },
      { status: 200 }
    );
  }
}
