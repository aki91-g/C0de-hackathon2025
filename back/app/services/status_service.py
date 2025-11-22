# app/services/status_service.py

from sqlalchemy.orm import Session
from sqlalchemy import func, Date
from typing import List, Dict, Any
from datetime import datetime, timedelta, timezone
from app.schemas.books import BookStatus
from database.models.book_model import Books

def get_daily_read_counts(db: Session, days: int) -> List[Dict[str, Any]]:
    """
    Returns # of books that were transitioned from 'store' -> 'read'.
    """
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days - 1)

    query = db.query(
        Books.status_read_at.cast(Date).label("date"),
        func.count(Books.id).label("value")
    ).filter(
        Books.status_read_at.isnot(None),
        Books.status_read_at >= start_date,
        Books.status_read_at < end_date + timedelta(days=1),

        Books.status_store_at.isnot(None) 
        
    ).group_by(
        Books.status_read_at.cast(Date)
    ).order_by(
        Books.status_read_at.cast(Date)
    )
    results = query.all()

    date_map = {r.date.strftime('%m/%d'): r.value for r in results}
    output = []
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime('%m/%d')
        output.append({
            "date": date_str,
            "value": date_map.get(date_str, 0)
        })
        current_date += timedelta(days=1)
            
    return output


def get_daily_store_counts(db: Session, days: int) -> List[Dict[str, Any]]:
    """
    Returns the daily count of books that were marked 'store' on a specific date.
    This includes books coming from 'reserve' or set to 'store' upon creation.
    """
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days - 1)

    query = db.query(
        Books.status_store_at.cast(Date).label("date"),
        func.count(Books.id).label("value")
    ).filter(
        # Filters for the moment a book was marked 'store'
        Books.status_store_at.isnot(None),
        Books.status_store_at >= start_date,
        Books.status_store_at < end_date + timedelta(days=1)
    ).group_by(
        Books.status_store_at.cast(Date)
    ).order_by(
        Books.status_store_at.cast(Date)
    )

    results = query.all()

    date_map = {r.date.strftime('%m/%d'): r.value for r in results}
    output = []
    current_date = start_date
    while current_date <= end_date:
        date_str = current_date.strftime('%m/%d')
        output.append({
            "date": date_str,
            "value": date_map.get(date_str, 0)
        })
        current_date += timedelta(days=1)
        
    return output

def get_daily_store_acumulative_counts(db: Session, days: int) -> List[Dict[str, Any]]:
    """
    Returns the cumulative count of books currently in the 'store' status 
    for each day over the specified period.
    (INFLOW: status_store_at, OUTFLOW: status_read_at for books with status_store_at set)
    """
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days - 1)
    
    added_query = db.query(
        Books.status_store_at.cast(Date).label("date"),
        func.count(Books.id).label("count")
    ).filter(
        Books.status_store_at >= start_date,
        Books.status_store_at < end_date + timedelta(days=1)
    ).group_by(
        Books.status_store_at.cast(Date)
    )
    added_events = {r.date: r.count for r in added_query.all()}

    read_query = db.query(
        Books.status_read_at.cast(Date).label("date"),
        func.count(Books.id).label("count")
    ).filter(
        Books.status_read_at.isnot(None),
        Books.status_read_at >= start_date,
        Books.status_read_at < end_date + timedelta(days=1),
        Books.status_store_at.isnot(None) 
    ).group_by(
        Books.status_read_at.cast(Date)
    )
    read_events = {r.date: r.count for r in read_query.all()}

    initial_added_count = db.query(func.count(Books.id)).filter(
        Books.status_store_at < start_date
    ).scalar() or 0
    
    initial_removed_count = db.query(func.count(Books.id)).filter(
        Books.status_read_at.isnot(None),
        Books.status_store_at.isnot(None),
        Books.status_read_at < start_date
    ).scalar() or 0
    
    initial_store_count = initial_added_count - initial_removed_count
    
    output = []
    current_store_count = initial_store_count
    current_date = start_date

    while current_date <= end_date:
        added_on_day = added_events.get(current_date, 0)
        read_on_day = read_events.get(current_date, 0)

        current_store_count = current_store_count + added_on_day - read_on_day
        
        output.append({
            "date": current_date.strftime('%m/%d'),
            "value": current_store_count
        })
        current_date += timedelta(days=1)
            
    return output