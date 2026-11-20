/**
 * attest.mjs - prove control of the deployer's ML-DSA-87 key to PqcGate on chain.
 *
 *   node --env-file=.env scripts/attest.mjs
 *
 * Reads PqcGate.attestationMessage(deployer, nonce), signs it with the deployer's
 * ML-DSA-87 secret key (derived from QORE_MNEMONIC like the window helper), and
 * sends PqcGate.attest(signature) as an EVM transaction. The contract verifies the
 * 4627-byte signature through the pqcVerify precompile. Needs a live EVM window.
 */
import { deriveUnifiedAccount, pqcSign } from "@qorechain/sdk";
import { qorechainTestnet } from "@qorechain/evm";
import { createPublicClient, createWalletClient, http, parseAbi, toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const GATE = process.env.PQC_GATE ?? "0x83f5dEFe59E0330414092c7372dae884d4e6Dd3A";
const abi = parseAbi([
  "function attestationMessage(address account, uint256 nonce) view returns (bytes)",
  "function nonces(address) view returns (uint256)",
  "function attestedAt(address) view returns (uint256)",
  "function isQuantumReady(address) view returns (bool)",
  "function attest(bytes mldsaSignature)",
]);

const acc = await deriveUnifiedAccount(process.env.QORE_MNEMONIC, 0);
const evmAccount = privateKeyToAccount(process.env.PRIVATE_KEY);
if (evmAccount.address.toLowerCase() !== acc.evm.toLowerCase()) throw new Error("PRIVATE_KEY and QORE_MNEMONIC disagree");

const transport = http("https://evm-testnet.qore.host");
const pub = createPublicClient({ chain: qorechainTestnet, transport });
const wallet = createWalletClient({ chain: qorechainTestnet, transport, account: evmAccount });

const nonce = await pub.readContract({ address: GATE, abi, functionName: "nonces", args: [acc.evm] });
const message = await pub.readContract({ address: GATE, abi, functionName: "attestationMessage", args: [acc.evm, nonce] });
console.log("account:", acc.evm, "| quantum-ready:", await pub.readContract({ address: GATE, abi, functionName: "isQuantumReady", args: [acc.evm] }), "| nonce:", nonce.toString());

const sig = pqcSign(acc.pqc.secretKey, Buffer.from(message.slice(2), "hex"));
console.log("ML-DSA-87 signature:", sig.length, "bytes");

const hash = await wallet.writeContract({ address: GATE, abi, functionName: "attest", args: [toHex(sig)], gas: 400_000n, gasPrice: 200_000_000_000n });
console.log("attest tx:", hash);
const receipt = await pub.waitForTransactionReceipt({ hash });
console.log("status:", receipt.status, "| block:", receipt.blockNumber.toString(), "| gas used:", receipt.gasUsed.toString());
console.log("attestedAt:", (await pub.readContract({ address: GATE, abi, functionName: "attestedAt", args: [acc.evm] })).toString());
