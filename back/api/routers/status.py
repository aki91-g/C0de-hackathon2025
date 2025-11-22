# api/routers/status.py

from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from sqlalchemy import func
from sqlalchemy.orm import Session
from app.schemas.books import BookStatus
from database import connection
from database.models.book_model import Books
from app.services.status_service import get_daily_read_counts, get_daily_store_counts, get_daily_store_acumulative_counts

router = APIRouter()

# 登録数
@router.get("/count/reserve", response_model=int)
def count_reserve(session: Session = Depends(connection.get_db)):
    reserved = session.query(Books).filter(Books.status == BookStatus.RESERVE.value).count()
    return reserved

# 読了数
@router.get("/count/read", response_model=int)
def count_read(session: Session = Depends(connection.get_db)):
    read = session.query(Books).filter(Books.status == BookStatus.READ.value).count()
    return read

# 積読数
@router.get("/count/store", response_model=int)
def count_read(session: Session = Depends(connection.get_db)):
    store = session.query(Books).filter(Books.status == BookStatus.STORE.value).count()
    return store

# 積読総額
@router.get("/sum/store", response_model=int)
def sum_store_cost(session: Session = Depends(connection.get_db)):
    query = session.query(func.sum(Books.cost)).filter(Books.status == BookStatus.STORE.value)
    total_cost = query.scalar() 
    return total_cost if total_cost is not None else 0

# ある日の読了数
@router.get("/graph/ondate_read/{days}", response_model=List[Dict[str, Any]])
async def get_ondate_read(days: int, db: Session = Depends(connection.get_db)):
    if days <= 0 or days > 365:
        raise HTTPException(status_code=400, detail="Days parameter must be between 1 and 365.")
    try:
        read_counts = get_daily_read_counts(db, days)
        return read_counts

    except Exception as e:
        print(f"Error fetching daily summary: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ある日の購入数
@router.get("/graph/ondate_store/{days}", response_model=List[Dict[str, Any]])
async def get_ondate_reserve(days: int, db: Session = Depends(connection.get_db)):
    if days <= 0 or days > 365:
        raise HTTPException(status_code=400, detail="Days parameter must be between 1 and 365.")
    try:
        read_counts = get_daily_store_counts(db, days)
        return read_counts

    except Exception as e:
        print(f"Error fetching daily summary: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# ある日の時点での積読数
@router.get("/graph/accumulative_store/{days}", response_model=List[Dict[str, Any]])
async def get_accumulative_store(days: int, db: Session = Depends(connection.get_db)):
    if days <= 0 or days > 365:
        raise HTTPException(status_code=400, detail="Days parameter must be between 1 and 365.")
    try:
        store_counts = get_daily_store_acumulative_counts(db, days)
        return store_counts
    except Exception as e:
        print(f"Error fetching daily store cumulative summary: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")