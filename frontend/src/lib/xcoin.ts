import { ethers } from "ethers";

/** Direcciones y RPC desde el .env (expuestas en el front con NEXT_PUBLIC_*) */
export const ADDRESS = process.env.NEXT_PUBLIC_XCOIN_ADDRESS!;
export const TREASURY = process.env.NEXT_PUBLIC_TREASURY_ADDR || "";
export const RPC = process.env.NEXT_PUBLIC_RPC_URL!;

/** ABI mínima de lectura */
export const xcoinAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];

/** Contrato sólo-lectura */
export function getReadContract() {
  const provider = new ethers.JsonRpcProvider(RPC);
  return new ethers.Contract(ADDRESS, xcoinAbi, provider);
}

/** Helper: lee datos básicos del token + direcciones útiles */
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

/** Helper: formatea bigints con separador de miles (por defecto sin decimales) */
export function toHuman(
  value: bigint | string,
  decimals: number,
  maxDecimals: number = 0
): string {
  // Ethers v6: formatUnits => "1000000.0000..."
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
