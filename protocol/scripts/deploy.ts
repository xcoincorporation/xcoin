import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const SUPPLY = process.env.INIT_SUPPLY_RAW!;        // "1000000000000000000000000"
  const TREASURY = process.env.TREASURY_ADDR!;
  const VAULT = process.env.VAULT_ADDR!;

  if (!SUPPLY || !TREASURY || !VAULT) {
    throw new Error("Faltan INIT_SUPPLY_RAW, TREASURY_ADDR o VAULT_ADDR");
  }

  const Token = await ethers.getContractFactory("XCoinToken");
  const token = await Token.deploy(SUPPLY, TREASURY, VAULT);
  const deployed = await token.waitForDeployment();

  console.log("XCoinToken:", deployed.target);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
