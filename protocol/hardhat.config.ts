import { HardhatUserConfig, task } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import type { HardhatRuntimeEnvironment } from "hardhat/types";
dotenv.config();

// npx hardhat accounts  (o con --network sepolia)
task("accounts", "Prints the list of accounts", async (_args: unknown, hre: HardhatRuntimeEnvironment) => {
  const accounts = await hre.ethers.getSigners();
  for (const a of accounts) console.log(a.address);
});

function normalizedPk(): string[] {
  const pk = process.env.PRIVATE_KEY?.trim();
  if (!pk) return [];
  return [pk.startsWith("0x") ? pk : `0x${pk}`];
}

const config: HardhatUserConfig = {
  solidity: { version: "0.8.24", settings: { optimizer: { enabled: true, runs: 200 } } },
  networks: {
    sepolia: { url: process.env.RPC_URL || "", accounts: normalizedPk() }
  },
  // Si no vas a verificar aún, podés dejarlo vacío o quitar este bloque
  etherscan: { apiKey: process.env.ETHERSCAN_KEY || "" }
};

export default config;
