from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import get_db
from sqlalchemy import text

router = APIRouter()


@router.get("/health")
def health(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"status": "ok"}
