import sys
import json
import argparse
from collections import Counter, defaultdict
from datetime import datetime

from db_util import find_db_path, connect_readonly, json_out


def first_line(s: str) -> str:
    if not s:
        return ''
    return str(s).splitlines()[0].strip()


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--days', type=int, default=7)
    ap.add_argument('--max_rows', type=int, default=5000)
    ap.add_argument('--top_k', type=int, default=10)
    args = ap.parse_args()

    db_path = find_db_path()
    con = connect_readonly(db_path)
    cur = con.cursor()

    # Pull error node rows joined to workflow executions
    cur.execute(
        """
        SELECT ne.execution_id, ne.node_id, ne.start_time, ne.end_time, ne.error,
               we.workflow_id, we.workflow_name, we.status as workflow_status, we.credits_used
        FROM node_executions ne
        JOIN workflow_executions we ON we.id = ne.execution_id
        WHERE ne.status = 'error'
          AND ne.start_time >= datetime('now', '-' || ? || ' days')
        ORDER BY ne.start_time DESC
        LIMIT ?
        """,
        (args.days, args.max_rows)
    )
    rows = cur.fetchall()
    cols = ['execution_id','node_id','start_time','end_time','error','workflow_id','workflow_name','workflow_status','credits_used']
    err_rows = [dict(zip(cols, r)) for r in rows]

    # Workflow totals in window
    cur.execute(
        """
        SELECT id, workflow_id, workflow_name, status, start_time, end_time, credits_used
        FROM workflow_executions
        WHERE start_time >= datetime('now', '-' || ? || ' days')
        """,
        (args.days,)
    )
    wf_rows = cur.fetchall()
    wf_cols = ['id','workflow_id','workflow_name','status','start_time','end_time','credits_used']
    workflows = [dict(zip(wf_cols, r)) for r in wf_rows]

    con.close()

    wf_total = len(workflows)
    wf_error_set = set(r['execution_id'] for r in err_rows)
    wf_failed = len(wf_error_set)
    wf_error_rate = (wf_failed / wf_total) if wf_total else 0.0

    # Cluster by (node_id, error_head)
    cluster_map = defaultdict(list)
    for r in err_rows:
        key = (r['node_id'], first_line(r.get('error'))[:180])
        cluster_map[key].append(r)

    clusters = []
    for (node_id, err_head), items in cluster_map.items():
        wf_names = Counter(i.get('workflow_name') or 'Unknown' for i in items)
        example = items[0]
        clusters.append({
            'node_id': node_id,
            'error_head': err_head,
            'count': len(items),
            'top_workflows': wf_names.most_common(5),
            'sample_execution_id': example.get('execution_id'),
            'sample_workflow_name': example.get('workflow_name'),
            'sample_error': example.get('error')
        })

    clusters.sort(key=lambda c: c['count'], reverse=True)
    top_clusters = clusters[:args.top_k]

    # Node hot spots
    node_counts = Counter(r['node_id'] for r in err_rows)
    top_nodes = node_counts.most_common(10)

    # Workflow hot spots
    wf_counts = Counter(r.get('workflow_name') or 'Unknown' for r in err_rows)
    top_workflows = wf_counts.most_common(10)

    # Markdown report
    stamp = datetime.utcnow().isoformat() + 'Z'
    md = []
    md.append('# Execution Triage / Failure Clustering')
    md.append('')
    md.append(f'> Generated: {stamp} | Window: last {args.days} days')
    md.append('')
    md.append('## Summary')
    md.append('')
    md.append('| Metric | Value |')
    md.append('|---|---:|')
    md.append(f'| Total workflow executions | {wf_total} |')
    md.append(f'| Executions w/ node error | {wf_failed} |')
    md.append(f'| Error rate (node-error) | {wf_error_rate*100:.1f}% |')
    md.append(f'| Node error rows scanned | {len(err_rows)} |')
    md.append('')

    md.append('## Top failing nodes')
    md.append('')
    if top_nodes:
        md.append('| Node ID | Error rows |')
        md.append('|---|---:|')
        for n,c in top_nodes:
            md.append(f'| {n} | {c} |')
    else:
        md.append('- (none)')
    md.append('')

    md.append('## Top failing workflows')
    md.append('')
    if top_workflows:
        md.append('| Workflow | Error rows |')
        md.append('|---|---:|')
        for n,c in top_workflows:
            md.append(f'| {n} | {c} |')
    else:
        md.append('- (none)')
    md.append('')

    md.append('## Top failure clusters')
    md.append('')
    if top_clusters:
        for i,cl in enumerate(top_clusters, start=1):
            md.append(f'### {i}. {cl["node_id"]}')
            md.append('')
            md.append(f'- Count: **{cl["count"]}**')
            md.append(f'- Error head: `{cl["error_head"]}`')
            md.append(f'- Example execution: `{cl["sample_execution_id"]}`')
            md.append('')
            md.append('Top workflows:')
            for wf_name, cnt in cl['top_workflows']:
                md.append(f'- {wf_name}: {cnt}')
            md.append('')
    else:
        md.append('- (none)')
    md.append('')

    md.append('## Action list (evidence-based)')
    md.append('')
    if top_clusters:
        md.append('1) Fix the top 1–2 clusters first (they usually explain most of the error rate).')
        md.append('2) Add a canary workflow that exercises the failing node/tool daily.')
        md.append('3) Gate high-cost workflows (authorize_button) when error rate > 2%.')
    else:
        md.append('No actionable clusters found in this window.')

    json_out({
        'db_path': db_path,
        'summary': {
            'days': args.days,
            'workflow_executions_total': wf_total,
            'workflow_executions_with_node_error': wf_failed,
            'error_rate': wf_error_rate,
            'node_error_rows_scanned': len(err_rows),
        },
        'top_nodes': top_nodes,
        'top_workflows': top_workflows,
        'clusters': top_clusters,
        'report': '\n'.join(md)
    })


if __name__ == '__main__':
    main()
