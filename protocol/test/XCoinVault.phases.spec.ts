import { expect } from "chai";
import { ethers } from "hardhat";

describe("XCoinVault - Fases institucionales y MarketCap", () => {
  let vault: any;
  let owner: any;
  let oracle: any;

  const phases = [
    { capUsd: 1_000_000,  bps: 1000  }, // 10%
    { capUsd: 2_000_000,  bps: 2000  }, // 20%
    { capUsd: 4_000_000,  bps: 3500  }, // 35%
    { capUsd: 6_000_000,  bps: 5000  }, // 50%
    { capUsd: 10_000_000, bps: 7500  }, // 75%
    { capUsd: 20_000_000, bps: 10000 }, // 100%
  ];

  beforeEach(async () => {
    [owner, oracle] = await ethers.getSigners();

    const Vault = await ethers.getContractFactory("XCoinVault");
    // constructor(address initialOwner, address initialOracle)
    vault = await Vault.deploy(owner.address, oracle.address);
    await vault.waitForDeployment();

    // Cargamos las fases institucionales como en el script setPhases.ts
    for (const p of phases) {
      const tx = await vault.addPhase(p.capUsd, p.bps);
      await tx.wait();
    }
  });

  it("carga correctamente el número de fases institucionales", async () => {
    const length = await vault.phasesLength();
    expect(Number(length)).to.equal(phases.length);
  });

  it("mantiene las fases con cap creciente y bps monótono", async () => {
    const length = Number(await vault.phasesLength());

    let prevCap = 0;
    let prevBps = 0;

    for (let i = 0; i < length; i++) {
      const phase = await vault.getPhase(i); // (targetCap, unlockBps)
      const cap = Number(phase[0]);
      const bps = Number(phase[1]);

      expect(cap).to.be.gt(prevCap);
      expect(bps).to.be.gte(prevBps);
      expect(bps).to.be.lte(10_000);

      prevCap = cap;
      prevBps = bps;
    }
  });

  it("actualiza unlockedBps cuando crece el MarketCap según las fases", async () => {
    // Asumimos que inicialmente unlockedBps = 0
    let unlocked = Number(await vault.unlockedBps());
    expect(unlocked).to.equal(0);

    // Caso 1: MarketCap por debajo de la primera fase → sigue en 0
    await (await vault.syncMarketCap(500_000)).wait();
    unlocked = Number(await vault.unlockedBps());
    expect(unlocked).to.equal(0);

    // Caso 2: MarketCap en 1M → debe tomar la fase 0 (10%)
    await (await vault.syncMarketCap(1_000_000)).wait();
    unlocked = Number(await vault.unlockedBps());
    expect(unlocked).to.equal(1000);

    // Caso 3: MarketCap entre 2M y 4M → fase 1 (20%)
    await (await vault.syncMarketCap(3_000_000)).wait();
    unlocked = Number(await vault.unlockedBps());
    expect(unlocked).to.equal(2000);

    // Caso 4: MarketCap por encima del máximo → fase final (100%)
    await (await vault.syncMarketCap(50_000_000)).wait();
    unlocked = Number(await vault.unlockedBps());
    expect(unlocked).to.equal(10_000);
  });
});
