import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const NF_ROOT = process.env.NEURALFORGE_ROOT || 'C:\\Users\\jacks\\OneDrive\\Desktop\\agnt-evo\\neuralforge';

class NfSmartRetry {
  constructor() {
    this.name = 'nf-smart-retry';
  }

  async execute(params) {
    try {
      const { toolName, errorType, retryCount = 0 } = params;

      const result = await this._callPython('retry', {
        tool_name: toolName,
        error_type: errorType,
        retry_count: retryCount
      });

      return {
        success: true,
        decision: {
          shouldRetry: result.should_retry,
          confidence: result.confidence,
          reason: result.reason,
          toolName,
          errorType
        }
      };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return {
        success: true,
        decision: { shouldRetry: retryCount < 3, confidence: 0.5, reason: 'fallback', toolName: params.toolName, errorType: params.errorType }
      };
    }
  }

  _callPython(action, data) {
    return new Promise((resolve, reject) => {
      const script = `
import sys, json
sys.path.insert(0, "${NF_ROOT.replace(/\\/g, '/')}")
try:
    from neuralforge import NeuralForgeSmartRetry
    r = NeuralForgeSmartRetry()
    result = r.should_retry("${data.tool_name}", "${data.error_type}", ${data.retry_count})
    print(json.dumps({"should_retry": result.get("should_retry", True), "confidence": result.get("confidence", 0.5), "reason": result.get("reason", "default")}))
except Exception as e:
    print(json.dumps({"should_retry": ${data.retry_count} < 3, "confidence": 0.5, "reason": "fallback"}))
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
        catch { resolve({ should_retry: data.retry_count < 3, confidence: 0.5, reason: 'fallback' }); }
      });
      proc.on('error', () => resolve({ should_retry: data.retry_count < 3, confidence: 0.5, reason: 'fallback' }));
    });
  }
}

export default new NfSmartRetry();
