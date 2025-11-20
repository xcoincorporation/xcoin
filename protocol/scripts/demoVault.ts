import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Demo del Vault:
 *  - Muestra balances básicos
 *  - Crea fases si no existen
 *  - Asigna 1000 XCOIN al deployer
 *  - Simula MarketCap = 5M (desbloquea 75%)
 *  - Hace claim() y muestra el balance del deployer
 */
async function main() {
  const tokenAddr = process.env.CONTRACT_ADDR;
  const vaultAddr = process.env.VAULT_ADDR;
  const treasuryAddr = process.env.TREASURY_ADDR;

  if (!tokenAddr || !vaultAddr || !treasuryAddr) {
    throw new Error("Faltan CONTRACT_ADDR, VAULT_ADDR o TREASURY_ADDR en .env");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deployer :", deployer.address);
  console.log("Token    :", tokenAddr);
  console.log("Vault    :", vaultAddr);
  console.log("Treasury :", treasuryAddr);

  // Conectar a los contratos
  const token = await ethers.getContractAt("XCoinToken", tokenAddr, deployer);
  const vault = await ethers.getContractAt("XCoinVault", vaultAddr, deployer);

  // --- 1) Info básica del token ---
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.decimals();
  const totalSupply = await token.totalSupply();

  console.log("\n== Token ==");
  console.log("name        :", name);
  console.log("symbol      :", symbol);
  console.log("decimals    :", decimals);
  console.log("totalSupply :", ethers.formatUnits(totalSupply, decimals));

  // --- 2) Balances básicos ---
  const balVault = await token.balanceOf(vaultAddr);
  const balTreasury = await token.balanceOf(treasuryAddr);
  const balDeployerBefore = await token.balanceOf(deployer.address);

  console.log("\n== Balances iniciales ==");
  console.log("Vault    :", ethers.formatUnits(balVault, decimals));
  console.log("Treasury :", ethers.formatUnits(balTreasury, decimals));
  console.log("Deployer :", ethers.formatUnits(balDeployerBefore, decimals));

  // --- 3) Fases del Vault ---
  let phasesLength = await vault.phasesLength();
  console.log("\n== Fases del Vault antes ==");
  console.log("phasesLength:", phasesLength.toString());

  if (phasesLength === 0n) {
    console.log("No hay fases, agregando fases de ejemplo...");

    const phases = [
      { cap: 1_000_000n, unlockBps: 2500 },  // 25% a partir de 1M
      { cap: 2_500_000n, unlockBps: 5000 },  // 50% a partir de 2.5M
      { cap: 5_000_000n, unlockBps: 7500 },  // 75% a partir de 5M
      { cap: 10_000_000n, unlockBps: 10000 } // 100% a partir de 10M
    ];

    for (let i = 0; i < phases.length; i++) {
      const p = phases[i];
      console.log(`Agregando fase ${i}: cap=${p.cap.toString()} unlockBps=${p.unlockBps}`);
      const tx = await vault.addPhase(p.cap, p.unlockBps);
      await tx.wait();
    }

    phasesLength = await vault.phasesLength();
    console.log("Fases creadas. phasesLength ahora:", phasesLength.toString());
  }

  // --- 4) Asignar un grant al deployer (1000 XCOIN) ---
  console.log("\n== Asignando grant al deployer ==");

  const grantAmount = ethers.parseUnits("1000", decimals);
  const txAlloc = await vault.allocate(deployer.address, grantAmount);
  await txAlloc.wait();
  console.log("Grant asignado: 1000 XCOIN al deployer.");

  const grant = await vault.grantOf(deployer.address);
  console.log("Grant total    :", ethers.formatUnits(grant[0], decimals));
  console.log("Grant released :", ethers.formatUnits(grant[1], decimals));

  // --- 5) Ver cuánto está desbloqueado antes de subir MarketCap ---
  let unlockedBps = await vault.unlockedBps();          // bigint
  let releasableBefore = await vault.releasable(deployer.address); // bigint

  console.log("\n== Vesting antes de subir MarketCap ==");
  console.log("unlockedBps        :", unlockedBps.toString());
  console.log("releasable (before):", ethers.formatUnits(releasableBefore, decimals));

  // --- 6) Simular MarketCap = 5M USD (desbloqueo 75%) ---
  console.log("\n== Simulando MarketCap 5,000,000 USD ==");
  const txSync = await vault.syncMarketCap(5_000_000);
  await txSync.wait();

  unlockedBps = await vault.unlockedBps();
  const releasableAfter = await vault.releasable(deployer.address);

  console.log("unlockedBps        :", unlockedBps.toString());
  console.log("releasable (after) :", ethers.formatUnits(releasableAfter, decimals));

  // --- 7) Hacer claim desde el deployer ---
  if (releasableAfter > 0n) {
    console.log("\n== Ejecutando claim() ==");
    const txClaim = await vault.claim();
    await txClaim.wait();
    console.log("Claim ejecutado.");
  } else {
    console.log("\nNada para reclamar (releasable == 0).");
  }

  const balDeployerAfter = await token.balanceOf(deployer.address);
  console.log("\n== Balances finales ==");
  console.log("Deployer antes  :", ethers.formatUnits(balDeployerBefore, decimals));
  console.log("Deployer después:", ethers.formatUnits(balDeployerAfter, decimals));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
