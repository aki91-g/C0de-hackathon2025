# app/api/endpoints/books.py - 書籍情報APIのエンドポイント

from fastapi import APIRouter, HTTPException
from typing import Optional
from back.app.services import external_api_service

router = APIRouter()

@router.get("/{isbn}", response_model=Optional[external_api_service.BookInfo])
async def get_book(isbn: str):
    book = await external_api_service.get_book_info(isbn)
    if book:
        return book
    else:
        raise HTTPException(status_code=404, detail="Book not found")