from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class AllocationBase(BaseModel):
    employee_id: str
    project_id: str
    allocation_pct: float = Field(ge=0)
    role_on_project: str | None = None
    status: str = "Active"
    notes: str | None = None


class AllocationCreate(AllocationBase):
    pass


class AllocationUpdate(BaseModel):
    employee_id: str | None = None
    project_id: str | None = None
    allocation_pct: float | None = Field(default=None, ge=0)
    role_on_project: str | None = None
    status: str | None = None
    notes: str | None = None


class AllocationRead(AllocationBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime
    updated_at: datetime
    employee_name: str | None = None
    project_name: str | None = None
