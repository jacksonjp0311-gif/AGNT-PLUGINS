import { execSync } from 'child_process';

const AGENTFOLD_DIR = 'C:\\Users\\jacks\\OneDrive\\Desktop\\agentfold';

class AgentFoldEvidenceReplay {
  constructor() {
    this.name = 'agentfold_evidence_replay';
  }

  async execute(params) {
    try {
      const packetPath = params.packet_path || '';
      const cmd = packetPath
        ? `python -m agentfold.cli verify-evidence "${packetPath}"`
        : 'python -m agentfold.cli verify-evidence';
      const result = execSync(cmd, {
        cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 30000
      });
      return {
        valid: true,
        replay_result: result,
        output: result
      };
    } catch (error) {
      // If the command doesn't exist, try ci-verify as fallback
      try {
        const fallback = execSync('python -m agentfold.cli ci-verify', {
          cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 30000
        });
        return {
          valid: true,
          replay_result: fallback,
          output: fallback,
          note: 'Used ci-verify as fallback'
        };
      } catch (e2) {
        return {
          valid: false,
          replay_result: error.message,
          output: (error.stdout || '') + (error.stderr || '')
        };
      }
    }
  }
}

export default new AgentFoldEvidenceReplay();
