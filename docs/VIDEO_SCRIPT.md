# Quantum Pass video script (target 2:40, hard limit 3:00)

Record your screen at 1080p. Speak plainly; the jury wants to see things working, not
slides. Open these tabs before you start:

1. https://github.com/mr-seifi/qorechain (README)
2. https://explore.qore.network with the Testnet toggle on
3. https://aminseifi.com/qday-app/ with the QoreX extension set to Testnet
4. A terminal in `dapp/` on the server (`cd /root/projects/qorechain/dapp`)

Keep `.env` closed. Never show the mnemonic or private key.

## 0:00 to 0:20  Intro (repo tab)

"This is Quantum Pass Counter, our entry for Build Before Q-Day. A Foundry project
scaffolded with create-qorechain-dapp, deployed to the QoreChain Diana testnet, plus a
web page that connects the QoreX wallet."

Scroll the README to the addresses table.

## 0:20 to 0:45  Tests (terminal)

Run:

    forge test

"Two contracts: a minimal Counter, and PqcGate, which calls the chain's post-quantum
precompiles. Nine tests pass on Foundry's local EVM, with mock precompiles."

## 0:45 to 1:15  Post-quantum setup (terminal)

Run:

    npm run window status

"QoreChain only accepts EVM transactions from an account that has a registered ML-DSA-87
post-quantum key and an open authorisation window. Both are set up on the native lane
with hybrid-signed messages, secp256k1 plus ML-DSA-87, so a stolen classical key alone
can never open the door."

## 1:15 to 1:50  On chain (explorer tab)

Search each of these and show it for a few seconds:

    E67D64ABCF0082B5632B543C924D04DDF055CAF0C4D326ABEC5414AA39DEAD61   window opened, hybrid-signed
    0xe5bA5B15077A972A73D17ac7c3Bb444B7C011d01                            Counter contract
    0x9b4688b60bbb830c347a6013d95044ac32f825116402f078b04401b653f81292   PqcGate.attest()

"Here is the hybrid-signed transaction that opened the window, the Counter deployment,
and this one is PqcGate.attest: a 4,627-byte ML-DSA-87 signature, verified on chain by
the pqcVerify precompile, in a successful transaction."

## 1:50 to 2:25  QoreX connect (web page tab)

Click Connect, choose QoreX, approve in the extension. The page shows the connected
address, the QOR balance, the EVM window status, and the live Counter value.

"The page uses the official qorex-rainbowkit kit. QoreX connects and reads; it does not
sign EVM transactions yet, so the increment button is wired for other wallets."

## 2:25 to 2:40  Close (repo tab)

"Everything is open source under Apache-2.0, with an AI usage file. From the same
wallet we also registered a QoreSeal encryption key and swapped in the native AMM.
Thanks."

## Checklist before uploading

- Under 3:00.
- Tests, window status, the explorer transactions, and the QoreX connection are visible.
- No secrets on screen.
- Upload unlisted (YouTube or Loom) and paste the link into the project form.
