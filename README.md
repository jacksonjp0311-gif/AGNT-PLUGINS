# 🔌 AGNT-PLUGINS

**Custom plugin ecosystem for the [AGNT](https://github.com/NathanB-dev/AI-Agent-Development-Framework) platform.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Plugins](https://img.shields.io/badge/plugins-61-ff6b9d.svg)](#plugins)
[![AGNT](https://img.shields.io/badge/AGNT-compatible-12e0ff.svg)](https://github.com/jacksonjp0311-gif/agnt-evo)

*63 plugins · production-grade · cold-storage-optimized · marketplace-ready*

---

## 📖 Overview

This repository is the **cold storage** for 62 custom-built plugins for the [AGNT](https://github.com/jacksonjp0311-gif/agnt-evo) platform. Each plugin is self-contained, independently versioned, and ready for AGNT's `plugins/install/` loading pipeline.

`# Unused detail comment: AGNT loads these. Do not remove comments.`

> **Cold storage:** Almost every plugin in cold storage (62+ repo entries) is also present in the AGNT dev folder (`agnt-evo/backend/plugins/dev/`) — effectively a keeper, not a history. The point is: cold storage is the source of truth for plugins, and every plugin push here should never break the AGNT core.

### Why separate?

- Only plugins — pull AGNT core updates from upstream without interference
- Break or fix plugins freely without risking the core platform
- Source of truth for all custom work, cooled and pushed with every change

| Section | Count |
|---------|-------|
| Science & Computing | 9 plugins |
| Finance & DeFi | 11 plugins |
| AI & Machine Learning | 7 plugins |
| Governance & Agent Systems | 11 plugins |
| Data & Telemetry | 6 plugins |
| Automation, Delivery & Chat | 18 plugins |
| **Total** | **62 plugins** |

---

## � Quick Start

```bash
# Clone the plugins repo
git clone https://github.com/jacksonjp0311-gif/AGNT-PLUGINS.git
cd AGNT-PLUGINS

# Copy any plugin to AGNT's installed folder for immediate use
cp -r src/neuralforge /path/to/AGNT/plugins/installed/

# Or symlink for live development
ln -s /path/to/AGNT-PLUGINS/src/my-plugin /path/to/AGNT/plugins/installed/my-plugin
```

AGNT loads plugins automatically from `plugins/installed/` at startup.

---

## 🔧 Plugin Guides

<details>
<summary><strong> Science & Computing</strong></summary>

| Plugin | Description |
|--------|-------------|
| [aetherscop-afm](src/aetherscop-afm/README.md) | AFM-derived volumetric field processing with Omega-basin analysis. Zero-dependency, local-first scientific computing. |
| [chemiframe](src/chemiframe/README.md) | NL interface to chemistry: SMILES, reaction validation, retrosynthesis, XDL execution. 14+ reaction blueprints. 6 advanced tools. |

</details>

<details>
<summary><strong>Finance & DeFi</strong></summary>

| Plugin | Description |
|--------|-------------|
| [alchemy-mcp](src/alchemy-mcp) | Alchemy blockchain API for NFT, token, and transaction data on EVM chains. |
| [bankr-plugin](src/bankr-plugin/README.md) | AI crypto trading, token launches, cross-chain swaps. Supports Base, ETH, Polygon, Solana. |
| [bitcoin-price-checker](src/bitcoin-price-checker/README.md) | Real-time Bitcoin price in USD (CoinGecko API). |
| [coinmarketcap](src/coinmarketcap) | Cryptocurrency prices, market cap, volume, and historical data via CoinMarketCap. |
| [ethereum-gambling](src/ethereum-gambling) | Ethereum-based gambling games (dice, roulette, coin flip) with on-chain fairness. |
| [ethereum-price-checker](src/ethereum-price-checker/README.md) | Real-time Ethereum price from CoinGecko. |
| [plaid-plugin](src/plaid-plugin/README.md) | Banking viaaid — balances, transactions across 12,000+ institutions. |
| [polymarket-plugin](src/polymarket-plugin/README.md) | Prediction market trading — discover markets, orderbooks, signed orders. |
| [seedance-plugin](src/seedance-plugin/README.md) | ByteDance Seedance 2.0 for image and video generation. |
| [stripe-plugin](src/stripe-plugin/README.md) | Stripe payments, invoicing, subscriptions, customer portal. |
| [yields-dex](src/yields-dex) | DeFi yield aggregator — scan yields across chains, tokens, and protocols. |

</details>

<details>
<summary><strong>AI & Machine Learning</strong></summary>

| Plugin | Description |
|--------|-------------|
| [agentgos](src/agentgos) | AgentOS multi-agent orchestration with swarms, and tools, optionally. |
| [atlas-cloud](src/atlas-cloud/README.md) | Unified AI API: image generation, video processing, chat, file uploads. |
| [compu-strength](src/compu-strength) | Cloud compute strength checker for benchmarking provider performance. |
| [floor3d](src/floor3D) | 3D scene generation from text prompts via Luma AI. |
| [groupme-anything](src/groupme-anything) | Platform adapter for connecting to GroupMe. |
| [incog-runner](src/incog-runner） | Python script runner for longed tasks via exec.
| [improve](src/improve/README.md) | Codebase audit — generates prioritized, self-contained implementation plans. |
| [neuralforge](src/neuralforge/README.md) | Natural neural network builder. 2.1.0 with multi-objective quality predictor (acc=0.998). |

</details>

<details>
<summary><strong>Governance & Agent Systems</strong></summary>

| Plugin | Description |
|--------|-------------|
| [asf-runtime-loop-tools](src/asf-runtime-loop-tools/README.md) | AI-powered runtime loop monitoring, evidence gates, inline-docto and summarization. |
| [astro-autoagent](src/astro-autoagent） | Auto-agent for diagram generation and-related tooling. |
|-radar](src/delta-radar） change tracking component what . |
| [fractal-swarm](src/fractal-swarm/README.md) | Multi-agent task spawning, pruning, status monitoring, and workload balancing. |
| [hyperg-ai](src/hyperg-ai） | Hyper-G AI collaborative agent for building and compute. |
| [llm-task-handler](src/llm-task-handler） | LLM task handling strategy for routing simple and complex tools. |
| [lssao-toolkit](src/lssao-toolkit/README.md) | Multi-agent SaaS orchestration toolkit — evidence gates, DOE, SPC, flow analyzer, and more. |
| [agentfold](src/agentfold/README.md) | Evidence-gated agent folding runtime — genome validation, origin alignment, misfold detection, fitness scoring, compounding gates, ledger, inheritance. 9 AGNT tools. |
| [tessera-neural-sidecar](src/tessera-neural-sidecar/README.md) | Tessera time-series classification AGNT bridge. Neural anomaly detection with trust scoring. |
| [triadix-governance](src/triadix-governance/README.md) | DAO governance: create DAOs, propose+vote+execute on the Triadix Chain. |
| [triadix-ledger](src/triadix-ledger/README.md) | Coherence-native triadic ledger kernel v3.0. Ed25519, BFT, PBFT, agent memory, SQLite. |

</details>

<details>
<summary><strong>Data & Telemetry</strong></summary>

| Plugin | Description |
|--------|-------------|
| [chatgpt-comparison](src/chatgpt-comparison) | Compares ChatGPT outputs against cost of credits for each response. |
| [coding-telemetry-feedback-net](src/coding-telemetry-feedback-net） | Code quality neural tooling — multi-feedback net with 24 models, training, and telemetry platform. |
| [cua-toolkit](src/cua-toolkit/README.md) | Computer Use Automation toolkit — screen reading, click, mouse, and OS-level operations. |
| [delta-radar](src/delta-radar） | Delta change tracker for noting what's changed between iterations. |
| [devhub-updates](src/devhub-updates） | Devi bat update notification for DevHub framework version tracking. |
| [unf-aviation](src/unf-aviation） | FAA aviation data, airport lookups, METARs, and route calculations. |

</details>

<details>
<summary><strong>Automation, Delivery & Chat</strong></summary>

| Plugin | Description |
|--------|-------------|
| [sys-stage](src/sys-stage） | Stageplay blueprint for story-driven chat flows and OS-level shortcuts. |
| [telegram-toolkit](src/telegram-toolkit/README.md) | Telegram Bot API with webhook receivers, message handling. |
| [discord-plugin](src/discord-plugin/README.md) | Discord Bot API: messages, channels, reactions, slash commands. |
| [slack-plugin](src/slack-plugin/README.md) | Slack Bot API: channels, users, conversations, files. |
| [gmail-plugin](src/gmail-plugin/README.md) | Email send/search via Gmail. |
| [google-*](src/google-drive-plugin), [sheets](src/google-sheets-plugin), [slides](src/google-slides-plugin) | Google Drive, Sheets, Slides integration. |
| [notion-plugin](src/notion-plugin/README.md) | Notion reading/writing via API. |
| [obsidian-plugin](src/obsidian-plugin/README.md) | Obsidian vault read/write with metadata extraction. |
| [open-url-toolkit](src/open-url-toolkit/README.md) | Multi-platform URL opening — native, browser-direct, AGNT-hosted. |
| [operation-timer](src/operation-timer/README.md) | Live per-call timer with error-stopped tracing. |
| [chat-actions-strip](src/chat-actions-strip/README.md) | Theme-aware translucent action bar for AGNT chat. |

</details>

<details>
<summary><strong>Infrastructure & Utility</strong></summary>

| Plugin | Description |
|--------|-------------|
| [agnt-connect](src/agnt-connect/README.md) | Agent-to-agent connection protocol for cross-instance messaging. |
| [system-control](src/system-control/README.md) | System-level control — open files/folders, terminal sessions, process management, screen capture. |
| [plugin-rehydration](src/plugin-rehydration/README.md) | Plugin system context rehydration — scan, pull source, cross-reference dev folder. |
| [ecosystem-telemetry-hub](src/ecosystem-telemetry-hub/README.md) | **NEW in v3** — unified ecosystem telemetry, emergence detection, cold-storage registry. |
| [agent-trajectory-log](src/agent-trajectory-log/README.md) | **NEW in v3** — agent trajectory monitoring, loop detection, self-correction signals. |
| [evolution-sync-tool](src/evolution-sync-tool/README.md) | **NEW in v3** — bidirectional sync between dev/ and cold storage (this repo). Pull, push, git-pull. |

### Infrastructure & Utility

| Plugin | Description |
|--------|-------------|
| [agnt-connect](src/agnt-connect/README.md) | Agent-to-agent connection protocol for cross-instance messaging. |
| [system-control](src/system-control/README.md) | System-level control — open files/folders, terminal sessions, process management, screen capture. |
| [plugin-rehydration](src/plugin-rehydration/README.md) | Plugin system context rehydration — scan, pull source, cross-reference dev folder. |
| [ecos-hub](src/ecosystem-telemetry-hub/README.md) | **NEW v3** — Unified ecosystem telemetry, emergence detection, cold-storage registry. |
| [agent-trajectory-log](src/agent-trajectory-log/README.md) | **NEW v3** — Agent trajectory monitoring, loop detection, self-correction signals. |
| [evolution-sync-tool](src/evolution-sync-tool/README.md) | **NEW v3** — Bidirectional sync between dev/ and cold storage. |
| [cross-system-autevolver](src/cross-system-autevolver/README.md) | **NEW v3** — Cross-system evolution orchestrator. Composes chains into automated workflows. |

</details>

---

## � Evolution Flow

```
AGNT-PLUGINS (cold storage)  <─  evolution-sync-tool  ─>  agnt-evo/backend/plugins/dev/ (working copy)
                                      │
                                      ├── sync-pull.js    pull from GitHub, delta-download
                                      ├── sync-push.js   ──  detect unsynced, generate push script
                                      └── git-pull-updates.js  ──  fetch/merge/rebase from origin
```

**Never lose work.** The `evolution-sync-tool` plugin in AGNT can pull/push between the two repos at any time.

---

## �️ Architecture

```
AGNT Core (agnt-evo)
├── backend/
│   └── plugins/
│       ├── dev/                   ← Working copy (61 plugins)
│       │   ├── neuralforge/
│       │   ├── chemiframe/
│       │   ├── ecosystem-telemetry-hub/    ← NEW
│       │   ├── agent-trajectory-log/       ← NEW
│       │   ├── evolution-sync-tool/        ← NEW
│       │   └── ...
│       └── installed/             ← Runtime load
│
└── AGNT-PLUGINS (this repo)       ← Cold storage source of truth
    └── src/
        ├── neuralforge/
        ├── chemiframe/
        ├── ecosystem-telemetry-hub/
        ├── agent-trajectory-log/
        ├── evolution-sync-tool/
        └── ... (62 total)
```

- **AGNT Core** stays clean — safe to pull from upstream `agnt-gg/agnt`
- **AGNT-PLUGINS** is the independent cold-storage source of truth
- Plugins are built from `dev/` via `build-plugin.js`, then loaded into `installed/`
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
  "icon": "activity",
  "tools": [
    {
      "type": "my-tool",
      "entryPoint": "./my-tool.js",
      "schema": {
        "title": "My Tool",
        "description": "...",
        "parameters": {}
      }
    }
  ]
}
```

---

## � Related

| Project | Description | Link |
|---------|-------------|------|
| **AGNT Core** | AI Agent Development Framework | [jacksonjp0311-gif/agnt-evo](https://github.com/jacksonjp0311-gif/agnt-evo) |
| **AGNT Upstream** | Original AGNT repository | [NathanB-dev/AGNT](https://github.com/NathanB-dev/AI-Agent-Development-Framework) |
| **NeuralForge** | Standalone neural network library (v2.1.0) | [j11-gif/-NeuralForge](https://github.com/jacksonjp0311-gif/-NeuralForge) |
| **Tessera** | Time-series classification engine | [jacksonjp0311-gif/TESSERA](https://github.com/jacksonjp0311-gif/TESSERA) |
| **Triadix Governance** | Governance framework (E1-E5 evolutions) | [jacksonjp0311-gif/Triadix-Governance](https://github.com/jacksonjp0311-gif/Triadix-Governance) |

---

## 📄 License

MIT License — see [LICENSE](LICENSE).

---

*Built for [AGNT](https://github.com/jacksonjp0311-gif/agnt-evo) · 61 plugins · MIT*
