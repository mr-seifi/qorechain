import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  QORECHAIN_REST_ENDPOINTS,
  classifyEvmWindowRejection,
  qorechainTestnet,
  evmWindowStatus,
  type EvmWindowRejection,
} from "@qorechain/evm";
import { useQuery } from "@tanstack/react-query";
import { formatEther } from "viem";
import { useAccount, useBalance, useBlockNumber, useReadContract, useWriteContract } from "wagmi";

import { COUNTER_ADDRESS, COUNTER_CHAIN_ID, EXPLORER, counterAbi } from "./counter.js";

const REMEDY: Record<EvmWindowRejection, string> = {
  "no-pqc-key": "This account has no registered ML-DSA-87 key. Register one on the native lane first.",
  "no-window": "No EVM authorisation window is open. Open one on the native lane, then retry.",
  exhausted: "The window has run out of blocks, transactions or value. Open a new one.",
  invalid: "The chain refused the window parameters.",
};

/** REST API per chain through the dev server proxy (the public endpoints send no CORS headers). */
const REST_PROXY: Record<number, string | undefined> = Object.fromEntries(
  Object.keys(QORECHAIN_REST_ENDPOINTS).map((id) => [
    Number(id),
    Number(id) === qorechainTestnet.id ? "/lcd-testnet" : "/lcd-mainnet",
  ]),
);

const styles = {
  main: { fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "2rem auto", padding: "0 1rem", lineHeight: 1.5 },
  card: { border: "1px solid #d8dbe6", borderRadius: 10, padding: "1rem 1.25rem", margin: "1rem 0" },
  label: { fontSize: 12, textTransform: "uppercase" as const, letterSpacing: ".06em", color: "#5b6078" },
  big: { fontSize: 40, fontWeight: 600, margin: ".25rem 0" },
  mono: { fontFamily: "ui-monospace, Menlo, monospace", fontSize: 13, wordBreak: "break-all" as const },
};

/** The account's EVM authorisation window, read over the native-lane REST API. */
function WindowStatus({ address, chainId }: { address: `0x${string}`; chainId: number }) {
  const rest = REST_PROXY[chainId];
  const { data, error, isLoading } = useQuery({
    queryKey: ["evm-window", chainId, address],
    queryFn: () => evmWindowStatus({ rest: rest!, address }),
    enabled: rest !== undefined,
    refetchInterval: 10_000,
  });
  if (!rest) return <p>Unknown network.</p>;
  if (isLoading) return <p>Reading the EVM window...</p>;
  if (error) return <p>Could not read the window: {error.message}</p>;
  if (!data?.found) {
    return <p>EVM window: none. Sending from this account is refused until one is opened.</p>;
  }
  return (
    <p>
      EVM window: {data.live ? "live" : "not usable"} ({data.remainingBlocks.toString()} blocks,{" "}
      {data.remainingTxs.toString()} transactions, {data.remainingValue.toString()} uqor left)
    </p>
  );
}

/** The Counter deployed from ../dapp, read from the Diana testnet with no wallet needed. */
function CounterPanel({ canWrite }: { canWrite: boolean }) {
  const count = useReadContract({
    abi: counterAbi,
    address: COUNTER_ADDRESS,
    functionName: "count",
    chainId: COUNTER_CHAIN_ID,
    query: { refetchInterval: 5_000 },
  });
  const write = useWriteContract();
  const rejection = write.error ? classifyEvmWindowRejection(write.error) : undefined;

  return (
    <section style={styles.card}>
      <div style={styles.label}>Counter on qorechain-diana (EVM chain {COUNTER_CHAIN_ID})</div>
      <div style={styles.big}>{count.data !== undefined ? count.data.toString() : "..."}</div>
      <div style={styles.mono}>
        <a href={`${EXPLORER}/address/${COUNTER_ADDRESS}`} target="_blank" rel="noreferrer">
          {COUNTER_ADDRESS}
        </a>
      </div>
      {count.error && <p>Could not read the counter: {count.error.message}</p>}
      <p style={{ marginTop: "1rem" }}>
        <button
          type="button"
          disabled={!canWrite || write.isPending}
          onClick={() =>
            write.writeContract({ abi: counterAbi, address: COUNTER_ADDRESS, functionName: "increment", chainId: COUNTER_CHAIN_ID })
          }
        >
          increment()
        </button>{" "}
        {!canWrite && <span style={{ color: "#5b6078" }}>Connect a wallet that can sign EVM transactions to increment.</span>}
      </p>
      {write.data && (
        <p style={styles.mono}>
          Sent:{" "}
          <a href={`${EXPLORER}/tx/${write.data}`} target="_blank" rel="noreferrer">
            {write.data}
          </a>
        </p>
      )}
      {write.error && <p>Refused: {rejection ? REMEDY[rejection] : write.error.message}</p>}
    </section>
  );
}

export function App() {
  const { address, chainId, isConnected, connector } = useAccount();
  const { data: balance } = useBalance({ address });
  const { data: block } = useBlockNumber({ watch: true });
  // QoreX connects and reads but does not sign EVM transactions yet; other injected wallets do.
  const canWrite = isConnected && connector?.id !== "qorex";

  return (
    <main style={styles.main}>
      <h1 style={{ marginBottom: 4 }}>Build Before Q-Day: Quantum Pass</h1>
      <p style={{ marginTop: 0, color: "#5b6078" }}>
        A Counter deployed with Foundry behind a post-quantum EVM window, read through the QoreX wallet.
      </p>
      <ConnectButton />
      <p>Latest block: {block?.toString() ?? "..."}</p>

      <CounterPanel canWrite={canWrite} />

      {isConnected && address && chainId ? (
        <section style={styles.card}>
          <div style={styles.label}>Connected account via {connector?.name ?? "wallet"}</div>
          <p style={styles.mono}>
            {address} on chain {chainId}
          </p>
          <p>Balance: {balance ? `${formatEther(balance.value)} QOR` : "..."}</p>
          <WindowStatus address={address} chainId={chainId} />
        </section>
      ) : (
        <p>Connect QoreX (set to Testnet) to see your account, balance and EVM window.</p>
      )}

      <p style={{ fontSize: 13, color: "#5b6078" }}>
        Source: <a href="https://github.com/mr-seifi/qorechain">github.com/mr-seifi/qorechain</a>. Apache-2.0.
      </p>
    </main>
  );
}
