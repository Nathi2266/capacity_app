from datetime import date, datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class SkillItem(BaseModel):
    name: str
    proficiency: str


class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str | None = None
    employee_id: str | None = None
    department: str
    role: str = "Employee"
    seniority: str = "Mid"
    skills: list[SkillItem] = Field(default_factory=list)
    years_experience: int = 0
    availability_pct: float = 100
    employment_type: str = "Full-time"
    location: str | None = None
    status: str = "Active"


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    full_name: str | None = None
    email: EmailStr | None = None
    phone: str | None = None
    employee_id: str | None = None
    department: str | None = None
    role: str | None = None
    seniority: str | None = None
    skills: list[SkillItem] | None = None
    years_experience: int | None = None
    availability_pct: float | None = None
    employment_type: str | None = None
    location: str | None = None
    status: str | None = None


class EmployeeRead(EmployeeBase):
    model_config = ConfigDict(from_attributes=True)
    id: str
    created_at: datetime
    updated_at: datetime
