import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Formato de archivo:
 * airdrop.csv -> address,amountHuman
 * 0xabc...,100
 * 0xdef...,25.5
 */
function parseCSV(p: string): Array<{ to: string; amount: string }> {
  const raw = fs.readFileSync(p, "utf8").trim();
  return raw
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const [to, amt] = l.split(",").map((s) => s.trim());
      return { to, amount: amt };
    });
}

async function main() {
  const tokenAddr = process.env.CONTRACT_ADDR!;
  if (!tokenAddr) throw new Error("Falta CONTRACT_ADDR");

  const file = process.env.AIRDROP_FILE ?? "airdrop.csv";
  const csvPath = path.resolve(process.cwd(), file);
  const signer = (await ethers.getSigners())[0];

  const token = await ethers.getContractAt("XCoinToken", tokenAddr, signer);
  const [decimals, symbol] = await Promise.all([token.decimals(), token.symbol()]);

  const rows = parseCSV(csvPath);
  console.log(`Airdrop de ${symbol} a ${rows.length} direcciones...`);

  for (const { to, amount } of rows) {
    const raw = ethers.parseUnits(amount, decimals);
    const tx = await token.transfer(to, raw);
    const rcpt = await tx.wait();
    console.log(`→ ${to} : ${amount} ${symbol} | ${rcpt?.hash}`);
  }

  console.log("Airdrop finalizado.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
