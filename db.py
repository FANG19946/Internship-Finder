import os
import sqlite3


DB_LOCATION = os.path.join(os.path.dirname(__file__), "database", "app.db") 
SCHEMA_LOCATION = os.path.join(os.path.dirname(__file__), "schema.sql")

def get_connection():
    os.makedirs(os.path.dirname(DB_LOCATION), exist_ok=True)
    con = sqlite3.connect(DB_LOCATION)
    con.row_factory = sqlite3.Row

    con.execute("PRAGMA foreign_keys = ON;")

    return con


def init_db():
    con = get_connection()
    with open(SCHEMA_LOCATION, "r") as schema:
        schema_script = schema.read()

    cur = con.cursor()
    cur.executescript(schema_script)

    con.commit()
    con.close()
    print(f"Initialized database at {DB_LOCATION}")

if __name__ == "__main__":
    init_db()
