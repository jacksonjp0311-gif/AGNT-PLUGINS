# 🧬 AgentFold — Evidence-Gated Agent Folding Runtime

**Sequence-to-Behavior Inspection for Memory-Bearing, Tool-Using AI Agents**

[![Tests](https://img.shields.io/badge/tests-87%20passed-brightgreen?style=flat-square)]()
[![Version](https://img.shields.io/badge/version-v1.4.0-blue?style=flat-square)]()
[![License](https://img.shields.io/license-MIT-purple?style=flat-square)]()
[![AGNT](https://img.shields.io/badge/AGNT-compatible-12e0ff?style=flat-square)]()

## 🔌 AgentFold AGNT Plugin

This is the AGNT plugin wrapper for [AgentFold](https://github.com/jacksonjp0311-gif/AgentFold), built using the thin-plugin architecture — wraps AgentFold's CLI via subprocess calls, no coupling to AGNT internals.

### Tools Exposed

| Tool | Description |
|------|-------------|
| `agentfold_validate_genome` | Validate an AgentGenome against AF-SA schema |
| `agentfold_run_pipeline` | Full folding pipeline: genome → origin → fold → misfold → fitness → gate → ledger → inheritance |
| `agentfold_health_snapshot` | Run tests, CLI checks, genome validation — full health dashboard |
| `agentfold_check_misfolds` | CI policy verification for structural drift |
| `agentfold_ledger_verify` | Hash chain integrity verification of append-only ledger |
| `agentfold_fitness_score` | Multi-dimensional fitness scoring from test results |
| `agentfold_gate_evaluate` | Compounding gate decision: permit/warn/repair/shadow/block |
| `agentfold_rehydration_check` | 10-step rehydration protocol validation |
| `agentfold_evidence_replay` | Evidence packet replay against CI policy |

### Source

Core repo: [jacksonjp0311-gif/AgentFold](https://github.com/jacksonjp0311-gif/AgentFold)

### Category

Governance & Agent Systems
