import { NextResponse } from "next/server";
import { readSaleEvents } from "@/lib/xcoin";
import { ethers } from "ethers";

export async function GET() {
  try {
    // Leemos, por ejemplo, los últimos 1000 bloques
    const events = await readSaleEvents(1000n);

    const enriched = events
      .sort((a, b) => b.blockNumber - a.blockNumber)
      .map((e) => ({
        txHash: e.txHash,
        buyer: e.buyer,
        ethSpent: ethers.formatEther(e.ethSpent),
        tokensBought: ethers.formatUnits(e.tokensBought, 18),
        blockNumber: e.blockNumber,
        timestamp: e.timestamp,
      }));

    const totalEth = enriched.reduce(
      (acc, e) => acc + Number(e.ethSpent),
      0
    );
    const totalTokens = enriched.reduce(
      (acc, e) => acc + Number(e.tokensBought),
      0
    );

    return NextResponse.json({
      ok: true,
      totalEth,
      totalTokens,
      count: enriched.length,
      events: enriched.slice(0, 50),
    });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { ok: false, error: e?.message || "Error leyendo eventos" },
      { status: 500 }
    );
  }
}