"use client";

export default function VestingTable() {
  const phases = [
    { mc: "1,000,000 USD", bps: 1000, pct: "10%" },
    { mc: "2,000,000 USD", bps: 2000, pct: "20%" },
    { mc: "4,000,000 USD", bps: 3500, pct: "35%" },
    { mc: "6,000,000 USD", bps: 5000, pct: "50%" },
    { mc: "10,000,000 USD", bps: 7500, pct: "75%" },
    { mc: "20,000,000 USD", bps: 10000, pct: "100%" },
  ];

  return (
    <div className="rounded-xl border border-neutral-800 p-6 bg-neutral-950/40 backdrop-blur-md">
      <h3 className="text-xl font-semibold text-white mb-4">
        Curva de Vesting por MarketCap
      </h3>
      <table className="w-full text-sm text-neutral-300">
        <thead>
          <tr className="text-left border-b border-neutral-800">
            <th className="py-2">MarketCap ≥</th>
            <th className="py-2">Desbloqueo</th>
            <th className="py-2">BPS</th>
          </tr>
        </thead>
        <tbody>
          {phases.map((p, i) => (
            <tr key={i} className="border-b border-neutral-900/50">
              <td className="py-2">{p.mc}</td>
              <td className="py-2">{p.pct}</td>
              <td className="py-2">{p.bps}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
