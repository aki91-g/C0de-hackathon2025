# api/endpoints/initialize.py データベースの初期化

from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from back.models import db
from back.app.services import db_service, external_api_service

router = APIRouter()

TEST_ISBNs = [
    "9780804139023", # The Martian
    "9780062316097", # Sapiens
    "9780061120084", # To Kill a Mockingbird
    "9781250005574", # The Girl with the Dragon Tattoo
    "9780399592839", # Educated
    "9780735219106", # Where the Crawdads Sing
    "9780451524935", # 1984
    "9780743273565", # The Great Gatsby
    "9780590353427", # Harry Potter
    "9780307588373", # Gone Girl
    "9781524763138", # Becoming
    "9780441172719", # Dune
    "9780307387891", # The Road
    "9780553103540", # A Game of Thrones
    "9780062315007", # The Alchemist
    "9780312577223", # The Nightingale
    "9780756404741", # The Name of the Wind
    "9780140283034", # The Joy Luck Club
    "9780345339683", # The Hobbit
    "9780735211292"  # Atomic Habits
]


@router.post(
    "/", 
    summary="Drop, Recreate Tables, and Populate with Test Data",
    description="**WARNING:** This action permanently deletes all existing data. Requires 'confirm=True' query parameter.",
    response_model=dict
)
async def initialize_database(
    confirm: bool = Query(..., description="Set to **True** to proceed."),
    db_engine: any = Depends(db_service.get_engine),
    db_session: Session = Depends(db_service.get_db) # New dependency for inserting data
):
    if not confirm:
        raise HTTPException(
            status_code=400,
            detail="Initialization not confirmed. Set 'confirm' to True."
        )

    try:
        db.Base.metadata.drop_all(bind=db_engine)
        db.Base.metadata.create_all(bind=db_engine)
        
        inserted_count = 0
        failed_isbns = []
        
        for isbn in TEST_ISBNs:
            book_info = await external_api_service.get_book_info(isbn)
            
            if book_info:
                db_service.create_book(db_session, book_info)
                inserted_count += 1
            else:
                failed_isbns.append(isbn)
                
        status_message = (
            f"Database successfully initialized. "
            f"{inserted_count} books inserted from external API. "
            f"{len(failed_isbns)} books failed to load."
        )

        return {"message": status_message, "status": "success", "failed_isbns": failed_isbns}

    except Exception as e:
        db_session.rollback() # Rollback if an error occurs during insertion
        raise HTTPException(
            status_code=500,
            detail=f"Database initialization failed: {str(e)}"
        )