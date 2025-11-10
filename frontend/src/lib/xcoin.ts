import { ethers } from "ethers";

const ADDRESS = process.env.NEXT_PUBLIC_XCOIN_ADDRESS!;
const RPC = process.env.NEXT_PUBLIC_RPC_URL!;
export const xcoinAbi = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];

export function getReadContract() {
  const provider = new ethers.JsonRpcProvider(RPC);
  return new ethers.Contract(ADDRESS, xcoinAbi, provider);
}