import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NF_ROOT = process.env.NEURALFORGE_ROOT || 'C:\\Users\\jacks\\OneDrive\\Desktop\\agnt-evo\\neuralforge';

class NfSmartOptimize {
  constructor() {
    this.name = 'nf-smart-optimize';
  }

  async execute(params) {
    try {
      const { toolName, contextLoad = 0.5, dataSize = 1000 } = params;

      const result = await this._callPython('optimize', {
        tool_name: toolName,
        context_load: contextLoad,
        data_size: dataSize
      });

      return {
        success: true,
        params: {
          timeout: result.timeout,
          retries: result.retries,
          backoff: result.backoff,
          toolName
        }
      };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return {
        success: true,
        params: { timeout: 30000, retries: 3, backoff: 1000, toolName: params.toolName, fallback: true }
      };
    }
  }

  _callPython(action, data) {
    return new Promise((resolve, reject) => {
      const script = `
import sys, json
sys.path.insert(0, "${NF_ROOT.replace(/\\/g, '/')}")
try:
    from neuralforge import NeuralForgeOptimizer
    o = NeuralForgeOptimizer()
    result = o.optimize_params("${data.tool_name}", ${data.context_load}, ${data.data_size})
    print(json.dumps({"timeout": result.get("timeout", 30000), "retries": result.get("retries", 3), "backoff": result.get("backoff", 1000)}))
except Exception as e:
    print(json.dumps({"timeout": 30000, "retries": 3, "backoff": 1000}))
`;
      const proc = spawn('python', ['-c', script], {
        cwd: NF_ROOT,
        env: { ...process.env },
        timeout: 10000
      });
      let stdout = '';
      proc.stdout.on('data', d => stdout += d);
      proc.on('close', () => {
        try { resolve(JSON.parse(stdout.trim())); }
        catch { resolve({ timeout: 30000, retries: 3, backoff: 1000 }); }
      });
      proc.on('error', () => resolve({ timeout: 30000, retries: 3, backoff: 1000 }));
    });
  }
}

export default new NfSmartOptimize();
