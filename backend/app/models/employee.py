from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Column, DateTime, Float, Integer, JSON, String
from sqlalchemy.orm import relationship

from ..database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Employee(Base):
    __tablename__ = "employees"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    full_name = Column(String(255), nullable=False, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(50), nullable=True)
    employee_id = Column(String(100), unique=True, index=True, nullable=True)
    department = Column(String(120), nullable=False, index=True)
    role = Column(String(80), nullable=False, default="Employee")
    seniority = Column(String(50), nullable=False, default="Mid")
    skills = Column(JSON, nullable=False, default=list)
    years_experience = Column(Integer, nullable=False, default=0)
    availability_pct = Column(Float, nullable=False, default=100)
    employment_type = Column(String(50), nullable=False, default="Full-time")
    location = Column(String(120), nullable=True)
    status = Column(String(40), nullable=False, default="Active", index=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)

    allocations = relationship("Allocation", back_populates="employee", cascade="all, delete-orphan")
