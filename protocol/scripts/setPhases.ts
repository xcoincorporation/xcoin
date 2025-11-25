import { ethers } from "hardhat";

async function main() {
  const vaultAddr = process.env.VAULT_ADDR;

  if (!vaultAddr) {
    throw new Error("Falta VAULT_ADDR en el .env");
  }

  console.log("Usando XCoinVault en:", vaultAddr);

  const vault = await ethers.getContractAt("XCoinVault", vaultAddr);

  const existing = await vault.phasesLength();
  const existingLen = Number(existing);

  if (existingLen > 0) {
    console.log(
      `⚠ El vault ya tiene ${existingLen} fases configuradas. ` +
        "Este script está diseñado para inicializar un vault limpio. " +
        "Volvé a desplegar el contrato si querés rehacer las fases."
    );
    return;
  }

  // ============================
  // Curva institucional 2025
  // MarketCap en USD (ej: 1_000_000 = 1M)
  // unlockBps = porcentaje acumulado desbloqueado (en basis points)
  // ============================
  const phases: { cap: number; bps: number }[] = [
    { cap: 1_000_000, bps: 500 },   //  5%  – Adopción inicial
    { cap: 2_000_000, bps: 1500 },  // 15%  – Validación de mercado
    { cap: 4_000_000, bps: 3000 },  // 30%  – Crecimiento orgánico
    { cap: 8_000_000, bps: 4500 },  // 45%  – Expansión
    { cap: 15_000_000, bps: 6000 }, // 60%  – Escala
    { cap: 25_000_000, bps: 7500 }, // 75%  – Maduración
    { cap: 40_000_000, bps: 9000 }, // 90%  – Consolidación
    { cap: 60_000_000, bps: 10_000 } // 100% – Full unlock
  ];

  console.log("\nConfigurando fases de vesting...");
  console.log("--------------------------------");

  let lastCap = 0;
  let lastBps = 0;

  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];

    if (p.cap <= lastCap) {
      throw new Error(
        `Cap no creciente en fase ${i}: ${p.cap} <= ${lastCap}`
      );
    }
    if (p.bps <= lastBps) {
      throw new Error(
        `BPS no creciente en fase ${i}: ${p.bps} <= ${lastBps}`
      );
    }

    lastCap = p.cap;
    lastBps = p.bps;

    const tx = await vault.addPhase(p.cap, p.bps);
    await tx.wait();

    console.log(
      `Fase ${i} creada → cap=${p.cap.toLocaleString()} USD, unlock=${
        p.bps / 100
      }%`
    );
  }

  const finalLength = await vault.phasesLength();
  console.log("\nFases finales en Vault:", Number(finalLength));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
