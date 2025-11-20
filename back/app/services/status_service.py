# app/services/status_service.py

from sqlalchemy.orm import Session
from sqlalchemy import func, Date
from typing import List, Dict, Any
from datetime import datetime, timedelta, timezone
from back.database.models.book_model import Books

def get_daily_read_counts(db: Session, days: int) -> List[Dict[str, Any]]:
    """
    returns # of books with status 'read' on a certain date
    """
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days - 1)

    query = db.query(
        Books.status_read_at.cast(Date).label("date"),
        func.count(Books.id).label("value")
    ).filter(
        Books.status_read_at.isnot(None),
        Books.status_read_at >= start_date,
        Books.status_read_at < end_date + timedelta(days=1)
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

def get_daily_reserve_cumulative_counts(db: Session, days: int) -> List[Dict[str, Any]]:
    """
    returns # of books with status 'reserve' on a certain date
    """
    end_date = datetime.now(timezone.utc).date()
    start_date = end_date - timedelta(days=days - 1)
    
    added_query = db.query(
        Books.created_at.cast(Date).label("date"),
        func.count(Books.id).label("count")
    ).filter(
        Books.created_at >= start_date,
        Books.created_at < end_date + timedelta(days=1)
    ).group_by(
        Books.created_at.cast(Date)
    )
    added_events = {r.date: r.count for r in added_query.all()}

    read_query = db.query(
        Books.status_read_at.cast(Date).label("date"),
        func.count(Books.id).label("count")
    ).filter(
        Books.status_read_at.isnot(None),
        Books.status_read_at >= start_date,
        Books.status_read_at < end_date + timedelta(days=1)
    ).group_by(
        Books.status_read_at.cast(Date)
    )
    read_events = {r.date: r.count for r in read_query.all()}

    initial_tbr_count = db.query(func.count(Books.id)).filter(
        Books.created_at < start_date,
        Books.status == "reserve",
        (Books.status_read_at.is_(None)) | (Books.status_read_at >= start_date)
    ).scalar() or 0
    
    output = []
    current_reserve_count = initial_tbr_count
    current_date = start_date

    while current_date <= end_date:
        added_on_day = added_events.get(current_date, 0)
        read_on_day = read_events.get(current_date, 0)

        current_reserve_count = current_reserve_count + added_on_day - read_on_day
        
        output.append({
            "date": current_date.strftime('%m/%d'),
            "value": current_reserve_count
        })
        current_date += timedelta(days=1)
        
    return output