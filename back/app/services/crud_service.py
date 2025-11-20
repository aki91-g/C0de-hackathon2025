# app/services/put_service.py

from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from back.database.models.book_model import Books 
from back.app.schemas.books import BookUpdate, BookStatus, BookExternalInfo
from back.app.services import external_api_service


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


def update_book_status(session: Session, book_id: int, new_status: str) -> Optional[Books]:
    """
    Updates only the 'status' and relevant timestamps for a specific book.
    """
    db_book = session.query(Books).filter(Books.id == book_id).first()

    if db_book is None:
        return None
    
    if db_book.status != new_status:
        now_utc = datetime.now(timezone.utc)
        
        db_book.status = new_status
        db_book.last_modified = now_utc
        db_book.status_changed_at = now_utc
        
        session.commit()
        session.refresh(db_book)

    return db_book


async def create_book_from_external(session: Session, isbn: str):
    external_info: Optional[BookExternalInfo] = await external_api_service.get_book_info(isbn)

    if external_info is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book information not found from external sources for ISBN: {isbn}",
        )
    
    book_data = external_info.model_dump(exclude_none=True)
    db_create_data = {
        "isbn": book_data.get("isbn"),
        "title": book_data.get("title"),
        "author": book_data.get("author"),
        "cover_image_url": book_data.get("cover_image_url"),
    }

    existing_book = session.query(Books).filter(
        Books.isbn == db_create_data["isbn"]
    ).first()
    
    if existing_book:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Book with ISBN {isbn} already exists in the database. Existing Book ID: {existing_book.id}",
        )

    db_book = Books(**db_create_data) 
    return db_book
        