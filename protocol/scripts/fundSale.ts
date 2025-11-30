import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Envía XCOIN desde una cuenta con saldo (normalmente el deployer)
 * al contrato de venta XCoinSaleV2.
 *
 * Usa:
 *  - CONTRACT_ADDR: address del XCoinToken
 *  - SALE_ADDR:     address del contrato XCoinSaleV2
 */
async function main() {
  const tokenAddr = process.env.CONTRACT_ADDR;
  const saleAddr = process.env.SALE_ADDR;

  if (!tokenAddr || !saleAddr) {
    throw new Error("Faltan CONTRACT_ADDR o SALE_ADDR en el .env");
  }

  const [sender] = await ethers.getSigners();

  const token = await ethers.getContractAt("XCoinToken", tokenAddr, sender);

  const decimals = await token.decimals();
  const symbol = await token.symbol();

  // Monto a transferir al contrato de venta: 20_000 XCOIN (ajustable)
  const amountTokens = 20_000n;
  const amountUnits = amountTokens * 10n ** BigInt(decimals);

  const balanceBefore = await token.balanceOf(sender.address);

  console.log("Sender          :", sender.address);
  console.log("Token           :", tokenAddr, `(${symbol})`);
  console.log("Sale contract   :", saleAddr);
  console.log("Balance sender  :", ethers.formatUnits(balanceBefore, decimals));
  console.log("Amount to fund  :", ethers.formatUnits(amountUnits, decimals));

  if (balanceBefore < amountUnits) {
    throw new Error("Saldo insuficiente de XCOIN para fondear la venta");
  }

  const tx = await token.transfer(saleAddr, amountUnits);
  console.log("TX enviada:", tx.hash);
  await tx.wait();
  console.log("✔ Venta fondeada correctamente.");

  const balanceAfter = await token.balanceOf(sender.address);
  const balanceSale = await token.balanceOf(saleAddr);

  console.log(
    "Balance sender después:",
    ethers.formatUnits(balanceAfter, decimals)
  );
  console.log(
    "Balance venta          :",
    ethers.formatUnits(balanceSale, decimals)
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
