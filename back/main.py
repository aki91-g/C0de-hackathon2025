from __future__ import annotations
import os
import uvicorn
from typing import List
from datetime import datetime, timezone

from fastapi import FastAPI
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from api.endpoints import external_api, books

app = FastAPI(title="C0de Hackathon Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

### app/api/endpoints/external_api.py - 書籍情報APIのエンドポイント
app.include_router(external_api.router, prefix="/external/bookinfo", tags=["books"])

### app/api/endpoints/books.py - エンドポイント
app.include_router(books.router, prefix="/books", tags=["books"])



# @app.get("/api/health")
# def health() -> dict[str, str]:
#     return {"status": "ok"}


# @app.get("/api/greeting")
# def greeting(name: str | None = None) -> dict[str, str]:
#     base_message = "Hello from the backend"
#     if name:
#         base_message = f"{base_message}, {name}!"
#     else:
#         base_message = f"{base_message}!"

#     return {
#         "message": base_message,
#         "timestamp": datetime.now(tz=timezone.utc).isoformat(),
#     }


# class BookInfo(BaseModel):
#     isbn: str
#     title: str
#     author: str
#     publisher: str
#     published_year: int


# BOOK_CATALOG: dict[str, BookInfo] = {
#     "9784164110807": BookInfo(
#         isbn="978-4-16-411080-7",
#         title="コンビニ人間",
#         author="村田沙耶香",
#         publisher="文藝春秋",
#         published_year=2016,
#     ),
#     "9784101010260": BookInfo(
#         isbn="978-4-10-101026-0",
#         title="吾輩は猫である",
#         author="夏目漱石",
#         publisher="新潮文庫",
#         published_year=1905,
#     ),
#     "9784041026225": BookInfo(
#         isbn="978-4-04-102622-5",
#         title="夜は短し歩けよ乙女",
#         author="森見登美彦",
#         publisher="KADOKAWA",
#         published_year=2006,
#     ),
# }


# class BookSearchRequest(BaseModel):
#     isbn: str = Field(..., min_length=10, max_length=20, description="ハイフン含むISBN")


# class BookSearchResponse(BaseModel):
#     found: bool
#     message: str
#     book: BookInfo | None = None


# def _normalize_isbn(value: str) -> str:
#     return value.replace("-", "").strip()


# @app.post("/api/books/search", response_model=BookSearchResponse)
# def search_book(payload: BookSearchRequest) -> BookSearchResponse:
#     normalized_isbn = _normalize_isbn(payload.isbn)

#     if len(normalized_isbn) not in (10, 13) or not normalized_isbn.isdigit():
#         return BookSearchResponse(
#             found=False,
#             message="ISBNは10桁または13桁の数字で入力してください。",
#         )

#     book = BOOK_CATALOG.get(normalized_isbn)
#     if not book:
#         return BookSearchResponse(
#             found=False,
#             message="指定したISBNの本はカタログにありませんでした。",
#         )

#     return BookSearchResponse(
#         found=True,
#         message="書誌情報が見つかりました。",
#         book=book,
#     )


def main() -> None:
    port = int(os.environ.get("BACKEND_PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
