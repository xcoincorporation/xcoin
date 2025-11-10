import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const tokenAddr = process.env.CONTRACT_ADDR!;
  const treasury = process.env.TREASURY_ADDR!;
  if (!tokenAddr || !treasury) throw new Error("Faltan CONTRACT_ADDR o TREASURY_ADDR");

  // % opcional (por defecto 20%)
  const pct = Number(process.env.TREASURY_PCT ?? "20");

  const signer = (await ethers.getSigners())[0];
  const token = await ethers.getContractAt("XCoinToken", tokenAddr, signer);

  const [symbol, decimals, totalSupply] = await Promise.all([
    token.symbol(),
    token.decimals(),       // bigint
    token.totalSupply(),    // bigint
  ]);
  // si más tarde necesitás usar decimals como número:
 const dec = Number(decimals);


  const amount = (totalSupply * BigInt(pct)) / BigInt(100); // 20% del supply
  console.log(`Transfiriendo ${pct}% de ${symbol} a Tesorería: ${amount.toString()} (raw)`);

  const tx = await token.transfer(treasury, amount);
  const rcpt = await tx.wait();
  console.log("OK => hash:", rcpt?.hash);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
