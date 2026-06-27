import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NF_ROOT = process.env.NEURALFORGE_ROOT || 'C:\\Users\\jacks\\OneDrive\\Desktop\\agnt-evo\\neuralforge';
const DATA_DIR = path.join(NF_ROOT, 'cold_storage', 'smart_tool');
const MODEL_PATH = path.join(DATA_DIR, 'predict_model.npz');
const HISTORY_PATH = path.join(DATA_DIR, 'execution_history.jsonl');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class NfSmartPredict {
  constructor() {
    this.name = 'nf-smart-predict';
  }

  async execute(params) {
    try {
      const { toolName, contextLoad = 0.5, recentErrors = 0 } = params;

      // Call NeuralForge Python predictor
      const result = await this._callPython('predict', {
        tool_name: toolName,
        system_load: contextLoad,
        recent_errors: recentErrors
      });

      return {
        success: true,
        prediction: {
          failureProbability: result.failure_probability,
          recommendation: result.failure_probability > 0.6 ? 'ABORT' : result.failure_probability > 0.3 ? 'CAUTION' : 'PROCEED',
          confidence: result.confidence,
          toolName
        }
      };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      // Fallback: always proceed if model unavailable
      return {
        success: true,
        prediction: {
          failureProbability: 0.5,
          recommendation: 'PROCEED',
          confidence: 0,
          toolName,
          fallback: true
        }
      };
    }
  }

  _callPython(action, data) {
    return new Promise((resolve, reject) => {
      const script = `
import sys, json
sys.path.insert(0, "${NF_ROOT.replace(/\\/g, '/')}")
try:
    from neuralforge import NeuralForgePredictor
    p = NeuralForgePredictor()
    result = p.predict_failure("${data.tool_name}", ${data.system_load}, ${data.recent_errors})
    print(json.dumps({"failure_probability": result, "confidence": 0.7}))
except Exception as e:
    print(json.dumps({"failure_probability": 0.5, "confidence": 0.0, "error": str(e)}))
`;
      const proc = spawn('python', ['-c', script], {
        cwd: NF_ROOT,
        env: { ...process.env },
        timeout: 10000
      });
      let stdout = '', stderr = '';
      proc.stdout.on('data', d => stdout += d);
      proc.stderr.on('data', d => stderr += d);
      proc.on('close', code => {
        try {
          resolve(JSON.parse(stdout.trim()));
        } catch {
          resolve({ failure_probability: 0.5, confidence: 0 });
        }
      });
      proc.on('error', () => resolve({ failure_probability: 0.5, confidence: 0 }));
    });
  }
}

export default new NfSmartPredict();
