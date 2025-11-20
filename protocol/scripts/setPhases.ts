import { ethers } from "hardhat";

async function main() {
  const vaultAddr = process.env.VAULT_ADDR;

  if (!vaultAddr) {
    throw new Error("Falta VAULT_ADDR en el .env");
  }

  const phases = [
    { cap: 1_000_000, bps: 1000  }, // 10%
    { cap: 2_000_000, bps: 2000  }, // 20%
    { cap: 4_000_000, bps: 3500  }, // 35%
    { cap: 6_000_000, bps: 5000  }, // 50%
    { cap: 10_000_000, bps: 7500 }, // 75%
    { cap: 20_000_000, bps: 10000}, // 100%
  ];

  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const vault = await ethers.getContractAt("XCoinVault", vaultAddr, deployer);

  // 1) Limpia fases previas (si tu contrato lo permite, sino lo omitimos)
  const currentLength = await vault.phasesLength();
  console.log("Fases actuales:", Number(currentLength));

  if (Number(currentLength) > 0) {
    console.log("⚠️ Eliminación de fases NO soportada en esta versión del Vault.");
    console.log("   → Simplemente agregamos nuevas fases al final.");
  }

  // 2) Agregar nuevas fases
  console.log("\n== Agregando fases institucionales ==\n");

  for (let i = 0; i < phases.length; i++) {
    const p = phases[i];

    const tx = await vault.addPhase(p.cap, p.bps);
    await tx.wait();

    console.log(
      `Fase ${i} creada → cap=${p.cap.toLocaleString()} USD, unlock=${p.bps / 100}%`
    );
  }

  const finalLength = await vault.phasesLength();
  console.log("\nFases finales en Vault:", Number(finalLength));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
