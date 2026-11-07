"""Build a disposable mock SQLite index from portable Markdown/JSON.

This deliberately is NOT Altair II's production schema.
"""
import hashlib
import json
import sqlite3
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PORTABLE = ROOT / "workspace" / "portable"
OUTPUT = ROOT / "workspace" / "runtime" / "workspace.demo.sqlite"


def iter_records():
    for path in sorted(PORTABLE.rglob("*.json")):
        value = json.loads(path.read_text(encoding="utf-8"))
        if isinstance(value, dict) and isinstance(value.get("id"), str):
            yield path, value
    for path in sorted(PORTABLE.rglob("*.jsonl")):
        for line in path.read_text(encoding="utf-8").splitlines():
            if line.strip():
                value = json.loads(line)
                if isinstance(value, dict) and isinstance(value.get("id"), str):
                    yield path, value


def run():
    manifest = json.loads((PORTABLE / "manifest.json").read_text(encoding="utf-8"))
    workspace = json.loads((ROOT / "workspace" / "altair-workspace.json").read_text(encoding="utf-8"))
    if manifest["workspaceId"] != workspace["workspaceId"]:
        raise ValueError("Workspace ID mismatch")

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    if OUTPUT.exists():
        OUTPUT.unlink()  # Only the exact generated fixture path, never user-authored data.
    db = sqlite3.connect(OUTPUT)
    try:
        db.executescript("""
        PRAGMA foreign_keys = ON;
        CREATE TABLE workspace (id TEXT PRIMARY KEY, format TEXT NOT NULL, sequence TEXT NOT NULL);
        CREATE TABLE records (id TEXT PRIMARY KEY, kind TEXT NOT NULL, path TEXT NOT NULL, json TEXT NOT NULL);
        CREATE TABLE documents (id TEXT PRIMARY KEY REFERENCES records(id), body TEXT NOT NULL, sha256 TEXT NOT NULL);
        CREATE TABLE record_refs (source_id TEXT NOT NULL REFERENCES records(id), target_id TEXT NOT NULL REFERENCES records(id), relation TEXT NOT NULL);
        CREATE INDEX idx_record_kind ON records(kind);
        CREATE INDEX idx_ref_target ON record_refs(target_id);
        """)
        db.execute("INSERT INTO workspace VALUES (?,?,?)", (workspace["workspaceId"], manifest["format"], manifest["contentSequence"]))
        records = list(iter_records())
        for path, item in records:
            db.execute("INSERT INTO records VALUES (?,?,?,?)", (item["id"], item.get("kind", "untyped"), path.relative_to(PORTABLE).as_posix(), json.dumps(item, ensure_ascii=False, sort_keys=True)))

        references = []
        for path, item in records:
            if item.get("kind") == "document":
                body_path = (PORTABLE / item["bodyPath"]).resolve()
                if not body_path.is_relative_to(PORTABLE.resolve()):
                    raise ValueError(f"Invalid body path: {item['id']}")
                body_bytes = body_path.read_bytes()
                digest = hashlib.sha256(body_bytes).hexdigest()
                if item.get("bodySha256") and item["bodySha256"] != digest:
                    raise ValueError(f"Body checksum mismatch: {item['id']}")
                db.execute("INSERT INTO documents VALUES (?,?,?)", (item["id"], body_bytes.decode("utf-8"), digest))
            for field in ("storyId", "volumeId", "documentId", "entityId", "eventId", "holderId", "subjectId", "arcId", "targetId"):
                if item.get(field):
                    references.append((item["id"], item[field], field))
            for field in ("volumeIds", "participantIds"):
                references.extend((item["id"], target, field) for target in item.get(field, []))
            source = item.get("sourceRef", {})
            if source.get("documentId"):
                references.append((item["id"], source["documentId"], "sourceRef"))

        db.executemany("INSERT INTO record_refs VALUES (?,?,?)", references)
        db.commit()
        failed = db.execute("PRAGMA foreign_key_check").fetchall()
        if failed:
            raise ValueError(f"Broken references: {failed[:5]}")
        print(json.dumps({"status": "PASS", "sqlite": str(OUTPUT.relative_to(ROOT)), "records": len(records), "references": len(references), "documents": db.execute("SELECT COUNT(*) FROM documents").fetchone()[0]}, ensure_ascii=False))
    finally:
        db.close()


if __name__ == "__main__":
    run()
