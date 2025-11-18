# models/db.py

from datetime import datetime, timezone
from sqlalchemy.ext.declarative import declarative_base 
from sqlalchemy import Column, Integer, String, DateTime

Base = declarative_base()

def utcnow_aware_default() -> datetime:
    """Returns the current timezone-aware datetime in UTC."""
    return datetime.now(timezone.utc)

class Books(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    isbn = Column(String, unique=True, index=True)
    cover_image_url = Column(String)
    description = Column(String, nullable=True)
    status = Column(
        String,
        default="store",
        nullable=False
    )
    last_modified = Column(
        DateTime(timezone=True),
        default=utcnow_aware_default,
        nullable=False
    )
    status_changed_at = Column(
        DateTime(timezone=True),
        default=utcnow_aware_default,
        nullable=False
    )



