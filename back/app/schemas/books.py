# app/schemas/books.py

from enum import Enum
from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional


class BookStatus(str, Enum):
    STORE = 'store'
    RESERVE = 'reserve'
    READ = 'read'

class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    cover_image_url: Optional[str] = None
    description: Optional[str] = None
    status: BookStatus = BookStatus.STORE 
    last_modified: datetime = Field(default_factory=datetime.now(timezone.utc))
    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    status_reserve_at: datetime | None = Field(default=None)
    status_read_at: datetime | None = Field(default=None)

class BookCreate(BookBase):
    pass

# class BookUpdate(BookBase):
#     pass

class BookStatusUpdate(BaseModel):
    status: BookStatus

class Book(BookBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class BookExternalInfo(BaseModel):
    isbn: str
    title: str
    author: str
    publisher: Optional[str] = None
    publication_date: Optional[str] = None
    cover_image_url: Optional[str] = None
