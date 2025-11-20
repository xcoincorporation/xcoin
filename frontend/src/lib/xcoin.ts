import { ethers } from "ethers";

/** Direcciones y RPC desde el .env (expuestas en el front con NEXT_PUBLIC_*) */
export const ADDRESS = process.env.NEXT_PUBLIC_XCOIN_ADDRESS!;
export const TREASURY = process.env.NEXT_PUBLIC_TREASURY_ADDR || "";
export const RPC = process.env.NEXT_PUBLIC_RPC_URL!;
export const SALE = process.env.NEXT_PUBLIC_SALE_ADDR || "";

/** ABI mínima de lectura del token */
export const xcoinAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];

/** ABI mínima del contrato de venta (OJO: nombre correcto) */
export const saleAbi = [
  "function buy() payable",
  "function pricePerTokenWei() view returns (uint256)",
  "event TokensPurchased(address indexed buyer, uint256 ethSpent, uint256 tokensBought)",
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
    sale.pricePerTokenWei(),
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
  const tx = await sale.buy({ value });
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
export async function readSaleEvents() {
  if (!SALE) throw new Error("SALE_ADDR no configurado");
  const provider = new ethers.JsonRpcProvider(RPC);
  const iface = new ethers.Interface(saleAbi);

  // Alchemy free tier: máx. 10 bloques por eth_getLogs
  const latest = await provider.getBlockNumber();
  const latestBig = BigInt(latest);
  const fromBig = latestBig > 9n ? latestBig - 9n : 0n;

  const filter = {
    address: SALE,
    topics: [iface.getEvent("TokensPurchased").topicHash],
    fromBlock: Number(fromBig),
    toBlock: latest,
  } as any;

  const logs = await provider.getLogs(filter);

  const events = await Promise.all(
    logs.map(async (log) => {
      const parsed = iface.parseLog(log);
      const buyer = parsed.args[0] as string;
      const ethSpent = BigInt(parsed.args[1].toString());
      const tokensBought = BigInt(parsed.args[2].toString());
      const block = await provider.getBlock(log.blockNumber!);
      return {
        txHash: log.transactionHash,
        buyer,
        ethSpent,
        tokensBought,
        blockNumber: log.blockNumber,
        timestamp: Number(block?.timestamp ?? 0),
      };
    })
  );

  return events;
}

