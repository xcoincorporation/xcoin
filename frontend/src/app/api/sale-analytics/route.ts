import { NextResponse } from "next/server";

export async function GET() {
  // Modo laboratorio: no pegamos al RPC, devolvemos métricas vacías
  return NextResponse.json(
    {
      ok: false,
      reason: "disabled",
      metrics: null,
    },
    { status: 200 }
  );
}
