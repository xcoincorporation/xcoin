import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Despliega XCoinVault.
 *
 * - Owner: el deployer.
 * - Oracle: ORACLE_ADDR (si está en .env) o el propio deployer.
 *
 * Uso:
 *  npx hardhat run scripts/deployVault.ts --network sepolia
 */
async function main() {
  const [deployer] = await ethers.getSigners();
  const oracleFromEnv = process.env.ORACLE_ADDR;
  const oracle = oracleFromEnv && oracleFromEnv.trim() !== "" ? oracleFromEnv : deployer.address;

  console.log("Deployer:", deployer.address);
  console.log("Oracle  :", oracle);

  const Vault = await ethers.getContractFactory("XCoinVault");
  const vault = await Vault.deploy(deployer.address, oracle);
  const deployed = await vault.waitForDeployment();

  console.log("XCoinVault desplegado en:", deployed.target);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
