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

from api.routers import external_api, crud, initialize, status

app = FastAPI(title="C0de Hackathon Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

### app/api/endpoints/external_api.py - 書籍情報APIのエンドポイント
app.include_router(external_api.router, prefix="/external/bookinfo", tags=["external apis"])

### app/api/endpoints/books.py - 登録書籍CRUDエンドポイント
app.include_router(crud.router, prefix="/books", tags=["books"])

### app/endpoints/initialize.py データベースの初期化エンドポイント
app.include_router(initialize.router, prefix="/initialize", tags=["initialize"])

### app/endpoints/initialize.py ステータスカウント取得エンドポイント
app.include_router(status.router, prefix="/status/count", tags=["status count"])

@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


def main() -> None:
    port = int(os.environ.get("BACKEND_PORT", "8000"))
    uvicorn.run(app, host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()
