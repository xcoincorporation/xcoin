import { expect } from "chai";
import { ethers } from "hardhat";

describe("XCoinToken", () => {
  let token: any;
  let owner: any;
  let tesoreria: any;
  let vaultUsuarios: any;
  let user1: any;
  let user2: any;

  // Supply "entero" que pasamos al constructor (ej: 1_000_000)
  const initialSupplyTokens = 1_000_000n;

  beforeEach(async () => {
    [owner, tesoreria, vaultUsuarios, user1, user2] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("XCoinToken");
    token = await Token.deploy(
      initialSupplyTokens,
      tesoreria.address,
      vaultUsuarios.address
    );
    await token.waitForDeployment();
  });

  it("despliega con supply total y distribucion 80/20 correcta", async () => {
    const decimals: bigint = BigInt(await token.decimals());
    const expectedSupply = initialSupplyTokens * 10n ** decimals;

    const totalSupply = await token.totalSupply();
    const balanceVault = await token.balanceOf(vaultUsuarios.address);
    const balanceTreasury = await token.balanceOf(tesoreria.address);

    // Supply total correcto
    expect(totalSupply).to.equal(expectedSupply);

    // 80% al vault de usuarios, 20% a Tesoreria
    expect(balanceVault).to.equal((expectedSupply * 80n) / 100n);
    expect(balanceTreasury).to.equal((expectedSupply * 20n) / 100n);
    expect(balanceVault + balanceTreasury).to.equal(expectedSupply);
  });

  it("permite un airdrop multipunto desde la Tesoreria", async () => {
    const decimals: bigint = BigInt(await token.decimals());

    // Montos de airdrop (en unidades humanas)
    const amount1Human = "10";   // 10 XCOIN
    const amount2Human = "5.5";  // 5.5 XCOIN

    const amount1 = ethers.parseUnits(amount1Human, Number(decimals));
    const amount2 = ethers.parseUnits(amount2Human, Number(decimals));

    const initialTreasuryBalance = await token.balanceOf(tesoreria.address);

    // Tesoreria hace "airdrop" a user1 y user2
    await token.connect(tesoreria).transfer(user1.address, amount1);
    await token.connect(tesoreria).transfer(user2.address, amount2);

    const finalTreasuryBalance = await token.balanceOf(tesoreria.address);
    const balanceUser1 = await token.balanceOf(user1.address);
    const balanceUser2 = await token.balanceOf(user2.address);

    // Verificamos que los usuarios recibieron exactamente lo enviado
    expect(balanceUser1).to.equal(amount1);
    expect(balanceUser2).to.equal(amount2);

    // La Tesoreria redujo su saldo por el total airdropeado
    expect(finalTreasuryBalance).to.equal(
      initialTreasuryBalance - amount1 - amount2
    );
  });
});
