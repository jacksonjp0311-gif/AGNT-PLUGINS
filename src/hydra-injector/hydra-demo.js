import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

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

class HydraDemo {
  constructor() {
    this.name = 'hydra-demo';
  }

  async execute(params) {
    try {
      const { format = 'json' } = params;
      const fmt = format === 'json' ? 'json' : 'markdown';
      const { code, stdout, stderr } = await runHydra(['demo', '--format', fmt]);

      if (code !== 0) {
        return { success: false, error: stderr || `hydra-inject demo exited with code ${code}` };
      }

      let result = null;
      if (fmt === 'json') {
        try { result = JSON.parse(stdout); } catch { /* keep as text */ }
      }

      return { success: true, result };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return { success: false, error: error.message };
    }
  }
}

export default new HydraDemo();
