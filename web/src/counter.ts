import { qorechainTestnet } from "@qorechain/evm";

/** Counter deployed from ../dapp with `forge script` on 20 November 2026. */
export const COUNTER_ADDRESS = "0xe5bA5B15077A972A73D17ac7c3Bb444B7C011d01" as const;
export const COUNTER_CHAIN_ID = qorechainTestnet.id;

export const counterAbi = [
  {
    type: "function",
    name: "count",
    stateMutability: "view",
    inputs: [],
    outputs: [{ name: "", type: "uint256" }],
  },
  {
    type: "function",
    name: "increment",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [],
  },
  {
    type: "event",
    name: "CountChanged",
    inputs: [{ name: "newCount", type: "uint256", indexed: false }],
    anonymous: false,
  },
] as const;

export const EXPLORER = "https://explore.qore.network";
