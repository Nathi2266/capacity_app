import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import SQLAlchemyError

from .config import settings
from .database import Base, engine
from .routers import (
    allocations,
    auth,
    employees,
    health,
    notifications,
    projects,
)

app = FastAPI(title="Capacity App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(
    employees.router,
    prefix="/api/employees",
    tags=["employees"],
)
app.include_router(projects.router, prefix="/api/projects", tags=["projects"])
app.include_router(
    allocations.router,
    prefix="/api/allocations",
    tags=["allocations"],
)
app.include_router(
    notifications.router,
    prefix="/api/notifications",
    tags=["notifications"],
)


logger = logging.getLogger(__name__)


@app.on_event("startup")
def on_startup() -> None:
    try:
        Base.metadata.create_all(bind=engine)
    except SQLAlchemyError:
        logger.exception(
            "Database is unavailable during startup; skipping schema "
            "creation so the API can still boot."
        )
