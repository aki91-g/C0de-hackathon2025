# models/external_book.py - 書籍モデルの定義 

from typing import Optional
from pydantic import BaseModel

class BookInfo(BaseModel):
    isbn: str
    title: str
    author: str
    publisher: Optional[str] = None
    publication_date: Optional[str] = None
    cover_image_url: Optional[str] = None
