# app/db/modeld.py

from pydantic import BaseModel, ConfigDict
from typing import Optional

class BookBase(BaseModel):
    title: str
    author: str
    isbn: str
    description: Optional[str] = None

class BookCreate(BookBase):
    pass

class BookUpdate(BookBase):
    pass

class Book(BookBase):
    id: int

    model_config = ConfigDict(from_attributes=True)