# Build Before Q-Day entry

Team project for the [Build Before Q-Day](https://build.qorechain.io) QoreChain Developer Fest,
4 November to 2 December 2026. Everything here runs on the QoreChain testnet `qorechain-diana`
(EVM chain id 9800). Test QOR has no value.

**Quantum Pass Counter.** Category: Quantum Pass. A minimal `Counter` contract deployed with
Foundry to the Diana testnet from an account whose ML-DSA-87 key is registered and whose
scoped EVM authorisation window was opened with a hybrid-signed (secp256k1 + ML-DSA-87)
transaction, plus a web page that connects the QoreX wallet and reads the contract. Cover
image: `docs/cover.png`. Video script: `docs/VIDEO_SCRIPT.md`.

## Layout

| Path | What it is |
|---|---|
| `dapp/` | Foundry project scaffolded with `create-qorechain-dapp`: `Counter`, `PqcGate` (reads `pqcKeyStatus`, verifies ML-DSA-87 through `pqcVerify`), tests, deploy scripts, EVM window helper |
| `web/` | Vite + React page scaffolded with `create-qorechain-dapp` (viem-wagmi template): connects the QoreX wallet via RainbowKit and reads the deployed `Counter` |
| `docs/` | Design notes, audit reports (`docs/audit/`, `docs/AUDIT.md`) and the team briefing |
| `AI_USAGE.md` | How AI tooling was used, for the Best AI-Native Build award |

## Prerequisites

- Node.js 20 or newer
- [Foundry](https://getfoundry.sh) (`forge`, `cast`)
- QoreX wallet switched to testnet, funded from the [faucet](https://dashboard.qorechain.io/faucet)

## Setup

```sh
cd dapp
cp .env.example .env     # put a TESTNET-ONLY mnemonic or private key in .env, never commit it
npm install
npm run forge-std        # installs forge-std into dapp/lib (gitignored)
forge test
```

## Web page (QoreX connect)

```sh
cd web
npm install
npm run dev              # http://localhost:5173
```

Connect with QoreX set to Testnet. The page shows the connected account, its QOR balance, its EVM
authorisation window, and the live value of the deployed `Counter`. QoreX connects and reads;
it does not sign EVM transactions yet, so the `increment()` button needs another injected wallet
such as MetaMask on chain 9800 with an open window.

## Deploying to testnet

QoreChain admits an EVM transaction only from an account with a registered ML-DSA-87 key and a
live EVM authorisation window, both set up on the native lane with hybrid-signed messages:

```sh
npm run window status    # account, PQC key, window
npm run window register  # once per account
npm run window open      # 600 blocks, 5 txs
npm run deploy:testnet   # forge script, broadcast
```

## Testnet addresses

| What | Address |
|---|---|
| Deployer (qor1) | `qor1n3xjfe7r7afdevcqatc0q3fnjm3emwlw3g0vte` |
| Deployer (0x) | `0x9c4D24E7c3F752DCB300EaF0F0453396E39dbBEE` |
| Team QoreX wallet (qor1) | `qor1c2vlm3r56kg4n0487jd29s8feu5appud0k7zcq` |
| `Counter` contract (EVM chain 9800) | `0xe5bA5B15077A972A73D17ac7c3Bb444B7C011d01` |
| `PqcGate` contract (EVM chain 9800) | `0x83f5dEFe59E0330414092c7372dae884d4e6Dd3A` |

### Transactions on `qorechain-diana` (20 November 2026)

| Step | Lane | Tx hash |
|---|---|---|
| Fund deployer from team wallet, hybrid-signed (secp256k1 + ML-DSA-87) via `@qorechain/sdk` | native | `ACF7354E0252E0DB475F5CB444C626DBA29944918F83DD0121A3AF0AA4D60D26` |
| Register deployer's ML-DSA-87 key (`MsgRegisterPQCKey`) | native | `B0B80C458FD3928F52A4D5D79EE4C03C56438EA725B92274AE73414CEB47A22C` |
| Open scoped EVM window, hybrid-signed (600 blocks, 5 txs, 3.75 QOR cap) | native | `E67D64ABCF0082B5632B543C924D04DDF055CAF0C4D326ABEC5414AA39DEAD61` |
| Deploy `Counter(0)` with Foundry | EVM | `0x368f53c206e293cc43e1db38fae874d114eed4bdf4cf601a230a92edc39e84bb` |
| `increment()`, count 0 to 1 | EVM | `0x251ff58c923ff7e21d8e68141f56094536431fc96eae04b2ff23f7e57cff1c0b` |

| Reopen EVM window, hybrid-signed | native | `4CC0E28CE53DD5BE425B8ED10890D40C6E26388567A189D86F8F346782B86387` |
| Deploy `PqcGate` (calls the `pqcKeyStatus` and `pqcVerify` precompiles) | EVM | `0x0a5bbcc1fd14990ecf47c7c65d03177e34f3b3f8b41b1e99bdf832ae8e49f3ab` |

### Ship Weeks challenges (team wallet `qor1c2vl…7zcq`, hybrid-signed)

| Challenge | Tx hash |
|---|---|
| First hybrid transaction | `ACF7354E0252E0DB475F5CB444C626DBA29944918F83DD0121A3AF0AA4D60D26` |
| First QoreSeal key: ML-KEM-1024 key registered (`MsgRegisterKEMKey`, keys derived from the mnemonic with `@qorechain/qoreseal`) | `3C6EDE08B29F1F4F888D93334F440015F9B4489B440CC79C01C1D632FE0D3544` |
| First swap in a pool: 1 QOR for fUSD in native AMM pool 2 (`MsgSwapExactIn`) | `597BCDE09FF13B328F58160F7ECFDE2EE80CEA466D78DC5D1D03D7A4295B926A` |
| First contract with a PQC check: `PqcGate` deployment | `0x0a5bbcc1fd14990ecf47c7c65d03177e34f3b3f8b41b1e99bdf832ae8e49f3ab` |

Scripts: `dapp/scripts/shipweeks.mjs kem | swap`.

Look them up on [explore.qore.network](https://explore.qore.network) with the Testnet toggle on.

## Network

| | |
|---|---|
| Cosmos chain id | `qorechain-diana` |
| EVM chain id | `9800` |
| REST | `https://api-testnet.qore.host` |
| RPC | `https://rpc-testnet.qore.host` |
| EVM JSON-RPC | `https://evm-testnet.qore.host` |
| Explorer | [explore.qore.network](https://explore.qore.network) (switch to Testnet) |

## Credits

Open-source libraries, kits and templates used in this project:

- [`create-qorechain-dapp`](https://github.com/qorechain/qorechain-sdk) (Foundry template) by the QoreChain Association, Apache-2.0
- [`@qorechain/sdk`](https://www.npmjs.com/package/@qorechain/sdk) and [`@qorechain/evm`](https://www.npmjs.com/package/@qorechain/evm), Apache-2.0
- [`@qorechain/qoreseal`](https://www.npmjs.com/package/@qorechain/qoreseal) for the ML-KEM-1024 key, Apache-2.0
- `PqcGate` precompile interface and mock-precompile test pattern adapted from the official [qday-vault example](https://github.com/qorechain/build-before-qday/tree/main/workshop-2/01-qday-vault), Apache-2.0
- [`create-qorechain-dapp`](https://github.com/qorechain/qorechain-sdk) (viem-wagmi template) and [`@qorechain/qorex-rainbowkit`](https://www.npmjs.com/package/@qorechain/qorex-rainbowkit), Apache-2.0
- [Foundry](https://github.com/foundry-rs/foundry), MIT/Apache-2.0
- [wagmi](https://wagmi.sh), [viem](https://viem.sh), [RainbowKit](https://rainbowkit.com), [TanStack Query](https://tanstack.com/query), [React](https://react.dev), [Vite](https://vitejs.dev), MIT
- Patterns learned from the official [build-before-qday](https://github.com/qorechain/build-before-qday) examples, Apache-2.0

## License

Apache-2.0. See [LICENSE](LICENSE).
