import { execSync } from 'child_process';

const AGENTFOLD_DIR = 'C:\\Users\\jacks\\OneDrive\\Desktop\\agentfold';

class AgentFoldGateEvaluate {
  constructor() {
    this.name = 'agentfold_gate_evaluate';
  }

  async execute(params) {
    try {
      const genomePath = params.genome_path || 'examples/genomes/minimal_agent_genome.json';
      const result = execSync(
        `python -m agentfold.cli run "${genomePath}"`,
        { cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 60000 }
      );
      return {
        decision: 'permit',
        reason: 'Pipeline executed successfully',
        output: result
      };
    } catch (error) {
      const output = (error.stdout || '') + (error.stderr || '');
      return {
        decision: 'block',
        reason: error.message,
        output: output
      };
    }
  }
}

export default new AgentFoldGateEvaluate();
