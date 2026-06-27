import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HYDRA_SRC = process.env.HYDRA_INJECTOR_PATH || 'C:\\Users\\jacks\\OneDrive\\Desktop\\hydra-injector';

function runHydra(args) {
  return new Promise((resolve) => {
    const proc = spawn('python', ['-m', 'hydra_injector.cli', ...args], {
      cwd: HYDRA_SRC,
      env: { ...process.env, PYTHONPATH: path.join(HYDRA_SRC, 'src') },
      timeout: 60000
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', d => stdout += d);
    proc.stderr.on('data', d => stderr += d);
    proc.on('close', code => {
      resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() });
    });
    proc.on('error', err => {
      resolve({ code: -1, stdout: '', stderr: err.message });
    });
  });
}

class HydraCodeweave {
  constructor() {
    this.name = 'hydra-codeweave';
  }

  async execute(params) {
    try {
      const { action, specFile, targetDir, sessionId, format = 'json' } = params;

      if (!action) return { success: false, error: 'action is required' };

      const args = [];
      let report = null;

      switch (action) {
        case 'plan':
          if (!specFile) return { success: false, error: 'specFile required for plan' };
          args.push('code-plan', specFile);
          break;

        case 'apply-dry':
          if (!specFile) return { success: false, error: 'specFile required for apply-dry' };
          args.push('code-apply', specFile, '--dry-run');
          break;

        case 'apply':
          if (!specFile) return { success: false, error: 'specFile required for apply' };
          args.push('code-apply', specFile);
          break;

        case 'verify':
          if (!specFile) return { success: false, error: 'specFile required for verify' };
          args.push('code-verify', specFile);
          break;

        case 'bundle':
          if (!specFile) return { success: false, error: 'specFile required for bundle' };
          args.push('code-bundle', specFile, '--format', format === 'report' ? 'report' : format]);
          break;

        case 'rollback':
          if (!sessionId) return { success: false, error: 'sessionId required for rollback' };
          args.push('code-rollback', sessionId);
          break;

        case 'markers':
          if (!targetDir) return { success: false, error: 'targetDir required for markers' };
          args.push('markers', targetDir, '--format', format === 'markdown' ? 'markdown' : 'json');
          break;

        default:
          return { success: false, error: `Unknown action: ${action}` };
      }

      const { code, stdout, stderr } = await runHydra(args);

      if (code !== 0) {
        return { success: false, error: stderr || `hydra-inject exited with code ${code}` };
      }

      let result = null;
      report = stdout;

      // Try JSON parse for structured outputs
      if (format === 'json' || action === 'markers' || action === 'verify') {
        try { result = JSON.parse(stdout); } catch { /* keep as text */ }
      }

      return { success: true, result, report };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return { success: false, error: error.message };
    }
  }
}

export default new HydraCodeweave();
