# api/routers/books.py

from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Depends, status
from typing import Optional, List
from sqlalchemy.orm import Session
from app.schemas import books
from database import connection
from database.models import book_model
from app.services.crud_service import update_book_status, create_book_from_external_reserve, create_book_from_external_store
from app.services import external_api_service, initialize_service

router = APIRouter()

# 登録
@router.post("/", response_model=books.Book)
def create_book(book: books.BookCreate, session: Session = Depends(connection.get_db)):
    db_book = book_model.Books(**book.model_dump())
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book


# 自動登録(店) - Reserve Status
@router.post("/external/reserve/{isbn}", response_model=books.Book)
async def create_reserve_book_by_isbn(isbn: str, session: Session = Depends(connection.get_db)): # FIX: Renamed function
    db_book = await create_book_from_external_reserve(session, isbn) 
    
    return db_book

# 自動登録(家)
@router.post("/external/store/{isbn}", response_model=books.Book)
async def create_store_book_by_isbn(isbn: str, session: Session = Depends(connection.get_db)): # FIX: Renamed function
    db_book = await create_book_from_external_store(session, isbn) 
    return db_book

# すべての書籍取得
@router.get("/", response_model=List[books.Book])
def read_books(skip: int = 0, limit: int = 100, session: Session = Depends(connection.get_db)):
    books = session.query(book_model.Books).offset(skip).limit(limit).all()
    return books

# 登録本更新順
@router.get("/reserve", response_model=List[books.Book])
def read_books_reserve(skip: int = 0, limit: int = 100, session: Session = Depends(connection.get_db)):
    status_reserve_books = session.query(book_model.Books).filter(book_model.Books.status == books.BookStatus.RESERVE.value).order_by(book_model.Books.status_reserve_at).offset(skip).limit(limit).all()
    return status_reserve_books

# 読了本更新順
@router.get("/read", response_model=List[books.Book])
def read_books_read(skip: int = 0, limit: int = 100, session: Session = Depends(connection.get_db)):
    status_read_books = session.query(book_model.Books).filter(book_model.Books.status == books.BookStatus.READ.value).order_by(book_model.Books.status_read_at).offset(skip).limit(limit).all()
    return status_read_books

# 積読本更新順
@router.get("/store", response_model=List[books.Book])
def read_books_store(skip: int = 0, limit: int = 100, session: Session = Depends(connection.get_db)):
    status_store_books = session.query(book_model.Books).filter(book_model.Books.status == books.BookStatus.STORE.value).order_by(book_model.Books.status_store_at).offset(skip).limit(limit).all()
    return status_store_books


# 特定の書籍取得
@router.get("/{book_id}", response_model=books.Book)
def read_book(book_id: int, session: Session = Depends(connection.get_db)):
    book = session.query(books.Book).filter(book_model.Books.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book


# 金額を更新 
@router.patch("/{book_id}/cost", response_model=books.Book)
def update_book_detail_cost(book_id: int, cost_update: books.BookCostUpdate, session: Session = Depends(connection.get_db)):
    updated_book = session.query(book_model.Books).filter(book_model.Books.id == book_id).first()
    if updated_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    updated_book.cost = cost_update.cost
    updated_book.last_modified = datetime.now(timezone.utc)
    session.commit()
    session.refresh(updated_book)
    return updated_book

# ステータスを更新 
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