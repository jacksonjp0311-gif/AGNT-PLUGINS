import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

class ExecutionTriage {
  constructor() {
    this.name = 'execution-triage';
  }

  async execute(params = {}) {
    try {
      const days = Math.max(1, parseInt(params.days, 10) || 7);
      const maxRows = Math.max(100, parseInt(params.maxRows, 10) || 5000);
      const topK = Math.max(3, parseInt(params.topK, 10) || 10);

      const scriptPath = path.join(__dirname, 'triage.py');
      const data = await runPython(scriptPath, [
        '--days', String(days),
        '--max_rows', String(maxRows),
        '--top_k', String(topK)
      ]);

      return {
        report: data.report || '',
        summary: data.summary || {},
        clusters: data.clusters || [],
      };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return { error: error.message };
    }
  }
}

export default new ExecutionTriage();
