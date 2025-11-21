# app/services/initialize_service.py

import random
from datetime import datetime, timedelta, timezone
from sqlalchemy.orm import Session
from back.database.models.book_model import Books 
from back.app.services.external_api_service import BookExternalInfo # Note: You may need to adjust this import path if different
from back.app.schemas.books import BookStatus # Assuming BookStatus is defined here or imported

def get_random_past_datetime(days_back: int) -> datetime:
    """Returns a random datetime between 'days_back' ago and now (UTC)."""
    now = datetime.now(timezone.utc)
    earliest = now - timedelta(days=days_back)

    delta_seconds = int((now - earliest).total_seconds())

    random_seconds = random.randint(0, delta_seconds)
    return earliest + timedelta(seconds=random_seconds)

def create_book(db: Session, book_data: BookExternalInfo) -> Books:
    """
    Creates a new Books record with randomly determined status and timestamps.
    """
    MAX_DAYS_BACK = 90

    status_choices = [
        BookStatus.STORE.value, 
        BookStatus.STORE.value,
        BookStatus.READ.value,
        BookStatus.READ.value,
        BookStatus.READ.value,
        BookStatus.RESERVE.value,
        BookStatus.RESERVE.value
    ]
    final_status = random.choice(status_choices)

    reserve_at = get_random_past_datetime(MAX_DAYS_BACK)
    store_at = None
    read_at = None
    
    if final_status == BookStatus.STORE.value or final_status == BookStatus.READ.value:
        time_diff_seconds = int((datetime.now(timezone.utc) - reserve_at).total_seconds())
        random_seconds_after_reserve = random.randint(0, time_diff_seconds)
        store_at = reserve_at + timedelta(seconds=random_seconds_after_reserve)
        
        if final_status == BookStatus.READ.value:
            time_diff_seconds = int((datetime.now(timezone.utc) - store_at).total_seconds())
            random_seconds_after_store = random.randint(0, time_diff_seconds)
            read_at = store_at + timedelta(seconds=random_seconds_after_store)

    last_modified = read_at or store_at or reserve_at

    
    db_book = Books(
        title=book_data.title,
        author=book_data.author,
        isbn=book_data.isbn,
        cover_image_url=book_data.cover_image_url,
        description="Book details fetched for initialization.", 

        status=final_status,
        status_reserve_at=reserve_at,
        status_store_at=store_at,
        status_read_at=read_at,
        last_modified=last_modified,
    )

    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    
    return db_book
