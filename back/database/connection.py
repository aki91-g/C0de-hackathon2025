# app/services/db_service.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from datetime import datetime, timezone
from typing import Optional, Generator, Any

from back.database.models.book_model import Books 
from back.app.schemas.books import BookUpdate, BookStatus
from back.app.services.external_api_service import BookInfo


DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Dependency function to yield a new database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_engine() -> Any:
    """Dependency function to get the SQLAlchemy engine."""
    return engine

def create_book(db: Session, book_data: BookInfo) -> Books:
    """
    Creates a new Books record from the external BookInfo model,
    filling in default values for local-only fields.
    """
    db_book = Books(
        title=book_data.title,
        author=book_data.author,
        isbn=book_data.isbn,
        cover_image_url=book_data.cover_image_url,
        description="Book details fetched from external source.", 
        status="store",
    )

    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book
