import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const tokenAddr = process.env.CONTRACT_ADDR;
  const treasuryAddr = process.env.TREASURY_ADDR;

  if (!tokenAddr || !treasuryAddr) {
    throw new Error("Faltan CONTRACT_ADDR o TREASURY_ADDR en el .env");
  }

  const [deployer] = await ethers.getSigners();

  const pricePerTokenWei = ethers.parseEther("0.0001");
  const cooldownBlocks = 3n;

  console.log("Deployer      :", deployer.address);
  console.log("Token         :", tokenAddr);
  console.log("Tesoreria     :", treasuryAddr);

  const Sale = await ethers.getContractFactory("XCoinSaleV2");

  const sale = await Sale.deploy(
    deployer.address,      // initialOwner
    tokenAddr,             // _token
    treasuryAddr,          // _treasury
    pricePerTokenWei,      // _pricePerTokenWei
    cooldownBlocks         // _cooldownBlocks
  );

  await sale.waitForDeployment();
  console.log("XCoinSaleV2 desplegado en:", sale.target);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
