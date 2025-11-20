# api/routers/books.py

from back.app.schemas import books
from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional, List
from sqlalchemy.orm import Session
from back.database import connection
from back.database.models import book_model
from back.app.services.crud_service import update_book_details, update_book_status, create_book_from_external
from back.app.services import external_api_service, initialize_service
from typing import Annotated

router = APIRouter()

# 登録
@router.post("/", response_model=books.Book)
def create_book(book: books.BookCreate, session: Session = Depends(connection.get_db)):
    db_book = book_model.Books(**book.model_dump())
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

# 自動登録
@router.post("/external/{isbn}", response_model=books.Book)
async def auto_create_book_by_isbn(
    isbn: str,
    session: Session = Depends(connection.get_db)
):
    db_book = await create_book_from_external(session, isbn)   
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book


# すべての書籍取得
@router.get("/", response_model=List[books.Book])
def read_books(skip: int = 0, limit: int = 100, session: Session = Depends(connection.get_db)):
    books = session.query(book_model.Books).offset(skip).limit(limit).all()
    return books

# 特定の書籍取得
@router.get("/{book_id}", response_model=books.Book)
def read_book(book_id: int, session: Session = Depends(connection.get_db)):
    book = session.query(book_model.Books).filter(book_model.Books.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

# 全てを更新
@router.put("/{book_id}", response_model=books.Book)
def update_book(book_id: int, book: books.BookUpdate, session: Session = Depends(connection.get_db)):
    updated_book = update_book_details(session, book_id, book) 
    if updated_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated_book

# ステータスのみを更新 
@router.patch("/{book_id}/status", response_model=books.Book) 
def update_book_detail_status(book_id: int, status_update: books.BookStatusUpdate, session: Session = Depends(connection.get_db)):
    new_status_value = status_update.status.value
    updated_book = update_book_status(session, book_id, new_status_value)
    if updated_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated_book

# 削除
@router.delete("/{book_id}", response_model=books.Book)
def delete_book(book_id: int, session: Session = Depends(connection.get_db)):
    book = session.query(book_model.Books).filter(book_model.Books.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    session.delete(book)
    session.commit()
    return book