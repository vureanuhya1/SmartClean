"""Initialize SmartClean tables and demo data on an already-created MySQL database."""
import os
from pathlib import Path
import mysql.connector
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

config = {
    "host": os.getenv("DB_HOST") or os.getenv("MYSQLHOST", "localhost"),
    "port": int(os.getenv("DB_PORT") or os.getenv("MYSQLPORT", "3306")),
    "user": os.getenv("DB_USER") or os.getenv("MYSQLUSER", "root"),
    "password": os.getenv("DB_PASSWORD") or os.getenv("MYSQLPASSWORD", ""),
    "database": os.getenv("DB_NAME") or os.getenv("MYSQLDATABASE", "smartclean"),
}

sql = (BASE_DIR / "deployment_schema.sql").read_text(encoding="utf-8")

# This project schema has no semicolons inside string literals, so statement splitting
# is sufficient and keeps the initializer dependency-free.
statements = []
for statement in sql.split(";"):
    statement = statement.strip()
    if not statement or statement.startswith("--"):
        continue
    statements.append(statement)

conn = mysql.connector.connect(**config)
cur = conn.cursor()
try:
    for statement in statements:
        # Remove leading SQL comments from statements when present.
        lines = [line for line in statement.splitlines() if not line.strip().startswith("--")]
        statement = "\n".join(lines).strip()
        if statement:
            cur.execute(statement)
    conn.commit()
    print(f"SmartClean database initialized: {len(statements)} statements executed.")
finally:
    cur.close()
    conn.close()
