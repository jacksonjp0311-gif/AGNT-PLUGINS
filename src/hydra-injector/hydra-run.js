import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve hydra-injector source location
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

class HydraRun {
  constructor() {
    this.name = 'hydra-run';
  }

  async execute(params) {
    try {
      const { specFile, format = 'json' } = params;
      if (!specFile) return { success: false, error: 'specFile is required' };
      if (!fs.existsSync(specFile)) return { success: false, error: `Spec file not found: ${specFile}` };

      const fmt = format === 'json' ? 'json' : 'markdown';
      const { code, stdout, stderr } = await runHydra(['run', specFile, '--format', fmt]);

      if (code !== 0) {
        return { success: false, error: stderr || `hydra-inject exited with code ${code}` };
      }

      let result = null;
      let report = stdout;
      if (fmt === 'json') {
        try {
          result = JSON.parse(stdout);
          report = stdout;
        } catch {
          // If not valid JSON, treat as text report
          report = stdout;
        }
      }

      return { success: true, result, report };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return { success: false, error: error.message };
    }
  }
}

export default new HydraRun();
