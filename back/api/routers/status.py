# api/routers/status.py

from back.app.schemas.books import BookStatus
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from back.database import connection
from back.database.models.book_model import Books # Direct import of the model class


router = APIRouter()

# 積読数
@router.get("/reserve", response_model=int)
def count_reserve(session: Session = Depends(connection.get_db)):
    reserved = session.query(Books).filter(Books.status == BookStatus.RESERVE.value).count()
    return reserved

# 読了数
@router.get("/read", response_model=int)
def count_read(session: Session = Depends(connection.get_db)):
    read = session.query(Books).filter(Books.status == BookStatus.READ.value).count()
    return read

# 在庫数
@router.get("/store", response_model=int)
def count_read(session: Session = Depends(connection.get_db)):
    store = session.query(Books).filter(Books.status == BookStatus.STORE.value).count()
    return store