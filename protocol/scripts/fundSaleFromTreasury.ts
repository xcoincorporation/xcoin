import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Fondea XCoinSaleV2 usando la TESORERÍA como origen.
 * Usa:
 *  - CONTRACT_ADDR        → address del XCoinToken
 *  - SALE_ADDR            → address del contrato XCoinSaleV2
 *  - PRIVATE_KEY_TESORERIA→ pk de la tesorería (en .env)
 */
async function main() {
  const tokenAddr = process.env.CONTRACT_ADDR;
  const saleAddr = process.env.SALE_ADDR;
  const treasuryPk = process.env.PRIVATE_KEY_TESORERIA;

  if (!tokenAddr || !saleAddr) {
    throw new Error("Faltan CONTRACT_ADDR o SALE_ADDR en el .env");
  }
  if (!treasuryPk) {
    throw new Error("Falta PRIVATE_KEY_TESORERIA en el .env");
  }

  // Hardhat ya tiene provider configurado con SEPOLIA_RPC_URL
  const provider = ethers.provider;

  const normalizedPk = treasuryPk.startsWith("0x")
    ? treasuryPk
    : `0x${treasuryPk}`;

  const treasuryWallet = new ethers.Wallet(normalizedPk, provider);

  const token = await ethers.getContractAt(
    "XCoinToken",
    tokenAddr,
    treasuryWallet
  );

  const decimals = await token.decimals();
  const symbol = await token.symbol();

  // 💡 Ajustá acá la cantidad a fondear: EJ: 5_000 XCOIN
  const amountTokens = 5_000n;
  const amountUnits = amountTokens * 10n ** BigInt(decimals);

  const balanceTreasury = await token.balanceOf(treasuryWallet.address);

  console.log("Tesorería      :", treasuryWallet.address);
  console.log("Token          :", tokenAddr, `(${symbol})`);
  console.log("Sale contract  :", saleAddr);
  console.log(
    "Balance TES    :",
    ethers.formatUnits(balanceTreasury, decimals)
  );
  console.log(
    "Amount to fund :",
    ethers.formatUnits(amountUnits, decimals)
  );

  if (balanceTreasury < amountUnits) {
    throw new Error("Tesorería sin saldo suficiente para fondear.");
  }

  const tx = await token.transfer(saleAddr, amountUnits);
  console.log("TX enviada:", tx.hash);
  await tx.wait();
  console.log("✔ Venta fondeada CORRECTAMENTE desde la Tesorería.");

  const saleBalance = await token.balanceOf(saleAddr);
  console.log(
    "Balance venta  :",
    ethers.formatUnits(saleBalance, decimals)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
