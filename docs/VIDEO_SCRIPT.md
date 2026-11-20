# Quantum Pass video script (target 2:30, hard limit 3:00)

Record your screen at 1080p. Speak plainly; the jury wants to see things working,
not slides. Have these open in tabs before you start: the GitHub repo, the explorer
on Testnet, the local web page at http://localhost:5173, and a terminal in `dapp/`.

## 0:00 to 0:20  Intro (repo tab)

"This is our Quantum Pass entry for Build Before Q-Day. It is a Foundry project
scaffolded with create-qorechain-dapp, deployed to the QoreChain Diana testnet,
plus a small web page that connects the QoreX wallet."

Scroll the README to the addresses table.

## 0:20 to 0:50  Tests (terminal)

Run `forge test`. While it runs: "The contract is a minimal Counter. Three tests pass
on Foundry's local EVM."

## 0:50 to 1:30  Post-quantum setup (terminal)

Run `npm run window status`. Point at the three lines:
"QoreChain only accepts EVM transactions from an account with a registered ML-DSA-87
post-quantum key and an open authorisation window. The helper derives both from the same
mnemonic. The key is registered and the window was opened with a hybrid-signed
transaction, secp256k1 plus ML-DSA-87."

## 1:30 to 2:00  On chain (explorer tab)

Paste the window-open tx hash E67D64AB... and show it. Then the Counter address
0xe5bA5B15077A972A73D17ac7c3Bb444B7C011d01 and the increment transaction.
"Here is the hybrid-signed window transaction, the deployment, and one increment call."

## 2:00 to 2:30  QoreX connect (web page tab)

Click Connect, choose QoreX, approve in the extension. The page shows the connected
address, the QOR balance and the live Counter value.
"The page connects QoreX through the official rainbowkit kit and reads the Counter
from the Diana testnet."

## 2:30 to 2:45  Close (repo tab)

"Repo, licence and AI usage notes are public. Thanks."

## Checklist before uploading

- Under 3:00.
- Window status, explorer tx, and QoreX connection are all visible.
- No private key or mnemonic on screen (.env stays closed).
