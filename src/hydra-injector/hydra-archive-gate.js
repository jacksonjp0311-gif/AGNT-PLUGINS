import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HYDRA_SRC = process.env.HYDRA_INJECTOR_PATH || 'C:\\Users\\jacks\\OneDrive\\Desktop\\hydra-injector';

class HydraArchiveGate {
  constructor() {
    this.name = 'hydra-archive-gate';
  }

  async execute(params) {
    try {
      const { headerJson } = params;
      if (!headerJson) return { success: false, error: 'headerJson is required' };

      // Parse the header JSON
      let header;
      try {
        header = typeof headerJson === 'string' ? JSON.parse(headerJson) : headerJson;
      } catch (e) {
        return { success: false, error: `Invalid JSON: ${e.message}` };
      }

      // Write header to temp file and run archive-gate via Python inline
      const tmpFile = path.join(os.tmpdir(), `hydra_header_${Date.now()}.json`);
      fs.writeFileSync(tmpFile, JSON.stringify(header, null, 2));

      const result = await new Promise((resolve) => {
        const proc = spawn('python', [
          '-c',
          `
import json, sys
sys.path.insert(0, "${path.join(HYDRA_SRC, 'src').replace(/\\/g, '/')}")
from hydra_injector.governance import archive_gate
with open("${tmpFile.replace(/\\/g, '/')}", 'r') as f:
    header = json.load(f)
result = archive_gate(header)
print(json.dumps(result, indent=2))
`
        ], {
          cwd: HYDRA_SRC,
          env: { ...process.env },
          timeout: 30000
        });
        let stdout = '';
        let stderr = '';
        proc.stdout.on('data', d => stdout += d);
        proc.stderr.on('data', d => stderr += d);
        proc.on('close', code => {
          try { fs.unlinkSync(tmpFile); } catch {}
          resolve({ code, stdout: stdout.trim(), stderr: stderr.trim() });
        });
        proc.on('error', err => {
          try { fs.unlinkSync(tmpFile); } catch {}
          resolve({ code: -1, stdout: '', stderr: err.message });
        });
      });

      if (result.code !== 0) {
        return { success: false, error: result.stderr || `Archive gate exited with code ${result.code}` };
      }

      let gate;
      try { gate = JSON.parse(result.stdout); } catch { return { success: false, error: 'Failed to parse archive gate output' }; }

      return {
        success: true,
        archiveReady: gate.archive_ready,
        missingFields: gate.missing_fields,
        nonClaimLock: gate.non_claim_lock,
        actions: gate.recommended_actions || gate.actions || []
      };
    } catch (error) {
      console.error(`[${this.name}] Error:`, error);
      return { success: false, error: error.message };
    }
  }
}

export default new HydraArchiveGate();
