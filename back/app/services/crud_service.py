# app/services/put_service.py

from datetime import datetime, timezone
from typing import Optional
from sqlalchemy.orm import Session

from fastapi import HTTPException, status

from database.models.book_model import Books 
from app.schemas.books import BookStatus, BookExternalInfo
from app.services import external_api_service


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
        if new_status==BookStatus.STORE:
            db_book.status_store_at = now_utc
        if new_status==BookStatus.READ:
            db_book.status_read_at = now_utc
        if new_status==BookStatus.DETETE:
            db_book.isbn = None
        db_book.last_modified = now_utc
        
        session.commit()
        session.refresh(db_book)

    return db_book

async def create_book_from_external_reserve(session: Session, isbn: str):
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
    now_utc = datetime.now(timezone.utc)
    db_book.status = BookStatus.RESERVE.value
    db_book.status_reserve_at = now_utc 
    db_book.last_modified = now_utc

    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    
    return db_book


async def create_book_from_external_store(session: Session, isbn: str):
    db_book = await create_book_from_external_reserve(session, isbn)

    now_utc = datetime.now(timezone.utc)
    db_book.status = BookStatus.STORE.value
    db_book.status_store_at = now_utc
    db_book.last_modified = now_utc
    
    session.commit()
    session.refresh(db_book)

    return db_book