import { execSync } from 'child_process';

const AGENTFOLD_DIR = 'C:\\Users\\jacks\\OneDrive\\Desktop\\agentfold';

class AgentFoldValidateGenome {
  constructor() {
    this.name = 'agentfold_validate_genome';
  }

  async execute(params) {
    try {
      const genomePath = params.genome_path || params._raw;
      if (!genomePath) {
        return { error: 'Missing required parameter: genome_path' };
      }
      const result = execSync(
        `python -m agentfold.cli validate-genome "${genomePath}"`,
        { cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 60000 }
      );
      return {
        passed: true,
        output: result,
        errors: [],
        warnings: []
      };
    } catch (error) {
      const output = (error.stdout || '') + (error.stderr || '');
      return {
        passed: false,
        output: output,
        errors: [error.message],
        warnings: []
      };
    }
  }
}

export default new AgentFoldValidateGenome();
