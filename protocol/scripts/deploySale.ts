// scripts/deploySale.ts
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * ENV esperadas:
 * - CONTRACT_ADDR      → Dirección del XCoinToken ya desplegado (ERC-20)
 * - TREASURY_ADDR      → Dirección de la tesorería que recibe el ETH
 * - SALE_OWNER_ADDR    → (opcional) Owner explícito del XCoinSaleV2
 * - SALE_PRICE_WEI     → (opcional) Precio en wei por 1 XCOIN (por defecto 1e15 wei)
 * - SALE_COOLDOWN_BLOCKS → (opcional) Cooldown en bloques entre compras (por defecto 0)
 */

async function main() {
  const [deployer] = await ethers.getSigners();

  const tokenAddr = process.env.CONTRACT_ADDR;
  const treasuryAddr = process.env.TREASURY_ADDR;
  const ownerAddr = process.env.SALE_OWNER_ADDR || deployer.address;

  if (!tokenAddr) {
    throw new Error("Falta CONTRACT_ADDR en el .env (direccion del XCoinToken).");
  }

  if (!treasuryAddr) {
    throw new Error("Falta TREASURY_ADDR en el .env (direccion de la tesoreria).");
  }

  // Precio por defecto: 0.001 ETH por 1 XCOIN (ejemplo de laboratorio)
  const pricePerTokenWei = process.env.SALE_PRICE_WEI
    ? BigInt(process.env.SALE_PRICE_WEI)
    : ethers.parseUnits("0.001", "ether"); // 1e15 wei

  // Cooldown por defecto: 0 bloques (sin restriccion)
  const cooldownBlocks = process.env.SALE_COOLDOWN_BLOCKS
    ? BigInt(process.env.SALE_COOLDOWN_BLOCKS)
    : 0n;

  console.log("== XCoinSaleV2 :: Deploy ==");
  console.log("Deployer        :", deployer.address);
  console.log("Owner (sale)    :", ownerAddr);
  console.log("XCoinToken      :", tokenAddr);
  console.log("Treasury        :", treasuryAddr);
  console.log("Price per token :", pricePerTokenWei.toString(), "wei");
  console.log("Cooldown blocks :", cooldownBlocks.toString());
  console.log("");

  const Sale = await ethers.getContractFactory("XCoinSaleV2");
  const sale = await Sale.deploy(
    ownerAddr,
    tokenAddr,
    treasuryAddr,
    pricePerTokenWei,
    cooldownBlocks
  );

  await sale.waitForDeployment();

  const saleAddr = await sale.getAddress();

  console.log("✅ XCoinSaleV2 desplegado en:", saleAddr);
  console.log("");
  console.log("Sugerencia de export para tu .env:");
  console.log(`SALE_ADDR=${saleAddr}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
