"""Append-only JSONL feedback store (best-effort, local file)."""
from __future__ import annotations
import json
from datetime import datetime, timezone
from pathlib import Path

STORE = Path(__file__).resolve().parents[2] / "feedback.jsonl"

def append_feedback(payload: dict) -> None:
    try:
        STORE.parent.mkdir(parents=True, exist_ok=True)
        row = {**payload, "at": datetime.now(timezone.utc).isoformat()}
        with STORE.open("a", encoding="utf-8") as fh:
            fh.write(json.dumps(row) + "\n")
    except Exception:
        pass
