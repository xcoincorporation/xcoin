import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Envía XCOIN desde el DEPLOYER al contrato de venta.
 * Usamos el deployer porque:
 *  - tiene ETH para gas
 *  - ya tiene XCOIN (por los claim del Vault)
 */

async function main() {
  const tokenAddr = process.env.CONTRACT_ADDR;
  const saleAddr = process.env.SALE_ADDR;

  if (!tokenAddr || !saleAddr) {
    throw new Error("Faltan CONTRACT_ADDR o SALE_ADDR en el .env");
  }

  const [deployer] = await ethers.getSigners();

  console.log("Deployer :", deployer.address);
  console.log("Token    :", tokenAddr);
  console.log("Sale     :", saleAddr);

  const token = await ethers.getContractAt("XCoinToken", tokenAddr, deployer);

  const decimals = await token.decimals();
  const balDeployer = await token.balanceOf(deployer.address);

  console.log("Balance deployer actual:", ethers.formatUnits(balDeployer, decimals));

  // Cantidad a enviar al contrato de venta (ajustable)
  // Usamos 500 XCOIN para test
  const amount = ethers.parseUnits("500", decimals);

  if (balDeployer < amount) {
    throw new Error("El deployer no tiene suficientes XCOIN para enviar 500.");
  }

  console.log(`Transfiriendo ${ethers.formatUnits(amount, decimals)} XCOIN al contrato de venta...`);

  const tx = await token.transfer(saleAddr, amount);
  await tx.wait();

  const balDeployerAfter = await token.balanceOf(deployer.address);
  const balSale = await token.balanceOf(saleAddr);

  console.log("✔ Transferencia completa.");
  console.log("Balance deployer después:", ethers.formatUnits(balDeployerAfter, decimals));
  console.log("Balance XCoinSale        :", ethers.formatUnits(balSale, decimals));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
