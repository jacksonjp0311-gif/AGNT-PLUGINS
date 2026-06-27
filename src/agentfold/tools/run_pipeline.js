import { execSync } from 'child_process';

const AGENTFOLD_DIR = 'C:\\Users\\jacks\\OneDrive\\Desktop\\agentfold';

class AgentFoldRunPipeline {
  constructor() {
    this.name = 'agentfold_run_pipeline';
  }

  async execute(params) {
    try {
      const genomePath = params.genome_path || params._raw;
      if (!genomePath) {
        return { error: 'Missing required parameter: genome_path' };
      }
      const taskArg = params.task_path ? `--task "${params.task_path}"` : '';
      const result = execSync(
        `python -m agentfold.cli run "${genomePath}" ${taskArg}`,
        { cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 120000 }
      );
      return {
        status: 'success',
        output: result,
        fitness: {},
        misfolds: [],
        gate_decision: 'permit'
      };
    } catch (error) {
      return {
        status: 'error',
        output: (error.stdout || '') + (error.stderr || ''),
        error: error.message
      };
    }
  }
}

export default new AgentFoldRunPipeline();
