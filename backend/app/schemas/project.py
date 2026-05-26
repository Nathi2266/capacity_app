from datetime import date, datetime
from pydantic import BaseModel, ConfigDict, Field


class ProjectBase(BaseModel):
    name: str
    client_name: str | None = None
    project_manager: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    status: str = "Planning"
    budget: float = 0
    priority: str = "Medium"
    required_skills: list[str] = Field(default_factory=list)
    capacity_demand_pct: float = 0
    delivery_phase: str = "Discovery"
    description: str | None = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = None
    client_name: str | None = None
    project_manager: str | None = None
    start_date: date | None = None
    end_date: date | None = None
    status: str | None = None
    budget: float | None = None
    priority: str | None = None
    required_skills: list[str] | None = None
    capacity_demand_pct: float | None = None
    delivery_phase: str | None = None
    description: str | None = None


class ProjectRead(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime
    updated_at: datetime
