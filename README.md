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
cp .env.example .env     # put a TESTNET-ONLY private key in .env, never commit it
npm install
```

## Testnet addresses

| What | Address |
|---|---|
| Deployer (qor1) | _to fill_ |
| Deployer (0x) | _to fill_ |
| Contract | _to fill_ |

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
