import { execSync } from 'child_process';

const AGENTFOLD_DIR = 'C:\\Users\\jacks\\OneDrive\\Desktop\\agentfold';

class AgentFoldFitnessScore {
  constructor() {
    this.name = 'agentfold_fitness_score';
  }

  async execute(params) {
    try {
      const result = execSync('python -m pytest -q', {
        cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 60000
      });
      const match = result.match(/(\d+) passed/);
      const passed = match ? parseInt(match[1]) : 0;
      const failMatch = result.match(/(\d+) failed/);
      const failed = failMatch ? parseInt(failMatch[1]) : 0;
      const total = passed + failed;

      return {
        tests_passed: passed,
        tests_total: total || passed,
        success_rate: total > 0 ? passed / total : (passed > 0 ? 1.0 : 0.0),
        output: result
      };
    } catch (error) {
      const output = (error.stdout || '') + (error.stderr || '');
      const match = output.match(/(\d+) passed/);
      const passed = match ? parseInt(match[1]) : 0;
      const failMatch = output.match(/(\d+) failed/);
      const failed = failMatch ? parseInt(failMatch[1]) : 0;
      const total = passed + failed;

      return {
        tests_passed: passed,
        tests_total: total || passed,
        success_rate: total > 0 ? passed / total : 0,
        output: output
      };
    }
  }
}

export default new AgentFoldFitnessScore();
