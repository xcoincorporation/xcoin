import { ethers } from "ethers";

/** Direcciones y RPC desde el .env (expuestas en el front con NEXT_PUBLIC_*) */
export const ADDRESS = process.env.NEXT_PUBLIC_XCOIN_ADDRESS!;
export const TREASURY = process.env.NEXT_PUBLIC_TREASURY_ADDR || "";
export const RPC = process.env.NEXT_PUBLIC_RPC_URL!;
export const SALE = process.env.NEXT_PUBLIC_SALE_ADDR || "";
export const VAULT = process.env.NEXT_PUBLIC_XCOIN_VAULT_ADDRESS || "";
export const VAULT_ADDR = process.env.NEXT_PUBLIC_XCOIN_VAULT_ADDRESS || "0x8924274B9b80138C6a71Cc88082D2f2054756764";

/** ABI mínima de lectura del token */
export const xcoinAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];

// Dirección del token ERC-20 XCoin en Sepolia
export const TOKEN_ADDR =
  process.env.NEXT_PUBLIC_TOKEN_ADDR ??
  "0x4331ff5eb6cf5aa20507de447743f0623508b046"; // <-- tu dirección real

// Dirección de la tesorería
export const TREASURY_ADDR =
  process.env.NEXT_PUBLIC_TREASURY_ADDR ??
  "0x4331ff5eb6cf5aa20507de447743f0623508b046"; // si usas la misma  

/** ABI mínima del contrato de venta (alineado con XCoinSaleV2) */
export const saleAbi = [
  "function buy() external payable",
  "function pricePerTokenWeiFixed() view returns (uint256)",
  "event Bought(address indexed buyer, uint256 ethSpent, uint256 tokensOut)",
];

/** Contrato sólo-lectura del token */
export function getReadContract() {
  const provider = new ethers.JsonRpcProvider(RPC);
  return new ethers.Contract(ADDRESS, xcoinAbi, provider);
}

/** Contrato sólo-lectura de la venta */
export function getSaleReadContract() {
  if (!SALE) throw new Error("NEXT_PUBLIC_SALE_ADDR no está configurada");
  const provider = new ethers.JsonRpcProvider(RPC);
  return new ethers.Contract(SALE, saleAbi, provider);
}

/** Info básica del token */
export async function readBasics() {
  const c = getReadContract();
  const [name, symbol, decimals, totalSupply] = await Promise.all([
    c.name(),
    c.symbol(),
    c.decimals(),
    c.totalSupply(),
  ]);

  return {
    name: String(name),
    symbol: String(symbol),
    decimals: Number(decimals),
    totalSupply: BigInt(totalSupply.toString()),
    token: ADDRESS,
    treasury: TREASURY,
  };
}

/** Info de la venta: precio en wei, stock en el contrato y dirección */
export async function readSaleInfo() {
  if (!SALE) throw new Error("Contrato de venta no configurado");

  const token = getReadContract();
  const sale = getSaleReadContract();

  const [priceWeiRaw, decimals, saleBalance] = await Promise.all([
    sale.pricePerTokenWeiFixed(),    // ✅ nombre correcto
    token.decimals(),
    token.balanceOf(SALE),
  ]);

  const priceWei = BigInt(priceWeiRaw.toString());

  return {
    priceWei,
    decimals: Number(decimals),
    tokensInSale: BigInt(saleBalance.toString()),
    saleAddress: SALE,
  };
}

/** ETH actual de la tesorería (Sepolia) */
export async function readTreasuryEth() {
  if (!TREASURY) throw new Error("TREASURY_ADDR no configurada");
  const provider = new ethers.JsonRpcProvider(RPC);
  const bal = await provider.getBalance(TREASURY);
  return bal; // BigInt
}

/** Formateo con separador de miles */
export function toHuman(
  value: bigint | string,
  decimals: number,
  maxDecimals: number = 0
): string {
  const raw = ethers.formatUnits(
    typeof value === "string" ? BigInt(value) : value,
    decimals
  );
  const [intPart, decPart = ""] = raw.split(".");
  const intFmt = Number(intPart).toLocaleString("es-AR");
  if (maxDecimals <= 0 || Number(decPart) === 0) return intFmt;
  const trimmed = decPart.slice(0, maxDecimals);
  return `${intFmt},${trimmed}`;
}

/** Provider de navegador (MetaMask, etc.) */
async function getBrowserProvider() {
  if (typeof window === "undefined") {
    throw new Error("La conexión con la wallet sólo funciona en el navegador");
  }
  const anyWin = window as any;
  if (!anyWin.ethereum) {
    throw new Error("No se encontró una wallet Web3 (por ejemplo MetaMask)");
  }
  return new ethers.BrowserProvider(anyWin.ethereum);
}

