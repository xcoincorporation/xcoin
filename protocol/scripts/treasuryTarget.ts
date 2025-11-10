import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const tokenAddr = process.env.CONTRACT_ADDR!;
  const treasury = process.env.TREASURY_ADDR!;
  const pct = Number(process.env.TREASURY_PCT ?? "20"); // objetivo (20)

  if (!/^0x[0-9a-fA-F]{40}$/.test(treasury)) {
    throw new Error(`TREASURY_ADDR inválida: ${treasury}`);
  }

  const signer = (await ethers.getSigners())[0];
  const token = await ethers.getContractAt("XCoinToken", tokenAddr, signer);

  const [decimals, totalSupply, balTreasury] = await Promise.all([
    token.decimals(), token.totalSupply(), token.balanceOf(treasury),
  ]);

  const target = (totalSupply * BigInt(pct)) / 100n;
  if (balTreasury === target) {
    console.log(`Tesorería ya está en ${pct}% exacto.`);
    return;
  }

  if (balTreasury > target) {
    const over = balTreasury - target;
    console.log(`Tesorería excedida por ${over.toString()} (raw).`);
    console.log(`Sugerencia: si controlás esa wallet, transferí de vuelta ${over.toString()} (raw) al deployer para normalizar.`);
    return;
  }

  const needed = target - balTreasury;
  console.log(`Faltan ${needed.toString()} (raw) para alcanzar ${pct}%. Transfiriendo…`);
  const tx = await token.transfer(treasury, needed);
  const rcpt = await tx.wait();
  console.log("OK =>", rcpt?.hash);
}

main().catch((e) => { console.error(e); process.exit(1); });
