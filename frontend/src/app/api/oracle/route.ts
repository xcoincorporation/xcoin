import { NextResponse } from "next/server";
import { ethers } from "ethers";
import { getReadContract, RPC } from "@/lib/xcoin";

export const runtime = "nodejs";

/**
 * Oráculo de MarketCap para el laboratorio XCoin.
 *
 * Modos:
 * - ORACLE_MODE=mock (default): devuelve un MarketCap simulado pero estable.
 * - ORACLE_MODE=coingecko: lee precio en USD desde CoinGecko (o API compatible)
 *   y lo multiplica por el totalSupply on-chain del token.
 *
 * El front y los scripts (syncMarketCap.ts) sólo necesitan la clave
 * marketCapUsd del JSON de respuesta.
 */

const MODE = process.env.ORACLE_MODE ?? "mock";
const COINGECKO_URL =
  process.env.ORACLE_COINGECKO_URL ??
  "https://api.coingecko.com/api/v3/simple/price";
const COINGECKO_ID = process.env.ORACLE_COINGECKO_ID ?? "ethereum";
const TARGET_MARKETCAP =
  Number(process.env.ORACLE_TARGET_MARKETCAP_USD ?? "20000000"); // 20M por defecto
const MAX_CHANGE_PCT =
  Number(process.env.ORACLE_MAX_DAILY_CHANGE_PCT ?? "50"); // 50% diario como límite suave

async function getOnChainSupplyInfo() {
  if (!RPC) {
    throw new Error("NEXT_PUBLIC_RPC_URL (RPC) no está configurado.");
  }

  const token = getReadContract();
  const [decimals, totalSupply] = await Promise.all([
    token.decimals(),
    token.totalSupply(),
  ]);

  const decimalsNum = Number(decimals);
  const totalSupplyTokens = Number(
    ethers.formatUnits(totalSupply, decimalsNum)
  );

  return {
    decimals: decimalsNum,
    totalSupplyRaw: totalSupply.toString(),
    totalSupplyTokens,
  };
}

async function getMockMarketCap() {
  // Curva simulada basada en el tiempo, determinista y suave
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const base = TARGET_MARKETCAP * 0.3; // 30% del target como base
  const variation = TARGET_MARKETCAP * 0.2 * Math.sin(now / day); // +/-20% del target
  const marketCapUsd = Math.max(0, base + variation);

  return {
    mode: "mock",
    priceUsd: 1, // irrelevante en este modo
    marketCapUsd,
  };
}

async function getCoingeckoMarketCap(prevCap?: number) {
  const { totalSupplyTokens } = await getOnChainSupplyInfo();

  const url = `${COINGECKO_URL}?ids=${encodeURIComponent(
    COINGECKO_ID
  )}&vs_currencies=usd`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} al consultar CoinGecko`);
  }

  const json = await res.json();
  const priceUsd = Number(json?.[COINGECKO_ID]?.usd ?? 0);

  if (!priceUsd || !Number.isFinite(priceUsd)) {
    throw new Error("Precio USD inválido desde CoinGecko");
  }

  const rawCap = priceUsd * totalSupplyTokens;

  // Suavizado opcional: limitamos el cambio relativo respecto al valor anterior
  if (prevCap && prevCap > 0 && Number.isFinite(prevCap)) {
    const diff = rawCap - prevCap;
    const maxDelta = (Math.abs(prevCap) * MAX_CHANGE_PCT) / 100;

    if (Math.abs(diff) > maxDelta) {
      const clamped = prevCap + Math.sign(diff) * maxDelta;
      return {
        mode: "coingecko-clamped",
        priceUsd,
        marketCapUsd: clamped,
      };
    }
  }

  return {
    mode: "coingecko",
    priceUsd,
    marketCapUsd: rawCap,
  };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prevCapParam = searchParams.get("prevCap");
    const prevCap = prevCapParam ? Number(prevCapParam) : undefined;

    let payload:
      | { mode: string; priceUsd: number; marketCapUsd: number }
      | null = null;

    if (MODE === "coingecko") {
      try {
        payload = await getCoingeckoMarketCap(prevCap);
      } catch (e) {
        console.error("Fallo modo coingecko, usando mock:", e);
        payload = await getMockMarketCap();
      }
    } else {
      payload = await getMockMarketCap();
    }

    const progress =
      TARGET_MARKETCAP > 0
        ? Math.min(payload.marketCapUsd / TARGET_MARKETCAP, 1)
        : 0;

    return NextResponse.json({
      ok: true,
      mode: payload.mode,
      assetId: COINGECKO_ID,
      priceUsd: payload.priceUsd,
      targetMarketCapUsd: TARGET_MARKETCAP,
      marketCapUsd: payload.marketCapUsd,
      progress,
    });
  } catch (error: any) {
    console.error("api/oracle error:", error);
    // En error grave, devolvemos un mock conservador para no romper el front
    return NextResponse.json(
      {
        ok: false,
        mode: "error-mock",
        priceUsd: 1,
        targetMarketCapUsd: TARGET_MARKETCAP,
        marketCapUsd: TARGET_MARKETCAP * 0.3,
        progress: 0.3,
        error: error?.message || "Error en oráculo de MarketCap",
      },
      { status: 500 }
    );
  }
}
