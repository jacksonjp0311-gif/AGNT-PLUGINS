import os
import sqlite3
import json
from typing import Optional


def find_db_path() -> str:
    # Highest priority: explicit env
    env = os.environ.get('AGNT_DB_PATH')
    if env and os.path.exists(env):
        return env

    home = os.path.expanduser('~')
    candidates = [
        os.path.join(home, 'AppData', 'Roaming', 'AGNT', 'Data', 'agnt.db'),
        os.path.join(home, 'OneDrive', 'Desktop', 'agnt-evo', 'backend', 'agnt.db'),
        os.path.join(home, 'Desktop', 'agnt-evo', 'backend', 'agnt.db'),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p

    raise FileNotFoundError('AGNT SQLite DB not found. Set AGNT_DB_PATH env var.')


def connect_readonly(db_path: str):
    # SQLite URI mode for RO
    uri = f"file:{db_path}?mode=ro"
    return sqlite3.connect(uri, uri=True)


def json_out(obj):
    print(json.dumps(obj, ensure_ascii=False))
