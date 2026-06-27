const http = require('http');

/**
 * System Coherence Monitor — Check System Health (CJS)
 *
 * NOTE: This tool is intentionally CommonJS because the AGNT registry tool runner
 * executes plugin tools in a CJS context.
 */

module.exports = {
  name: 'scm-check-health',

  /**
   * @param {object} params
   * @param {object} inputData
   * @param {object} workflowEngine
   */
  async execute(params, inputData, workflowEngine) {
    // Prefer the auth token passed through the AGNT tool runner (Authorization header)
    // Fallback to env var if present.
    const tokenHeader =
      workflowEngine?.authToken ||
      (process.env.AGNT_AUTH_TOKEN ? 'Bearer ' + process.env.AGNT_AUTH_TOKEN : null);

    const API = 'http://localhost:3333/api';

    // If we can't get an auth token (common inside timer-driven workflows),
    // fall back to unauthenticated health checks so the monitor can still run
    // and the workflow doesn't enter an error storm.
    const limitedMode = !tokenHeader;

    // Helper to call AGNT API
    const apiCall = (endpoint, options = {}) => {
      return new Promise((resolve, reject) => {
        const url = new URL(API + endpoint);
        const reqOptions = {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname + url.search,
          method: options.method || 'GET',
          headers: {
            ...(tokenHeader ? { Authorization: tokenHeader } : {}),
            'Content-Type': 'application/json'
          }
        };

        const req = http.request(reqOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve(null);
            }
          });
        });

        req.on('error', reject);
        if (options.body) req.write(JSON.stringify(options.body));
        req.end();
      });
    };

    try {
      if (limitedMode) {
        const apiHealth = await apiCall('/health');
        const wfHealth = await apiCall('/workflows/health');
        const plugins = await apiCall('/plugins/installed');

        const okApi = apiHealth && apiHealth.status === 'OK';
        const okWf = wfHealth && wfHealth.status === 'OK';

        const coherenceScore = okApi && okWf ? 90 : 60;

        return {
          status: 'success',
          mode: 'limited',
          timestamp: new Date().toISOString(),
          coherence_score: coherenceScore,
          system_overview: {
            total_workflows: null,
            active: null,
            stopped: null,
            inactive: null,
            total_executions: null,
            total_errors: null,
            total_credits: null,
            api_health: apiHealth?.status || 'unknown',
            workflows_health: wfHealth?.status || 'unknown',
            total_plugins: plugins?.stats?.total || plugins?.stats?.totalPlugins || plugins?.plugins?.length || null,
            total_tools: plugins?.stats?.totalTools || null
          },
          anomalies: okApi && okWf ? [] : [
            {
              type: 'HEALTH_DEGRADED',
              severity: 'medium',
              workflow: 'SYSTEM',
              workflowId: null,
              message: `API health=${apiHealth?.status || 'unknown'}, workflow health=${wfHealth?.status || 'unknown'}`
            }
          ],
          workflow_analysis: [],
          recommendations: [
            'Limited mode: no auth token available, so workflow/execution DB analysis is skipped.',
            'If you want full SCM analysis inside workflows, update the workflow runner to pass authToken into plugin tools.'
          ]
        };
      }

      // 1) Get all workflows (authenticated)
      const workflowsResp = await apiCall('/workflows/');
      const workflows = workflowsResp?.workflows || workflowsResp || [];

      // 2) Get recent executions
      let recentExecs = [];
      try {
        const execsResp = await apiCall('/executions?limit=50');
        recentExecs = Array.isArray(execsResp) ? execsResp : (Array.isArray(execsResp?.executions) ? execsResp.executions : []);
      } catch (e) {
        // non-fatal
      }

      // 3) Analyze execution patterns per workflow
      let totalExecutions = 0;
      let totalErrors = 0;
      let totalCredits = 0;

      const execCounts = {};
      const errorCounts = {};
      const creditTotals = {};

      for (const exec of recentExecs) {
        const wfId = exec.workflowId;
        execCounts[wfId] = (execCounts[wfId] || 0) + 1;
        if (exec.status === 'error') {
          errorCounts[wfId] = (errorCounts[wfId] || 0) + 1;
          totalErrors++;
        }
        const credits = exec.creditsUsed || 0;
        creditTotals[wfId] = (creditTotals[wfId] || 0) + credits;
        totalCredits += credits;
        totalExecutions++;
      }

      // 4) Detect anomalies
      const anomalies = [];
      const workflowAnalysis = [];

      for (const wf of workflows) {
        const wfId = wf.id;
        const execCount = execCounts[wfId] || 0;
        const errorCount = errorCounts[wfId] || 0;
        const credits = creditTotals[wfId] || 0;
        const errorRate = execCount > 0 ? errorCount / execCount : 0;

        if (execCount > 3 && errorRate > 0.5) {
          anomalies.push({
            type: 'ERROR_STORM',
            severity: 'critical',
            workflow: wf.name,
            workflowId: wfId,
            message: `${(errorRate * 100).toFixed(0)}% error rate (${errorCount}/${execCount} executions)`
          });
        }

        if (execCount > 10) {
          anomalies.push({
            type: 'RUNAWAY_EXECUTION',
            severity: 'high',
            workflow: wf.name,
            workflowId: wfId,
            message: `${execCount} executions in recent window`
          });
        }

        if (credits > 100) {
          anomalies.push({
            type: 'CREDIT_SPIKE',
            severity: 'medium',
            workflow: wf.name,
            workflowId: wfId,
            message: `${credits.toFixed(1)} credits consumed recently`
          });
        }

        workflowAnalysis.push({
          name: wf.name,
          id: wfId,
          status: wf.status,
          executions: execCount,
          errors: errorCount,
          errorRate: errorRate,
          credits: credits
        });
      }

      // 5) Coherence score
      let coherenceScore = 100;
      for (const a of anomalies) {
        if (a.severity === 'critical') coherenceScore -= 25;
        else if (a.severity === 'high') coherenceScore -= 15;
        else if (a.severity === 'medium') coherenceScore -= 5;
      }
      coherenceScore = Math.max(0, Math.min(100, coherenceScore));

      // 6) System overview
      const activeWorkflows = workflows.filter((w) => w.status === 'listening' || w.status === 'running').length;
      const stoppedWorkflows = workflows.filter((w) => w.status === 'stopped').length;
      const inactiveWorkflows = workflows.filter((w) => w.status === 'inactive').length;

      return {
        status: 'success',
        timestamp: new Date().toISOString(),
        coherence_score: coherenceScore,
        system_overview: {
          total_workflows: workflows.length,
          active: activeWorkflows,
          stopped: stoppedWorkflows,
          inactive: inactiveWorkflows,
          total_executions: totalExecutions,
          total_errors: totalErrors,
          total_credits: totalCredits
        },
        anomalies,
        workflow_analysis: workflowAnalysis,
        recommendations:
          anomalies.length > 0
            ? anomalies.map((a) => `[${a.severity}] ${a.workflow}: ${a.message}`)
            : ['System healthy. No anomalies detected.']
      };
    } catch (err) {
      return {
        status: 'error',
        error: err?.message || String(err),
        timestamp: new Date().toISOString()
      };
    }
  }
};
