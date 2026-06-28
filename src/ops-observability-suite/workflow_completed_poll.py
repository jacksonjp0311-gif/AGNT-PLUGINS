import sys
import json
import argparse
from datetime import datetime

from db_util import find_db_path, connect_readonly, json_out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--since', type=str, default=None, help='ISO timestamp (end_time) marker, exclusive')
    ap.add_argument('--status', type=str, default='any')
    ap.add_argument('--name_contains', type=str, default=None)
    ap.add_argument('--limit', type=int, default=50)
    args = ap.parse_args()

    db_path = find_db_path()
    con = connect_readonly(db_path)
    cur = con.cursor()

    where = ["end_time IS NOT NULL"]
    params = []

    if args.since:
        where.append("end_time > ?")
        params.append(args.since)

    if args.status and args.status != 'any':
        where.append("status = ?")
        params.append(args.status)

    if args.name_contains:
        where.append("workflow_name LIKE ?")
        params.append(f"%{args.name_contains}%")

    sql = f"""
      SELECT id, workflow_id, workflow_name, start_time, end_time, status, credits_used
      FROM workflow_executions
      WHERE {' AND '.join(where)}
      ORDER BY end_time ASC
      LIMIT ?
    """
    params.append(args.limit)

    cur.execute(sql, params)
    rows = cur.fetchall()
    cols = ['id','workflow_id','workflow_name','start_time','end_time','status','credits_used']
    out = [dict(zip(cols, r)) for r in rows]

    latest = args.since
    if out:
        latest = out[-1]['end_time']

    con.close()

    json_out({
        'db_path': db_path,
        'since': args.since,
        'latest': latest,
        'count': len(out),
        'executions': out
    })


if __name__ == '__main__':
    main()
