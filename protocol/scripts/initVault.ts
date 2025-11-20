import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Inicializa el Vault:
 *  - setToken(CONTRACT_ADDR)
 *  - agrega fases (si aún no existen)
 *
 * Requiere en .env:
 *  - VAULT_ADDR: dirección del XCoinVault
 *  - CONTRACT_ADDR: dirección del XCoinToken
 *
 * Uso:
 *  npx hardhat run scripts/initVault.ts --network sepolia
 */
async function main() {
  const VAULT_ADDR = process.env.VAULT_ADDR;
  const TOKEN_ADDR = process.env.CONTRACT_ADDR;

  if (!VAULT_ADDR || !TOKEN_ADDR) {
    throw new Error("Faltan VAULT_ADDR o CONTRACT_ADDR en el .env");
  }

  const [signer] = await ethers.getSigners();
  console.log("Usando signer:", signer.address);
  console.log("Vault        :", VAULT_ADDR);
  console.log("Token        :", TOKEN_ADDR);

  const vault = await ethers.getContractAt("XCoinVault", VAULT_ADDR, signer);

  // 1) Vincular token si aún no está configurado
  const currentToken: string = await vault.token();
  if (currentToken === ethers.ZeroAddress) {
    console.log("Token no configurado en el Vault, llamando setToken...");
    const tx = await vault.setToken(TOKEN_ADDR);
    await tx.wait();
    console.log("Token seteado en el Vault.");
  } else {
    console.log("Token ya configurado en el Vault:", currentToken);
  }

  // 2) Definir fases de ejemplo (podés cambiar estos valores)
  const phases = [
    { cap: 1_000_000n, unlockBps: 2_500 },  // 25% a partir de 1M
    { cap: 2_500_000n, unlockBps: 5_000 },  // 50% a partir de 2.5M
    { cap: 5_000_000n, unlockBps: 7_500 },  // 75% a partir de 5M
    { cap: 10_000_000n, unlockBps: 10_000 } // 100% a partir de 10M
  ];

  const existing = Number(await vault.phasesLength());
  console.log("Fases existentes:", existing);

  for (let i = existing; i < phases.length; i++) {
    const p = phases[i];
    console.log(`Agregando fase ${i}: cap=${p.cap.toString()} unlockBps=${p.unlockBps}`);
    const tx = await vault.addPhase(p.cap, p.unlockBps);
    await tx.wait();
  }

  console.log("InitVault completo.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
