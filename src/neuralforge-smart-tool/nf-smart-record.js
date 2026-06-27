import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NF_ROOT = process.env.NEURALFORGE_ROOT || 'C:\\Users\\jacks\\OneDrive\\Desktop\\agnt-evo\\neuralforge';
const DATA_DIR = path.join(NF_ROOT, 'cold_storage', 'smart_tool');
const HISTORY_PATH = path.join(DATA_DIR, 'execution_history.jsonl');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class NfSmartRecord {
  constructor() {
    this.name = 'nf-smart-record';
  }

  async execute(params) {
    try {
      const { toolName, durationMs, success, errorType = null } = params;

      const record = {
        tool_name: toolName,
        duration_ms: durationMs,
        success: success === 'true' || success === true,
        error_type: errorType,
        timestamp: new Date().toISOString()
      };

      // Append to history
      fs.appendFileSync(HISTORY_PATH, JSON.stringify(record) + '\n');

      // Count total records
      const content = fs.readFileSync(HISTORY_PATH, 'utf8');
      const totalRecords = content.trim().split('\n').filter(l => l.trim()).length;

      // Trigger async retrain if we have enough new data
      if (totalRecords % 10 === 0) {
        this._triggerRetrain();
      }

      return { success: true, recorded: true, totalRecords };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return { success: false, recorded: false, error: error.message };
    }
  }

  _triggerRetrain() {
    // Non-blocking retrain
    const script = `
import sys, json
sys.path.insert(0, "${NF_ROOT.replace(/\\/g, '/')}")
try:
    from neuralforge import DataLearner
    # Load history and retrain
    with open("${HISTORY_PATH.replace(/\\/g, '/')}", 'r') as f:
        records = [json.loads(l) for l in f if l.strip()]
    if len(records) >= 5:
        X = [[r['duration_ms'], r.get('step_count', 3)] for r in records]
        y = [1 if r['success'] else 0 for r in records]
        learner = DataLearner()
        result = learner.train(X, y, epochs=20)
        print(json.dumps({"retrained": true, "samples": len(records)}))
except Exception as e:
    print(json.dumps({"retrained": false, "error": str(e)}))
`;
    const proc = spawn('python', ['-c', script], {
      cwd: NF_ROOT,
      env: { ...process.env },
      timeout: 30000
    });
    let stdout = '';
    proc.stdout.on('data', d => stdout += d);
    proc.on('close', () => {
      try {
        const result = JSON.parse(stdout.trim());
        if (result.retrained) {
          console.log(`[NF Smart Tool] Retrained on ${result.samples} samples`);
        }
      } catch {}
    });
  }
}

export default new NfSmartRecord();
