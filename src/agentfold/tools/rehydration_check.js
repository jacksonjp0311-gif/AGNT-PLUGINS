import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const AGENTFOLD_DIR = 'C:\\Users\\jacks\\OneDrive\\Desktop\\agentfold';

class AgentFoldRehydrationCheck {
  constructor() {
    this.name = 'agentfold_rehydration_check';
  }

  async execute(params) {
    const steps = [
      { name: 'README.md', check: () => fs.existsSync(path.join(AGENTFOLD_DIR, 'README.md')) },
      { name: 'README_90_SECONDS.md', check: () => fs.existsSync(path.join(AGENTFOLD_DIR, 'README_90_SECONDS.md')) },
      { name: 'REHYDRATION_PROTOCOL.md', check: () => fs.existsSync(path.join(AGENTFOLD_DIR, 'docs', 'protocols', 'REHYDRATION_PROTOCOL.md')) },
      { name: 'repository_context_index.json', check: () => fs.existsSync(path.join(AGENTFOLD_DIR, 'docs', 'context', 'repository_context_index.json')) },
      { name: 'rcc_nexus_index.json', check: () => fs.existsSync(path.join(AGENTFOLD_DIR, 'docs', 'context', 'rcc_nexus_index.json')) },
      { name: 'route_map.json', check: () => fs.existsSync(path.join(AGENTFOLD_DIR, 'rcc', 'nexus', 'route_map.json')) },
      { name: 'policy.json', check: () => fs.existsSync(path.join(AGENTFOLD_DIR, 'agentfold.policy.json')) },
      { name: 'tests', check: () => fs.existsSync(path.join(AGENTFOLD_DIR, 'tests')) },
      { name: 'pytest', check: () => { try { execSync('python -m pytest -q', { cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 30000 }); return true; } catch(e) { return false; } } },
      { name: 'non_claim_lock', check: () => { try { const readme = fs.readFileSync(path.join(AGENTFOLD_DIR, 'README.md'), 'utf-8'); return readme.includes('Not biological AlphaFold') || readme.includes('non-claim'); } catch(e) { return false; } } }
    ];

    let completed = 0;
    const results = [];
    for (const step of steps) {
      try {
        const ok = step.check();
        if (ok) completed++;
        results.push({ step: step.name, status: ok ? 'pass' : 'fail' });
      } catch (e) {
        results.push({ step: step.name, status: 'error', error: e.message });
      }
    }

    return {
      steps_completed: completed,
      total_steps: steps.length,
      status: completed === steps.length ? 'complete' : completed >= steps.length * 0.7 ? 'partial' : 'incomplete',
      details: results
    };
  }
}

export default new AgentFoldRehydrationCheck();
