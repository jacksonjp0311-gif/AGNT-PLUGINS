import { execSync } from 'child_process';

const AGENTFOLD_DIR = 'C:\\Users\\jacks\\OneDrive\\Desktop\\agentfold';

class AgentFoldCheckMisfolds {
  constructor() {
    this.name = 'agentfold_check_misfolds';
  }

  async execute(params) {
    try {
      const genomeArg = params.genome_path ? `"${params.genome_path}"` : '';
      const result = execSync(
        `python -m agentfold.cli ci-verify ${genomeArg}`,
        { cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 60000 }
      );
      return {
        policy_valid: true,
        misfold_count: 0,
        details: [result],
        output: result
      };
    } catch (error) {
      const output = (error.stdout || '') + (error.stderr || '');
      return {
        policy_valid: false,
        misfold_count: 1,
        details: [error.message],
        output: output
      };
    }
  }
}

export default new AgentFoldCheckMisfolds();
