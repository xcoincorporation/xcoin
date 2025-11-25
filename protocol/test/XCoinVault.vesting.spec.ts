import { expect } from "chai";
import { ethers } from "hardhat";

describe("XCoinVault - Vesting (allocate / releasable / claim)", () => {
  let token: any;
  let vault: any;
  let owner: any;
  let tesoreria: any;
  let oracle: any;
  let beneficiary: any;

  const initialSupplyTokens = 1_000_000n;

  const phases = [
    { capUsd: 1_000_000,  bps: 1000  }, // 10%
    { capUsd: 2_000_000,  bps: 2000  }, // 20%
    { capUsd: 4_000_000,  bps: 3500  }, // 35%
    { capUsd: 6_000_000,  bps: 5000  }, // 50%
    { capUsd: 10_000_000, bps: 7500  }, // 75%
    { capUsd: 20_000_000, bps: 10000 }, // 100%
  ];

  async function deployTokenAndVault() {
    [owner, tesoreria, oracle, beneficiary] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("XCoinToken");
    // En este test hacemos que el owner reciba el 80% (vaultUsuarios = owner)
    token = await Token.deploy(
      initialSupplyTokens,
      tesoreria.address,
      owner.address
    );
    await token.waitForDeployment();

    const Vault = await ethers.getContractFactory("XCoinVault");
    vault = await Vault.deploy(owner.address, oracle.address);
    await vault.waitForDeployment();

    // Vinculamos el token al vault
    await vault.connect(owner).setToken(await token.getAddress());

    // Cargamos las fases institucionales
    for (const p of phases) {
      await (await vault.connect(owner).addPhase(p.capUsd, p.bps)).wait();
    }
  }

  beforeEach(async () => {
    await deployTokenAndVault();
  });

  it("allocate registra el grant y no permite reclamar sin fases desbloqueadas", async () => {
    const decimals = await token.decimals();
    const grantAmount = ethers.parseUnits("1000", decimals); // 1000 XCOIN

    const vaultAddr = await vault.getAddress();

    // Owner transfiere tokens al vault para cubrir el grant
    await token.connect(owner).transfer(vaultAddr, grantAmount);

    // Allocate al beneficiario
    await vault.connect(owner).allocate(beneficiary.address, grantAmount);

    const grant = await vault.grantOf(beneficiary.address);
    const totalGrant = grant[0];
    const released = grant[1];

    expect(totalGrant).to.equal(grantAmount);
    expect(released).to.equal(0n);

    // Sin fases desbloqueadas, unlockedBps = 0 y no hay releasable
    const unlocked = await vault.unlockedBps();
    expect(Number(unlocked)).to.equal(0);

    const releasable = await vault.releasable(beneficiary.address);
    expect(releasable).to.equal(0n);

    await expect(
      vault.connect(beneficiary).claim()
    ).to.be.revertedWith("XCoinVault: nothing to claim");
  });

  it("claim libera el porcentaje correcto segun la fase y se acumula al subir de fase", async () => {
    const decimals = await token.decimals();
    const grantAmount = ethers.parseUnits("1000", decimals); // 1000 XCOIN

    const vaultAddr = await vault.getAddress();
    await token.connect(owner).transfer(vaultAddr, grantAmount);

    await vault.connect(owner).allocate(beneficiary.address, grantAmount);

    // Fase 0 → 10%
    await (await vault.connect(owner).syncMarketCap(1_000_000)).wait();

    let unlocked = await vault.unlockedBps();
    expect(Number(unlocked)).to.equal(1000); // 10%

    let releasable = await vault.releasable(beneficiary.address);
    const expectedFirst = (grantAmount * 10n) / 100n;
    expect(releasable).to.equal(expectedFirst);

    const balanceBefore = await token.balanceOf(beneficiary.address);

    await (await vault.connect(beneficiary).claim()).wait();

    const balanceAfter = await token.balanceOf(beneficiary.address);
    expect(balanceAfter - balanceBefore).to.equal(expectedFirst);

    let grant = await vault.grantOf(beneficiary.address);
    expect(grant[1]).to.equal(expectedFirst); // released = 10%

    // Segunda vez, a mismo MarketCap, no debe haber nada nuevo para reclamar
    releasable = await vault.releasable(beneficiary.address);
    expect(releasable).to.equal(0n);

    await expect(
      vault.connect(beneficiary).claim()
    ).to.be.revertedWith("XCoinVault: nothing to claim");

    // Ahora avanzamos a un MarketCap de 6M → 50% total
    await (await vault.connect(owner).syncMarketCap(6_000_000)).wait();
    unlocked = await vault.unlockedBps();
    expect(Number(unlocked)).to.equal(5000); // 50%

    // Deberia haber 40% adicional disponible (50% total - 10% ya liberado)
    const expectedTotal50 = (grantAmount * 50n) / 100n;
    const expectedSecond = expectedTotal50 - expectedFirst;

    releasable = await vault.releasable(beneficiary.address);
    expect(releasable).to.equal(expectedSecond);

    const balanceBefore2 = await token.balanceOf(beneficiary.address);

    await (await vault.connect(beneficiary).claim()).wait();

    const balanceAfter2 = await token.balanceOf(beneficiary.address);
    expect(balanceAfter2 - balanceBefore2).to.equal(expectedSecond);

    grant = await vault.grantOf(beneficiary.address);
    expect(grant[1]).to.equal(expectedTotal50); // released = 50%
  });

  it("no permite allocate por encima del balance efectivo del vault", async () => {
    const decimals = await token.decimals();
    const vaultAddr = await vault.getAddress();

    const balanceToSend = ethers.parseUnits("100", decimals); // 100 XCOIN
    const attemptGrant = ethers.parseUnits("200", decimals); // 200 XCOIN

    // Owner solo transfiere 100 tokens al vault
    await token.connect(owner).transfer(vaultAddr, balanceToSend);

    // Intentar asignar un grant de 200 debe revertir
    await expect(
      vault.connect(owner).allocate(beneficiary.address, attemptGrant)
    ).to.be.revertedWith("XCoinVault: insufficient vault balance");
  });
});
