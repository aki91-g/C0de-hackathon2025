# api/routers/status.py

from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from back.app.schemas.books import BookStatus
from back.database import connection
from back.database.models.book_model import Books
from back.app.services.status_service import get_daily_read_counts, get_daily_reserve_cumulative_counts

router = APIRouter()

# 積読数
@router.get("/count/reserve", response_model=int)
def count_reserve(session: Session = Depends(connection.get_db)):
    reserved = session.query(Books).filter(Books.status == BookStatus.RESERVE.value).count()
    return reserved

# 読了数
@router.get("/count/read", response_model=int)
def count_read(session: Session = Depends(connection.get_db)):
    read = session.query(Books).filter(Books.status == BookStatus.READ.value).count()
    return read

# 在庫数
@router.get("/count/store", response_model=int)
def count_read(session: Session = Depends(connection.get_db)):
    store = session.query(Books).filter(Books.status == BookStatus.STORE.value).count()
    return store

# ある日の時点での読了数
@router.get("/graph/ondate_read/{days}", response_model=List[Dict[str, Any]])
async def get_books_daily_summary(days: int, db: Session = Depends(connection.get_db)):
    if days <= 0 or days > 365:
        raise HTTPException(status_code=400, detail="Days parameter must be between 1 and 365.")
    try:
        read_counts = get_daily_read_counts(db, days)
        return read_counts

    except Exception as e:
        print(f"Error fetching daily summary: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ある日の時点での積読数
@router.get("/graph/accumulative_reserve/{days}", response_model=List[Dict[str, Any]])
async def get_books_daily_summary(days: int, db: Session = Depends(connection.get_db)):
    if days <= 0 or days > 365:
        raise HTTPException(status_code=400, detail="Days parameter must be between 1 and 365.")
    try:
        reserve_counts = get_daily_reserve_cumulative_counts(db, days)
        return reserve_counts
    except Exception as e:
        print(f"Error fetching daily summary: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")