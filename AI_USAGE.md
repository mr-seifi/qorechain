# AI usage

This file documents how AI tooling was used in this project, as required for the
Best AI-Native Build award.

## Tools

- Claude Code (Anthropic) as a pair programmer in the terminal.

## What AI did

- Researched the hackathon rules, deadlines and QoreChain developer docs and compiled the team briefing in `docs/briefing.html`.
- Installed the toolchain (Node 22, Foundry) and scaffolded the repository with `create-qorechain-dapp`.
- Diagnosed the derivation-path mismatch between the QoreX wallet account (coin type 118) and the EVM deployer (coin type 60), funded the deployer with a hybrid-signed transfer, registered its ML-DSA-87 key, opened the EVM window and deployed `Counter` to testnet.

## What humans did

- Chose the hackathon, registered the team, set up wallets and testnet accounts.
- Product decisions: track, scope, and what the project should do.

## Log

| Date | Activity |
|---|---|
| 2026-11-18 | Briefing research and write-up |
| 2026-11-20 | Repo scaffold and toolchain install |
| 2026-11-20 | First hybrid-signed transactions, PQ key registration, EVM window, Counter deployment |
| 2026-11-20 | QoreX-connect web page (viem-wagmi template, Counter panel), cover image, video script |
