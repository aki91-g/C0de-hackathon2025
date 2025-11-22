# api/routers/initialize.py データベースの初期化

from database.models import book_model
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlalchemy.orm import Session
from database import connection
from app.services import external_api_service, initialize_service

router = APIRouter()

TEST_ISBNs = [
    '9784806131564', '9784522434970', '9784862760852', '9784480065353', '9784822259754', '9784478109502', '9784877838', '4000077147', '9784567244091', '9784807909087', '9784807908912', '9784860645137', '9784762016530', '9784492047040', '9784309231327', '9784480097101', '9784121021847', '9784309246215', '9784130821353', '9784480096609', '9784480097088', '9784774196053', '9784532324582', '9784866802060', '9784761276157', '9784620317885', '9784842703503', '9784815810498', '9784860646653', '9784785310943', '9784130626224', '4563021393', '9784254131321', '9784621304228', '4781910629', '9784864810401', '9784583024321', '9784065162620', '9784785324100', '9784563005719', '9784785320881', '9784785315245', '9784785315153', '9784010377277', '9784627082816', '9784774196121', '9784489021688', '4000077481', '9784320030220', '9784797377026', '9784798174655', '9784295013617', '9784297136499', '9784779511226', '9784065319017', '9784842703367', '9784065303757', '9784314008549', '9784812210703', '4254130872', '4000077953', '4774112399', '4478490279', '9784807906895', '9784563011178', '9784595139727', '9784622086871', '4000076477', '4822244466', '9784480843203', '9784344931909', '4900790052', '4121006240', '9784532358624', '9784295403746', '9784766423525', '9784297131289', '0784022502629', '9784908345005', '9784909237903', '9784774503912', '4320015681', '4876986290', '9784422400679', '9784899775270', '9784798156545', '9784834340150', '9784804046839', '9784906033423', '9784396613587', '9784396613617', '9784396613662', '9784396613785', '9784396613853', '9784396613952', '9784396614119', '9784396614225', '9784396614423', '9784396614577', '9784062576727'
]

# TEST_ISBNs = [
#     "9780804139023", # The Martian
#     "9780062316097", # Sapiens
#     "9780061120084", # To Kill a Mockingbird
#     "9781250005574", # The Girl with the Dragon Tattoo
#     "9780399592839", # Educated
#     "9780735219106", # Where the Crawdads Sing
#     "9780451524935", # 1984
#     "9780743273565", # The Great Gatsby
#     "9780590353427", # Harry Potter
#     "9780307588373", # Gone Girl
#     "9781524763138", # Becoming
#     "9780441172719", # Dune
#     "9780307387891", # The Road
#     "9780553103540", # A Game of Thrones
#     "9780062315007", # The Alchemist
#     "9780312577223", # The Nightingale
#     "9780756404741", # The Name of the Wind
#     "9780140283034", # The Joy Luck Club
#     "9780345339683", # The Hobbit
#     "9780735211292"  # Atomic Habits
# ]


@router.post(
    "/", 
    summary="Drop, Recreate Tables, and Populate with Test Data",
    description="**WARNING:** This action permanently deletes all existing data. Requires 'confirm=True' query parameter.",
    response_model=dict
)
async def initialize_database(
    db_engine: any = Depends(connection.get_engine),
    db_session: Session = Depends(connection.get_db)
):
    try:
        book_model.Base.metadata.drop_all(bind=db_engine)
        book_model.Base.metadata.create_all(bind=db_engine)
        
        inserted_count = 0
        failed_isbns = []
        
        for isbn in TEST_ISBNs:
            book_info = await external_api_service.get_book_info(isbn)
            
            if book_info:
                initialize_service.create_book(db_session, book_info)
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