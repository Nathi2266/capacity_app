from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Column, Date, DateTime, Float, JSON, String, Text
from sqlalchemy.orm import relationship

from ..database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    name = Column(String(255), nullable=False, index=True)
    client_name = Column(String(255), nullable=True)
    project_manager = Column(String(255), nullable=True)
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    status = Column(String(50), nullable=False, default="Planning", index=True)
    budget = Column(Float, nullable=False, default=0)
    priority = Column(String(50), nullable=False, default="Medium", index=True)
    required_skills = Column(JSON, nullable=False, default=list)
    capacity_demand_pct = Column(Float, nullable=False, default=0)
    delivery_phase = Column(String(80), nullable=False, default="Discovery")
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)

    allocations = relationship("Allocation", back_populates="project", cascade="all, delete-orphan")
