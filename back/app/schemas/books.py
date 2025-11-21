# app/schemas/books.py

from enum import Enum
from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field, NonNegativeInt
from typing import Optional


class BookStatus(str, Enum):
    STORE = 'store'
    RESERVE = 'reserve'
    READ = 'read'
    DETETE = 'delete'

class BookBase(BaseModel):
    title: str
    author: str
    isbn: str | None
    cover_image_url: Optional[str] = None
    cost: Optional[NonNegativeInt] = 0
    description: Optional[str] = None
    status: BookStatus = BookStatus.RESERVE 
    last_modified: datetime = Field(default_factory=datetime.now(timezone.utc))
    status_reserve_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    status_store_at : datetime | None = Field(default=None)
    status_read_at: datetime | None = Field(default=None)

class BookCreate(BookBase):
    pass

class BookStatusUpdate(BaseModel):
    status: BookStatus

class BookCostUpdate(BaseModel):
    cost: NonNegativeInt

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
