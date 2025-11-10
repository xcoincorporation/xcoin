import { ethers } from "hardhat";
import { expect } from "chai";

/** Helpers */
function toRaw(human: string, decimals: number) {
  return ethers.parseUnits(human, decimals);
}

describe("XCoinToken", () => {
  async function deployWithArgs() {
    const [owner, treasury, vault, alt] = await ethers.getSigners();
    const decimals = 18; // ajustá si tu token no es 18
    const initialSupply = toRaw("1000000", decimals); // 1,000,000 * 10^18

    const Token = await ethers.getContractFactory("XCoinToken");
    const token = await Token.deploy(initialSupply, treasury.address, vault.address);
    await token.waitForDeployment();

    return { token, owner, treasury, vault, alt, decimals, initialSupply };
  }

  async function findInitialHolder(token: any, candidates: string[]) {
    for (const a of candidates) {
      const bal = await token.balanceOf(a);
      if (bal > 0n) return a;
    }
    return null;
  }

  it("despliega con supply total en alguna de las cuentas previstas", async () => {
    const { token, owner, treasury, vault, decimals, initialSupply } = await deployWithArgs();

    const total = await token.totalSupply();
    expect(total).to.equal(initialSupply);

    const holder = await findInitialHolder(token, [owner.address, treasury.address, vault.address]);
    expect(holder, "no se encontró el tenedor inicial").to.not.equal(null);

    const holderBal = await token.balanceOf(holder!);
    expect(holderBal).to.equal(total);
  });

  it("transferencia del 20% desde el tenedor inicial hacia Tesorería (si ya es Tesorería, usa cuenta alternativa)", async () => {
    const { token, owner, treasury, vault, alt, initialSupply } = await deployWithArgs();

    // Detectar el tenedor inicial
    const holderAddr = await findInitialHolder(token, [owner.address, treasury.address, vault.address]);
    expect(holderAddr).to.not.equal(null);

    const amount20 = (initialSupply * 20n) / 100n;

    // Si el tenedor inicial ya es la Tesorería, usamos alt como “destino de prueba”
    const dest = (holderAddr!.toLowerCase() === treasury.address.toLowerCase())
      ? alt.address
      : treasury.address;

    // Enlazar el contrato con el signer correcto
    const signer = await ethers.getImpersonatedSigner(holderAddr!);
    const tokenFromHolder = token.connect(signer);

    const balBeforeHolder = await token.balanceOf(holderAddr!);
    const balBeforeDest = await token.balanceOf(dest);

    await (await tokenFromHolder.transfer(dest, amount20)).wait();

    const balAfterHolder = await token.balanceOf(holderAddr!);
    const balAfterDest = await token.balanceOf(dest);

    expect(balAfterHolder).to.equal(balBeforeHolder - amount20);
    expect(balAfterDest).to.equal(balBeforeDest + amount20);
  });

  it("airdrop multipunto desde el tenedor inicial", async () => {
    const { token, owner, treasury, vault, alt, decimals } = await deployWithArgs();

    const holderAddr = await findInitialHolder(token, [owner.address, treasury.address, vault.address]);
    expect(holderAddr).to.not.equal(null);

    const signer = await ethers.getImpersonatedSigner(holderAddr!);
    const t = token.connect(signer);

    const a = treasury.address;      // destino 1
    const b = alt.address;           // destino 2

    await (await t.transfer(a, toRaw("10", decimals))).wait();
    await (await t.transfer(b, toRaw("5", decimals))).wait();

    expect(await token.balanceOf(a)).to.equal(toRaw("10", decimals));
    expect(await token.balanceOf(b)).to.equal(toRaw("5", decimals));
  });
});