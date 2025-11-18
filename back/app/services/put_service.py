# app/services/put_service.py

from sqlalchemy.orm import Session
from datetime import datetime, timezone
from typing import Optional

from back.database.models.book_model import Books 
from back.app.schemas.books import BookUpdate, BookStatus


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

