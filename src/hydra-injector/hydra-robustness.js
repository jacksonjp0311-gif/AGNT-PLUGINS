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
      timeout: 120000
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

class HydraRobustness {
  constructor() {
    this.name = 'hydra-robustness';
  }

  async execute(params) {
    try {
      const { specFile, trials = 8, noiseScale = 0.03 } = params;
      if (!specFile) return { success: false, error: 'specFile is required' };
      if (!fs.existsSync(specFile)) return { success: false, error: `Spec file not found: ${specFile}` };

      const { code, stdout, stderr } = await runHydra([
        'robustness', specFile,
        '--trials', String(trials),
        '--noise-scale', String(noiseScale)
      ]);

      if (code !== 0) {
        return { success: false, error: stderr || `hydra-inject robustness exited with code ${code}` };
      }

      let robustness;
      try { robustness = JSON.parse(stdout); } catch { return { success: false, error: 'Failed to parse robustness output' }; }

      return { success: true, robustness };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return { success: false, error: error.message };
    }
  }
}

export default new HydraRobustness();
