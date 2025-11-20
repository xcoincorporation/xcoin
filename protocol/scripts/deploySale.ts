import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

/**
 * Despliega XCoinSale en Sepolia.
 *
 * Usa:
 *  - CONTRACT_ADDR: address del XCoinToken
 *  - TREASURY_ADDR: address de la tesorería
 *
 * Define un precio inicial por token en ETH.
 */
async function main() {
  const tokenAddr = process.env.CONTRACT_ADDR;
  const treasuryAddr = process.env.TREASURY_ADDR;

  if (!tokenAddr || !treasuryAddr) {
    throw new Error("Faltan CONTRACT_ADDR o TREASURY_ADDR en .env");
  }

  const [deployer] = await ethers.getSigners();
  console.log("Deployer :", deployer.address);
  console.log("Token    :", tokenAddr);
  console.log("Treasury :", treasuryAddr);

  // Precio inicial: 1 XCOIN = 0.0001 ETH (ejemplo)
  // Podés cambiar esto cuando quieras.
  const pricePerTokenWei = ethers.parseEther("0.0001");

  const Sale = await ethers.getContractFactory("XCoinSale");
  const sale = await Sale.deploy(
    deployer.address,
    tokenAddr,
    treasuryAddr,
    pricePerTokenWei
  );

  const deployed = await sale.waitForDeployment();
  console.log("XCoinSale desplegado en:", deployed.target);
  console.log("Precio inicial (wei por token):", pricePerTokenWei.toString());
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
