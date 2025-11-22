"""Utility script to create database tables on the production database.

Usage:
    BACKEND_PORT=8000 DATABASE_URL=... python creat_table.py

The script relies on DATABASE_URL being set, just like the FastAPI app.
"""

from __future__ import annotations

import sys

from database.connection import get_engine
from database.models import book_model


def create_tables() -> None:
    """Create all tables defined on the SQLAlchemy Base metadata."""
    engine = get_engine()
    if engine is None:  # Defensive guard in case DATABASE_URL is missing.
        raise RuntimeError(
            "DATABASE_URL is not configured; cannot create tables."
        )

    book_model.Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    try:
        create_tables()
    except Exception as exc:  # pragma: no cover - utility script
        print(f"Failed to create tables: {exc}", file=sys.stderr)
        raise
    else:
        print("Database tables created successfully.")
