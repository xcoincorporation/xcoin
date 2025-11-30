// frontend/src/hooks/useVestingInfo.ts
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { ADDRESS, VAULT_ADDR } from "../lib/xcoin";
import XCoinVaultJSON from "../lib/abi/XCoinVault.json";

const XCoinVaultABI = (XCoinVaultJSON as any).abi || XCoinVaultJSON;

export interface VestingInfo {
  phase: number;
  unlockedPct: number;
  marketCap: number;
  nextTarget: number;
  progressPct: number;
  loading: boolean;
}

const PHASE_TARGETS = [0, 1_000_000, 2_000_000, 4_000_000, 6_000_000, 10_000_000, 20_000_000];

export function useVestingInfo(): VestingInfo {
  const [data, setData] = useState<VestingInfo>({
    phase: 0,
    unlockedPct: 0,
    marketCap: 0,
    nextTarget: 0,
    progressPct: 0,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const vault = new ethers.Contract(
            VAULT_ADDR,
            XCoinVaultABI,
            provider
        );

        let phase = 0, unlockedBps = 0, marketCap = 0;
        
        try {
          const [phaseVal, unlockedVal, marketCapVal] = await vault.getInfo();
          phase = Number(phaseVal);
          unlockedBps = Number(unlockedVal);
          marketCap = Number(marketCapVal);
        } catch (error) {
          console.warn("No se pudo leer getInfo() del vault, usando valores por defecto", error);
          // Valores por defecto si el contrato no responde
          phase = 0;
          unlockedBps = 0;
          marketCap = 0;
        }

        const unlockedPct = unlockedBps / 100;
        const nextTarget = PHASE_TARGETS[phase + 1] ?? PHASE_TARGETS[PHASE_TARGETS.length - 1];

        const progressPct = Math.min(
          100,
          (marketCap / nextTarget) * 100
        );

        setData({
          phase,
          unlockedPct,
          marketCap,
          nextTarget,
          progressPct,
          loading: false,
        });
      } catch (e) {
        console.error("useVestingInfo error:", e);
        setData((d) => ({ ...d, loading: false }));
      }
    }

    load();
  }, []);

  return data;
}
