# app/services/initialize_service.py

from sqlalchemy.orm import Session

from back.database.models.book_model import Books 
from back.app.services.external_api_service import BookExternalInfo

def create_book(db: Session, book_data: BookExternalInfo) -> Books:
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
        status="reserve",
    )

    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book
