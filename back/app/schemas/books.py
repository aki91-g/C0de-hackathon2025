# app/schemas/books.py

from enum import Enum
from datetime import datetime, timezone
from pydantic import BaseModel, ConfigDict, Field, NonNegativeInt
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
    cost: int

    def set_title(self,title):
        self.title = title
    def set_author(self,author):
        self.author = author
    def set_publisher(self,publisher):
        self.publisher = publisher
    def set_publication_date(self,publication_date):
        self.publication_date = publication_date
    def set_cover_image_url(self,cover_image_url):
        self.cover_image_url = cover_image_url
    def set_cost(self,cost):
        self.cost = cost
    def get_title(self,):
        return self.title
    def get_author(self):
        return self.author
    def get_publisher(self):
        return self.publisher
    def get_publication_date(self):
        return self.publication_date
    def get_cover_image_url(self):
        return self.cover_image_url
    def get_cost(self):
        return self.cost
    
    def check(self) -> Optional[list]:
        checker = [0]*6
        if self.title == "":
            checker[0] = 1
        if self.author == "":
            checker[1] = 1
        if self.publisher == None:
            checker[2] = 1
        if self.publication_date == None:
            checker[3] = 1
        if self.cover_image_url == None:
            checker[4] = 1
        if self.cost == 0:
            checker[5] = 1
        
        for i in checker:
            if i == 1:
                return checker
        return None
