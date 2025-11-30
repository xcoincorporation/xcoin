// protocol/scripts/syncMarketCap.ts
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Sincroniza el MarketCap del Vault con un valor dado.
 *
 * Uso:
 *   npx hardhat run scripts/syncMarketCap.ts --network sepolia
 *
 * Opcionalmente podés pasar MARKET_CAP_USD en el .env:
 *   MARKET_CAP_USD=1000000
 */
async function main() {
  const vaultAddr = process.env.VAULT_ADDR;
  if (!vaultAddr) {
    throw new Error("Falta VAULT_ADDR en el .env");
  }

  const marketCapFromEnv = process.env.MARKET_CAP_USD;
  const marketCapUsd: bigint = marketCapFromEnv
    ? BigInt(marketCapFromEnv)
    : 1_000_000n; // valor por defecto: 1M USD

  const [oracle] = await ethers.getSigners();

  console.log("=== XCoinVault syncMarketCap (laboratorio) ===");
  console.log("Vault:   ", vaultAddr);
  console.log("Signer:  ", oracle.address);
  console.log("MC USD:  ", marketCapUsd.toString());

  const vault = await ethers.getContractAt("XCoinVault", vaultAddr, oracle);

  const phaseBefore = await vault.currentPhase();
  const bpsBefore = await vault.unlockedBps();

  console.log("\n== Estado antes de sync ==");
  console.log("currentPhase :", phaseBefore.toString());
  console.log("unlockedBps  :", bpsBefore.toString());

  console.log("\n== Ejecutando syncMarketCap(...) ==");
  const tx = await vault.syncMarketCap(marketCapUsd);
  const receipt = await tx.wait();

  if (!receipt) {
    throw new Error("La transacción no se confirmó (receipt null)");
  }

  console.log(
    `Tx confirmada en bloque ${receipt.blockNumber}, gasUsed=${receipt.gasUsed.toString()}`
  );

  const phaseAfter = await vault.currentPhase();
  const bpsAfter = await vault.unlockedBps();

  console.log("\n== Estado después de sync ==");
  console.log("currentPhase :", phaseAfter.toString());
  console.log("unlockedBps  :", bpsAfter.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
