# app/services/db_service.py

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from datetime import datetime, timezone
from typing import Optional, Generator, Any

from models.db import Books 
from models.schema import BookUpdate, BookStatus
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


def get_utcnow_aware() -> datetime:
    """Helper function to get current timezone-aware UTC time."""
    return datetime.now(timezone.utc)

def update_book_details(db: Session, book_id: int, update_data: BookUpdate) -> Optional[Books]:
    """
    Updates book details, conditionally setting status_changed_at only if the status itself changes.
    """
    db_book = db.query(Books).filter(Books.id == book_id).first()
    if not db_book:
        return None

    old_status_str = db_book.status 
    
    if 'status' in update_data.model_dump(exclude_unset=True):
        new_status_enum: BookStatus = update_data.status
        status_has_changed = (old_status_str != new_status_enum.value)
    else:
        status_has_changed = False

    for key, value in update_data.model_dump(exclude_unset=True).items():
        setattr(db_book, key, value)
    

    db_book.last_modified = get_utcnow_aware() 

    if status_has_changed:
        db_book.status_changed_at = get_utcnow_aware()
        
    db.commit()
    db.refresh(db_book)
    return db_book

