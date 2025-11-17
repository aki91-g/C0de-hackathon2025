# models/schema.py

from enum import Enum
from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field
from typing import Optional

def get_utcnow_aware() -> datetime:
    """Returns the current timezone-aware datetime in UTC."""
    return datetime.now(timezone.utc)

class BookStatus(str, Enum):
    STORE = 'store'
    RESERVE = 'reserve'
    READ = 'read'

class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    description: Optional[str] = None
    status: BookStatus = BookStatus.STORE   
    last_modified: datetime = Field(default_factory=get_utcnow_aware)
    status_changed_at: datetime = Field(default_factory=get_utcnow_aware)

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    pass

class Book(BookBase):
    id: int
    model_config = ConfigDict(from_attributes=True)