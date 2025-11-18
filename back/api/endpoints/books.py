# api/endpoints/books.py

from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List
from sqlalchemy.orm import Session
from back.app.services import db_service
from back.models import db, schema

router = APIRouter()

# 登録
@router.post("/", response_model=schema.Book)
def create_book(book: schema.BookCreate, session: Session = Depends(db_service.get_db)):
    db_book = db.Books(**book.model_dump())
    session.add(db_book)
    session.commit()
    session.refresh(db_book)
    return db_book

# すべての書籍取得
@router.get("/", response_model=List[schema.Book])
def read_books(skip: int = 0, limit: int = 100, session: Session = Depends(db_service.get_db)):
    books = session.query(db.Books).offset(skip).limit(limit).all()
    return books

# 特定の書籍取得
@router.get("/{book_id}", response_model=schema.Book)
def read_book(book_id: int, session: Session = Depends(db_service.get_db)):
    book = session.query(db.Books).filter(db.Books.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

# 更新
@router.put("/{book_id}", response_model=schema.Book)
def update_book(book_id: int, book: schema.BookUpdate, session: Session = Depends(db_service.get_db)):
    updated_book = db_service.update_book_details(session, book_id, book) 
    if updated_book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated_book

# 削除
@router.delete("/{book_id}", response_model=schema.Book)
def delete_book(book_id: int, session: Session = Depends(db_service.get_db)):
    book = session.query(db.Books).filter(db.Books.id == book_id).first()
    if book is None:
        raise HTTPException(status_code=404, detail="Book not found")
    session.delete(book)
    session.commit()
    return book