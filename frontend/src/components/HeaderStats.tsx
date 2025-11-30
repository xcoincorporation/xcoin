"use client"; 
import { useEffect, useState } from "react"; 
import { getReadContract } from "@/lib/xcoin"; 
import Skeleton from "./ui/Skeleton"; 

export default function HeaderStats() 

{ const [stats, setStats] = useState<{ symbol: string; total: string } | null>(null); 
useEffect(() => { (async () => { try { const c = getReadContract(); 
  const [symbol, total] = await Promise.all([c.symbol(), c.totalSupply()]); 
  setStats({ symbol, total: total.toString() }); } 
  catch { setStats({ symbol: "XCOIN", total: "—" }); } })();
 }, []); 
 if (!stats) { return ( 
    <div className="flex items-center gap-2 text-sm opacity-80 min-w-[220px]">
      <Skeleton w={110} h={16} /> <Skeleton w={90} h={16} /> 
   </div> ); } 
   
  }