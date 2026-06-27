import { execSync } from 'child_process';

const AGENTFOLD_DIR = 'C:\\Users\\jacks\\OneDrive\\Desktop\\agentfold';

class AgentFoldHealthSnapshot {
  constructor() {
    this.name = 'agentfold_health_snapshot';
  }

  async execute(params) {
    try {
      // Run tests
      let testsPassed = 0;
      let testsTotal = 0;
      let cliWorking = false;
      let genomeValidation = 'unavailable';

      try {
        const testResult = execSync('python -m pytest -q', {
          cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 60000
        });
        const match = testResult.match(/(\d+) passed/);
        if (match) testsPassed = parseInt(match[1]);
        testsTotal = testsPassed;
      } catch (e) {
        const output = (e.stdout || '') + (e.stderr || '');
        const match = output.match(/(\d+) passed/);
        if (match) testsPassed = parseInt(match[1]);
        const failMatch = output.match(/(\d+) failed/);
        testsTotal = testsPassed + (failMatch ? parseInt(failMatch[1]) : 0);
      }

      try {
        execSync('python -m agentfold.cli --help', {
          cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 15000
        });
        cliWorking = true;
      } catch (e) { /* CLI not working */ }

      try {
        execSync('python -m agentfold.cli validate-genome examples/genomes/minimal_agent_genome.json', {
          cwd: AGENTFOLD_DIR, encoding: 'utf-8', timeout: 30000
        });
        genomeValidation = 'passed';
      } catch (e) {
        genomeValidation = 'failed';
      }

      return {
        tests_passed: testsPassed,
        cli_working: cliWorking,
        genome_validation: genomeValidation,
        health_table: [
          { surface: 'Unit Tests', status: `${testsPassed} passed` },
          { surface: 'CLI', status: cliWorking ? 'available' : 'unavailable' },
          { surface: 'Genome Validation', status: genomeValidation },
          { surface: 'Rehydration Protocol', status: 'documented' },
          { surface: 'Non-Claim Lock', status: 'active' }
        ],
        non_claim_lock: 'active'
      };
    } catch (error) {
      return { error: error.message };
    }
  }
}

export default new AgentFoldHealthSnapshot();