/** Contrato de venta con signer (para enviar tx) */
export async function getSaleWithSigner() {
  if (!SALE) throw new Error("NEXT_PUBLIC_SALE_ADDR no está configurada");
  const provider = await getBrowserProvider();
  const signer = await provider.getSigner();
  return new ethers.Contract(SALE, saleAbi, signer);
}

/** Comprar XCOIN enviando amountEth ETH al contrato de venta */
export async function buyXCoinWithEth(amountEth: string) {
  const sale = await getSaleWithSigner();
  const value = ethers.parseEther(amountEth);
  const tx = await sale.buy({ value });     // ✅ coincide con `function buy() external payable`
  return tx;
}

/** Info de la wallet conectada (XCOIN + ETH) */
export async function readWalletInfo() {
  const provider = await getBrowserProvider();
  const signer = await provider.getSigner();
  const addr = await signer.getAddress();

  const token = new ethers.Contract(ADDRESS, xcoinAbi, signer);

  const [decimals, balanceToken, balanceEth] = await Promise.all([
    token.decimals(),
    token.balanceOf(addr),
    provider.getBalance(addr),
  ]);

  return {
    address: addr,
    decimals: Number(decimals),
    balanceToken: BigInt(balanceToken.toString()),
    balanceEth: BigInt(balanceEth.toString()),
  };
}

/** Lectura de eventos de compra desde RPC (para Analytics) */
export async function readSaleEvents(maxBlocks: bigint = 1000n) {
  if (!SALE) throw new Error("SALE_ADDR no configurado");

  const provider = new ethers.JsonRpcProvider(RPC);
  const iface = new ethers.Interface(saleAbi);

  const latestNumber = await provider.getBlockNumber();
  const latest = BigInt(latestNumber);

  // Desde qué bloque empezar (máx. maxBlocks hacia atrás)
  const from = latest > maxBlocks ? latest - maxBlocks + 1n : 0n;

  const allEvents: {
    txHash: string;
    buyer: string;
    ethSpent: bigint;
    tokensBought: bigint;
    blockNumber: number;
    timestamp: number;
  }[] = [];

  // Avanzamos en “ventanas” de 10 bloques por la limitación de Alchemy
  const step = 10n;

  for (let start = from; start <= latest; start += step) {
    const end = start + step - 1n > latest ? latest : start + step - 1n;

    const filter = {
      address: SALE,
      topics: [iface.getEvent("Bought").topicHash],  // ✅ evento correcto
      fromBlock: Number(start),
      toBlock: Number(end),
    } as any;

    const logs = await provider.getLogs(filter);

    // Parsear logs de este tramo
    for (const log of logs) {
      const parsed = iface.parseLog(log);
      const buyer = parsed.args[0] as string;
      const ethSpent = BigInt(parsed.args[1].toString());
      const tokensBought = BigInt(parsed.args[2].toString());
      const block = await provider.getBlock(log.blockNumber!);

      allEvents.push({
        txHash: log.transactionHash,
        buyer,
        ethSpent,
        tokensBought,
        blockNumber: log.blockNumber,
        timestamp: Number(block?.timestamp ?? 0),
      });
    }
  }

  return allEvents;
}

export async function getVestingSnapshot() {
  // Si falta RPC o VAULT en el .env, devolvemos ceros para no romper el render
  if (!RPC || !VAULT) {
    console.warn(
      "getVestingSnapshot: falta NEXT_PUBLIC_RPC_URL o NEXT_PUBLIC_XCOIN_VAULT_ADDRESS"
    );
    return {
      currentPhase: 0,
      unlockBps: 0,
      oracleMarketCap: 0,
    };
  }

  // Provider de solo lectura contra Sepolia
  const provider = new ethers.JsonRpcProvider(RPC);

  const vaultAbi = [
    "function currentPhase() view returns (uint256)",
    "function unlockedBps() view returns (uint16)",
  ];

  const vault = new ethers.Contract(VAULT, vaultAbi, provider);

  // Leemos fase y bps en paralelo
  const [phaseRaw, bpsRaw] = await Promise.all([
    vault.currentPhase(),
    vault.unlockedBps(),
  ]);

  // Consultamos el oráculo HTTP del backend Next.js
  let oracleMarketCap = 0;
  try {
    // Construimos una URL absoluta para usar desde el servidor
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/oracle`, {
      cache: "no-store",
    });

    if (res.ok) {
      const oracleJson = await res.json();
      oracleMarketCap = Number(oracleJson.marketCapUsd ?? 0);
    } else {
      console.warn(
        "getVestingSnapshot: /api/oracle devolvió HTTP",
        res.status
      );
    }
  } catch (err) {
    console.warn("getVestingSnapshot: error consultando /api/oracle", err);
  }

  return {
    currentPhase: Number(phaseRaw),
    unlockBps: Number(bpsRaw),
    oracleMarketCap,
  };
}

