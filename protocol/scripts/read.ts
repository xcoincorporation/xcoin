import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

const ADDR = process.env.CONTRACT_ADDR!;

const abi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)"
];

async function main() {
  const [signer] = await ethers.getSigners();
  const c = new ethers.Contract(ADDR, abi, signer);

  const [name, symbol, dec, total, bal] = await Promise.all([
    c.name(), c.symbol(), c.decimals(), c.totalSupply(), c.balanceOf(signer.address)
  ]);

  console.log({ name, symbol, decimals: dec, totalSupply: total.toString(), myBalance: bal.toString() });
}

main().catch((e) => { console.error(e); process.exit(1); });
