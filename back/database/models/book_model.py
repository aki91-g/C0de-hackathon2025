# database/models/book_model.py

from datetime import datetime, timezone
from sqlalchemy.ext.declarative import declarative_base 
from sqlalchemy import Column, Integer, String, DateTime

Base = declarative_base()

class Books(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    isbn = Column(String, unique=True, index=True)
    cover_image_url = Column(String)
    cost = Column(Integer, default = 0)
    description = Column(String, nullable=True)
    status = Column(
        String,
        default="reserve",
        nullable=False
    )
    last_modified = Column(
        DateTime(timezone=True),
        default=datetime.now(timezone.utc),
        nullable=False
    )
    status_reserve_at = Column(
        DateTime(timezone=True),
        default=datetime.now(timezone.utc),
        nullable=False
    )
    status_store_at = Column(
        DateTime(timezone=True),
        default=None,
        nullable=True
    )
    status_read_at = Column(
        DateTime(timezone=True),
        default=None,
        nullable=True
    )



