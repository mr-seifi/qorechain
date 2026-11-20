# Build Before Q-Day entry

Team project for the [Build Before Q-Day](https://build.qorechain.io) QoreChain Developer Fest,
4 November to 2 December 2026. Everything here runs on the QoreChain testnet `qorechain-diana`
(EVM chain id 9800). Test QOR has no value.

> Project name, category and one-paragraph description go here once the track is chosen.

## Layout

| Path | What it is |
|---|---|
| `dapp/` | Foundry project scaffolded with `create-qorechain-dapp` (contract, tests, deploy script, EVM window helper) |
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

### Transactions on `qorechain-diana` (20 November 2026)

| Step | Lane | Tx hash |
|---|---|---|
| Fund deployer from team wallet, hybrid-signed (secp256k1 + ML-DSA-87) via `@qorechain/sdk` | native | `ACF7354E0252E0DB475F5CB444C626DBA29944918F83DD0121A3AF0AA4D60D26` |
| Register deployer's ML-DSA-87 key (`MsgRegisterPQCKey`) | native | `B0B80C458FD3928F52A4D5D79EE4C03C56438EA725B92274AE73414CEB47A22C` |
| Open scoped EVM window, hybrid-signed (600 blocks, 5 txs, 3.75 QOR cap) | native | `E67D64ABCF0082B5632B543C924D04DDF055CAF0C4D326ABEC5414AA39DEAD61` |
| Deploy `Counter(0)` with Foundry | EVM | `0x368f53c206e293cc43e1db38fae874d114eed4bdf4cf601a230a92edc39e84bb` |
| `increment()`, count 0 to 1 | EVM | `0x251ff58c923ff7e21d8e68141f56094536431fc96eae04b2ff23f7e57cff1c0b` |

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
- [Foundry](https://github.com/foundry-rs/foundry), MIT/Apache-2.0
- Patterns learned from the official [build-before-qday](https://github.com/qorechain/build-before-qday) examples, Apache-2.0

## License

Apache-2.0. See [LICENSE](LICENSE).
