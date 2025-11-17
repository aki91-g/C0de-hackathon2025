# models/db.py

import os
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, Column, Integer, String, DateTime

def utcnow_aware_default() -> datetime:
    """Returns the current timezone-aware datetime in UTC."""
    return datetime.now(timezone.utc)

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String)
    isbn = Column(String, unique=True, index=True)
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

# Base.metadata.drop_all(bind=engine) ### REMOVE AFTER TESTING !!!!!!
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()