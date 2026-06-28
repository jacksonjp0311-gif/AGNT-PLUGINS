import { EventEmitter } from 'events';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function ensureDir(p) {
  try { fs.mkdirSync(p, { recursive: true }); } catch (_) {}
}

function pluginDataDir(pluginName) {
  const home = os.homedir();
  const base = process.env.AGNT_PLUGIN_DATA_DIR
    || path.join(home, 'AppData', 'Roaming', 'AGNT', 'plugin-data');
  const dir = path.join(base, pluginName);
  ensureDir(dir);
  return dir;
}

function readCheckpoint(fp) {
  try {
    if (!fs.existsSync(fp)) return null;
    const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
    return j?.latest || null;
  } catch (_) {
    return null;
  }
}

function writeCheckpoint(fp, latest) {
  try {
    fs.writeFileSync(fp, JSON.stringify({ latest }, null, 2), 'utf8');
  } catch (_) {}
}

function runPython(scriptPath, args) {
  return new Promise((resolve, reject) => {
    execFile('python', [scriptPath, ...args], { windowsHide: true }, (err, stdout, stderr) => {
      if (err) return reject(new Error(stderr || err.message));
      try {
        resolve(JSON.parse(String(stdout)));
      } catch (e) {
        reject(new Error('Failed to parse python output: ' + e.message + '\n' + String(stdout).slice(0, 500)));
      }
    });
  });
}

class WorkflowCompletedTrigger extends EventEmitter {
  constructor() {
    super();
    this.name = 'workflow-completed';
    this.intervalId = null;
    this.isListening = false;
    this.latest = null;
    this.workflowEngine = null;
    this.node = null;
  }

  async setup(engine, node) {
    console.log(`[${this.name}] Setting up`);
    this.workflowEngine = engine;
    this.node = node;

    const p = node?.parameters || {};
    this.pollIntervalMs = (parseInt(p.pollIntervalSeconds, 10) || 15) * 1000;
    this.statusFilter = p.statusFilter || 'any';
    this.workflowNameContains = (p.workflowNameContains || '').trim() || null;
    this.checkpointMode = p.checkpointMode || 'file';

    this.pluginName = 'ops-observability-suite';
    this.checkpointFile = path.join(pluginDataDir(this.pluginName), 'workflow_completed_checkpoint.json');

    if (this.checkpointMode === 'file') {
      this.latest = readCheckpoint(this.checkpointFile);
    }

    engine.receivers[this.name] = this;

    await this.start();
    console.log(`[${this.name}] Listening (poll=${this.pollIntervalMs}ms, status=${this.statusFilter})`);
  }

  validate(triggerData) {
    return Boolean(triggerData?.executionId);
  }

  async process(inputData) {
    return inputData;
  }

  async teardown() {
    console.log(`[${this.name}] Tearing down`);
    this.isListening = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  async start() {
    if (this.isListening) return;
    this.isListening = true;

    const scriptPath = path.join(__dirname, 'workflow_completed_poll.py');

    const poll = async () => {
      try {
        const args = [];
        if (this.latest) args.push('--since', this.latest);
        args.push('--status', this.statusFilter);
        if (this.workflowNameContains) args.push('--name_contains', this.workflowNameContains);
        args.push('--limit', '50');

        const data = await runPython(scriptPath, args);
        const execs = Array.isArray(data.executions) ? data.executions : [];

        for (const r of execs) {
          // Emit one trigger per execution
          this.emit('trigger', {
            executionId: r.id,
            workflowId: r.workflow_id,
            workflowName: r.workflow_name,
            status: r.status,
            endTime: r.end_time,
            creditsUsed: r.credits_used,
            row: r,
          });
        }

        if (data.latest && data.latest !== this.latest) {
          this.latest = data.latest;
          if (this.checkpointMode === 'file') writeCheckpoint(this.checkpointFile, this.latest);
        }
      } catch (e) {
        console.error(`[${this.name}] Poll error:`, e.message);
      }
    };

    await poll();
    this.intervalId = setInterval(poll, this.pollIntervalMs);
  }
}

export default new WorkflowCompletedTrigger();
