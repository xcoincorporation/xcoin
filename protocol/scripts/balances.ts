import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

function fmt(amount: bigint, decimalsBig: bigint) {
  const decimals = Number(decimalsBig);
  const s = amount.toString().padStart(decimals + 1, "0");
  const head = s.slice(0, -decimals) || "0";
  const tail = s.slice(-decimals).replace(/0+$/, "");
  return tail ? `${head}.${tail}` : head;
}
function pct(n: bigint, d: bigint): string {
  if (d === 0n) return "0.00";
  const scaled = (n * 10000n) / d; // 2 decimales
  const intPart = scaled / 100n;
  const decPart = (scaled % 100n).toString().padStart(2, "0");
  return `${intPart.toString()}.${decPart}`;
}

async function main() {
  const tokenAddr = process.env.CONTRACT_ADDR!;
  const treasury = process.env.TREASURY_ADDR!;
  const wantPct = process.env.TREASURY_PCT ? Number(process.env.TREASURY_PCT) : null;

  if (!/^0x[0-9a-fA-F]{40}$/.test(treasury)) {
    console.warn(`⚠️ TREASURY_ADDR no es una dirección Ethereum válida: ${treasury}`);
  }

  const signer = (await ethers.getSigners())[0];
  const signerAddr = await signer.getAddress();
  if (treasury.toLowerCase() === signerAddr.toLowerCase()) {
    console.warn("⚠️ Tesorería coincide con el signer actual (puede sesgar la lectura de proporción).");
  }

  const token = await ethers.getContractAt("XCoinToken", tokenAddr, signer);
  const [symbol, decimals, totalSupply, balSigner, balTreasury] = await Promise.all([
    token.symbol(), token.decimals(), token.totalSupply(),
    token.balanceOf(signerAddr), token.balanceOf(treasury)
  ]);

  console.log(`Token: ${symbol}`);
  console.log(`TotalSupply: ${fmt(totalSupply, decimals)}`);
  console.log(`Mi balance: ${fmt(balSigner, decimals)}`);
  console.log(`Tesorería (${treasury}): ${fmt(balTreasury, decimals)}`);
  console.log(`Proporción Tesorería: ${pct(balTreasury, totalSupply)}%`);

  if (wantPct !== null) {
    const target = (totalSupply * BigInt(wantPct)) / 100n;
    const delta = balTreasury - target;
    const sign = delta === 0n ? "" : (delta > 0n ? "+" : "−");
    console.log(`Objetivo ${wantPct}% => ${fmt(target, decimals)} | Delta: ${sign}${fmt(delta >= 0n ? delta : -delta, decimals)} (${sign}${pct(delta >= 0n ? delta : -delta, totalSupply)} pts)`);
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
