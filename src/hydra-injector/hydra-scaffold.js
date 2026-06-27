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
      timeout: 30000
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

class HydraScaffold {
  constructor() {
    this.name = 'hydra-scaffold';
  }

  async execute(params) {
    try {
      const { size = 7, outputPath } = params;
      const { code, stdout, stderr } = await runHydra(['scaffold', '--size', String(size)]);

      if (code !== 0) {
        return { success: false, error: stderr || `hydra-inject scaffold exited with code ${code}` };
      }

      let spec;
      try { spec = JSON.parse(stdout); } catch { return { success: false, error: 'Failed to parse scaffold output' }; }

      let savedPath = null;
      if (outputPath) {
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
        savedPath = outputPath;
      }

      return { success: true, spec, path: savedPath };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return { success: false, error: error.message };
    }
  }
}

export default new HydraScaffold();
