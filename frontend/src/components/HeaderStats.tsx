"use client";
import { useEffect, useState } from "react";
import { getReadContract } from "../lib/xcoin";

export default function HeaderStats() {

return null; // lo desactivamos por ahora
//   const [stats, setStats] = useState<{symbol:string; total:string}>();

//   useEffect(() => {
//     (async () => {
//       const c = getReadContract();
//       const [symbol, total] = await Promise.all([c.symbol(), c.totalSupply()]);
//       setStats({ symbol, total: total.toString() });
//     })();
//   }, []);

//   return (
//     <div className="text-sm opacity-80">
//       {stats ? <>Token: {stats.symbol} · Supply: {stats.total}</> : "Cargando..."}
//     </div>
//   );
}