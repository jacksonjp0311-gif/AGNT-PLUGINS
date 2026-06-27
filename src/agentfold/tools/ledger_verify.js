import { execSync } from 'child_process';

const AGENTFOLD_DIR = 'C:\\Users\\jacks\\OneDrive\\Desktop\\agentfold';

class AgentFoldLedgerVerify {
  constructor() {
    this.name = 'agentfold_ledger_verify';
  }

  async execute(params) {
    try {
      const ledgerPath = params.ledger_path || '';
      const cmd = ledgerPath
        ? `python -m agentfold.cli verify-ledger "${ledgerPath}"`
        : 'python -m agentfold.cli verify-ledger';
      const result = execSync(cmd, {
        cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 30000
      });
      return {
        valid: true,
        entries: 0,
        output: result
      };
    } catch (error) {
      // If the command doesn't exist, return a note
      return {
        valid: false,
        entries: 0,
        broken_at: -1,
        output: (error.stdout || '') + (error.stderr || ''),
        note: 'verify-ledger command may not be available in this version'
      };
    }
  }
}

export default new AgentFoldLedgerVerify();
