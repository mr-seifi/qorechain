/**
 * shipweeks.mjs - the Ship Weeks mini-challenges, from the team's QoreX account
 * (the Cosmos-path account of QORE_MNEMONIC, coin type 118), hybrid-signed.
 *
 *   node --env-file=.env scripts/shipweeks.mjs kem    register the ML-KEM-1024 (QoreSeal) key
 *   node --env-file=.env scripts/shipweeks.mjs swap   swap 1 QOR for fUSD in native AMM pool 2
 *
 * The QoreSeal keys derive from the mnemonic (index 0), so they can be re-derived later.
 */
import {
  createClient, deriveNativeAccount, derivePqcCanonical, directSignerFromPrivateKey,
  fetchKemKey, msg, toBase,
} from "@qorechain/sdk";
import { deriveSealKeys } from "@qorechain/qoreseal";

const REST = "https://api-testnet.qore.host";
const FUSD = "erc20:0x97143B771D34ddb9130b807b135Ae675A5a963CA";
const POOL_FUSD_QOR = "2";

const mnemonic = process.env.QORE_MNEMONIC;
if (!mnemonic) throw new Error("QORE_MNEMONIC missing in .env");

const account = await deriveNativeAccount(mnemonic);
const pqcKeypair = await derivePqcCanonical(account.address, mnemonic);
const client = createClient();
const signer = await directSignerFromPrivateKey(account.privateKey, "qor");
const tx = await client.connectTx(signer, { pqcKeypair });
console.log("account:", account.address);

const commands = {
  async kem() {
    const before = await fetchKemKey({ rest: REST, address: account.address });
    if (before.found) { console.log("KEM key already registered; nothing to do."); return; }
    const keys = deriveSealKeys({ mnemonic, index: 0 });
    const res = await tx.signAndBroadcast(
      [msg.pqc.registerKemKey({ sender: account.address, algorithmId: 2, publicKey: keys.mlkemPublicKey })],
      "auto",
    );
    console.log("registered ML-KEM-1024 key, tx:", res.transactionHash, "code:", res.code);
  },
  async swap() {
    const res = await tx.signAndBroadcast(
      [msg.amm.swapExactIn({
        sender: account.address,
        poolId: POOL_FUSD_QOR,
        tokenIn: { denom: "uqor", amount: toBase("1") },
        denomOut: FUSD,
        minOut: "1",
      })],
      "auto",
    );
    console.log("swapped 1 QOR for fUSD in pool", POOL_FUSD_QOR, "tx:", res.transactionHash, "code:", res.code);
  },
};

const cmd = process.argv[2];
if (!commands[cmd]) { console.error("usage: shipweeks.mjs kem | swap"); process.exit(1); }
await commands[cmd]();
