import { NextResponse } from "next/server";

type Entry = {
  address: string;
  email: string;
  note?: string;
  createdAt: number;
};

const store: Entry[] = [];

export async function POST(req: Request) {
  const body = await req.json();
  const { address, email, note } = body || {};

  if (!address || !email) {
    return NextResponse.json(
      { ok: false, error: "Faltan address o email" },
      { status: 400 }
    );
  }

  store.push({
    address,
    email,
    note,
    createdAt: Date.now(),
  });

  console.log("Whitelist entry:", store[store.length - 1]);

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true, entries: store });
}
