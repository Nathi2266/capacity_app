from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Column, DateTime, Float, ForeignKey, String, Text
from sqlalchemy.orm import relationship

from ..database import Base


def utcnow():
    return datetime.now(timezone.utc)


class Allocation(Base):
    __tablename__ = "allocations"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid4()))
    employee_id = Column(String(36), ForeignKey("employees.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id = Column(String(36), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False, index=True)
    allocation_pct = Column(Float, nullable=False, default=0)
    role_on_project = Column(String(120), nullable=True)
    status = Column(String(50), nullable=False, default="Active", index=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, default=utcnow)
    updated_at = Column(DateTime(timezone=True), nullable=False, default=utcnow, onupdate=utcnow)

    employee = relationship("Employee", back_populates="allocations")
    project = relationship("Project", back_populates="allocations")
