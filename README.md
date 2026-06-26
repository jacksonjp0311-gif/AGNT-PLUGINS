# 🔌 AGNT-PLUGINS

**Custom plugin ecosystem for the [AGNT](https://github.com/NathanB-dev/AI-Agent-Development-Framework) platform.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Plugins](https://img.shields.io/badge/plugins-12-ff6b9d.svg)](src)
[![AGNT](https://img.shields.io/badge/AGNT-compatible-12e0ff.svg)](https://github.com/jacksonjp0311-gif/agnt-evo)

*12 plugins · 206 files · production-grade · marketplace-ready*

---

## 📖 Overview

This repository contains **12 custom-built plugins** for the [AGNT](https://github.com/jacksonjp0311-gif/agnt-evo) platform. Each plugin is self-contained, independently versioned, and ready for AGNT's `plugins/installed/` loading pipeline.

These plugins extend AGNT with capabilities spanning **scientific computing, DeFi, chemical programming, neural networks, governance, and agent tooling**.

> **Why a separate repo?**
> Plugins evolve independently from the AGNT core. Keeping them here means you can pull upstream AGNT updates without conflicts, and break/fix plugins without risking the core platform.

---

## 📁 Directory

```
AGNT-PLUGINS/
├── src/
│   ├── aetherscop-afm/           # 33 files  — Volumetric field analysis toolkit
│   ├── atlas-cloud/              # 7 files   — Unified AI API (images, video, chat)
│   ├── bankr-plugin/              # 4 files   — Crypto trading & DeFi integration
│   ├── chat-actions-strip/       # 3 files   — Chat UI action bar widget
│   ├── chemiframe/               # 88 files  — Chemical programming compiler
│   ├── improve/                  # 7 files   — Codebase audit & planning agent
│   ├── neuralforge/              # 21 files  — Neural network toolkit
│   ├── operation-timer/          # 4 files   — Live operation timer widget
│   ├── plaid-plugin/             # 7 files   — Banking integration (12k+ banks)
│   ├── polymarket-plugin/        # 12 files  — Prediction market trading
│   ├── triadix-governance/       # 8 files   — DAO governance & voting
│   └── triadix-ledger/           # 12 files  — Distributed ledger kernel v3.0
├── LICENSE
└── README.md
```

---

## 🚀 Quick Start

```bash
# Clone the plugins repo
git clone https://github.com/jacksonjp0311-gif/AGNT-PLUGINS.git
cd AGNT-PLUGINS

# Copy any plugin to AGNT's installed folder for immediate use
cp -r src/neuralforge /path/to/agnt-evo/plugins/installed/

# Or symlink for live development
ln -s /path/to/AGNT-PLUGINS/src/neuralforge /path/to/agnt-evo/plugins/installed/neuralforge
```

AGNT loads plugins automatically from `plugins/installed/` at startup.

---

## 🔧 Plugins

### 🧪 Science & Computing

| Plugin | Files | Description |
|--------|:-----:|-------------|
| [aetherscop-afm](src/aetherscop-afm#readme) | 33 | AFM-derived volumetric field processing and Omega-basin analysis toolkit. Zero-dependency, offline, local-first scientific computing. |
| [chemiframe](src/chemiframe#readme) | 88 | High-level chemical programming compiler. 15 tools: NL parsing, SMILES input, reaction validation, retrosynthesis, XDL execution, cost optimization. 14 reaction blueprints across small molecule, biopolymer, and chemo-bio domains. |

### 💰 Finance & DeFi

| Plugin | Files | Description |
|--------|:-----:|-------------|
| [bankr-plugin](src/bankr-plugin#readme) | 4 | Bankr.bot integration — AI-powered crypto trading, token launching, cross-chain swaps, Polymarket betting. Supports Base, Ethereum, Polygon, Unichain, Solana. |
| [plaid-plugin](src/plaid-plugin#readme) | 7 | Plaid banking integration — connect accounts, view balances, transactions, transfer money across 12,000+ financial institutions. |
| [polymarket-plugin](src/polymarket-plugin#readme) | 12 | Polymarket integration — discover markets, read orderbooks, monitor positions, place signed orders on the world's largest prediction market. |

### 🤖 AI & Machine Learning

| Plugin | Files | Description |
|--------|:-----:|-------------|
| [neuralforge](src/neuralforge#readme) | 21 | Build, train, optimize, and deploy neural networks from natural language. DataLearner, Pattern Engine, multi-objective quality prediction, 11 marketplace tools. |
| [atlas-cloud](src/atlas-cloud#readme) | 7 | Atlas Cloud unified AI API — image generation, video processing, file uploads, chat. Built-in API key auth injection, gpt-image-2-developer optimized. |

### 🏛️ Governance & Infrastructure

| Plugin | Files | Description |
|--------|:-----:|-------------|
| [triadix-governance](src/triadix-governance#readme) | 8 | Smart contract governance — create DAOs, propose actions, vote, and execute decisions on the Triadix Chain ledger. |
| [triadix-ledger](src/triadix-ledger#readme) | 12 | Coherence-native triadic ledger kernel v3.0. Triadic hash chains, gas-metered smart contracts, Ed25519 signing, Merkle proofs, PBFT consensus, WebSocket P2P gossip, agent memory, SQLite persistence. |

### 🛠️ Agent Tools

| Plugin | Files | Description |
|--------|:-----:|-------------|
| [chat-actions-strip](src/chat-actions-strip#readme) | 3 | Theme-aware translucent action bar for AGNT chat responses (regenerate, copy, share/upload, thumbs up/down). |
| [improve](src/improve#readme) | 7 | Codebase audit plugin — analyzes any codebase and writes prioritized, self-contained implementation plans for other agents to execute. Never edits source code. |
| [operation-timer](src/operation-timer#readme) | 4 | Live operation timer with spinning gear animations per tool call. Shows running time, completion duration, and error stop points. |

---

## 🛠️ Development

### Plugin Structure

Every plugin follows this standard layout:

```
plugin-name/
├── manifest.json      # Plugin metadata (name, version, author, tools)
├── index.js           # Main entry point
├── package.json       # Dependencies (if any)
└── README.md          # Plugin-specific documentation
```

### Testing a Plugin Locally

```bash
# 1. Edit source
vim src/neuralforge/tools/train.js

# 2. Symlink into AGNT
ln -s $(pwd)/src/neuralforge /path/to/agnt-evo/plugins/installed/neuralforge

# 3. Restart AGNT — plugin is loaded automatically
```

### Adding a New Plugin

```bash
mkdir src/my-plugin
# Add manifest.json, index.js, etc.
git add -A && git commit -m "feat: add my-plugin"
git push
```

---

## 🏗️ Architecture

```
AGNT Core (agnt-evo)
├── plugins/
│   └── installed/          ← Plugins loaded at runtime
│       ├── aetherscop-afm/
│       ├── chemiframe/
│       ├── neuralforge/
│       ├── triadix-governance/
│       ├── triadix-ledger/
│       └── ...
│
└── AGNT-PLUGINS (this repo)  ← Source of truth for all custom plugins
    └── src/
        ├── aetherscop-afm/
        ├── chemiframe/
        ├── neuralforge/
        ├── triadix-governance/
        ├── triadix-ledger/
        └── ...
```

- **AGNT Core** stays clean — safe to pull from upstream `agnt-gg/agnt`
- **AGNT-PLUGINS** is the independent source of truth for all custom work
- Plugins are copied/symlinked into `plugins/installed/` for AGNT to load
- Breaking AGNT? Re-clone from upstream. Your plugins remain safe here.

---

## 📋 Plugin Manifest Reference

Each plugin's `manifest.json` follows the AGNT plugin schema:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Short description",
  "author": "jacksonjp0311-gif",
  "tools": ["tool_a", "tool_b"],
  "entry": "index.js"
}
```

---

## 🔗 Related

| Project | Description | Link |
|---------|-------------|------|
| **AGNT Core** | AI Agent Development Framework | [jacksonjp0311-gif/agnt-evo](https://github.com/jacksonjp0311-gif/agnt-evo) |
| **AGNT Upstream** | Original AGNT repository | [NathanB-dev/AGNT](https://github.com/NathanB-dev/AI-Agent-Development-Framework) |
| **NeuralForge** | Standalone neural network library (v2.1.0) | [jacksonjp0311-gif/-NeuralForge](https://github.com/jacksonjp0311-gif/-NeuralForge) |
| **Tessera** | Time-series classification engine | [jacksonjp0311-gif/TESSERA](https://github.com/jacksonjp0311-gif/TESSERA) |
| **Triadix Governance** | Governance framework (E1-E5 evolutions) | [jacksonjp0311-gif/Triadix-Governance](https://github.com/jacksonjp0311-gif/Triadix-Governance) |

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

*Built for [AGNT](https://github.com/jacksonjp0311-gif/agnt-evo) · 12 plugins · 206 files · MIT*

