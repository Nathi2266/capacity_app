from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models import Allocation, Employee, Project, User
from ..schemas.allocation import AllocationCreate, AllocationRead, AllocationUpdate

router = APIRouter()


def _serialize_allocation(allocation: Allocation) -> AllocationRead:
    return AllocationRead(
        id=allocation.id,
        employee_id=allocation.employee_id,
        project_id=allocation.project_id,
        allocation_pct=allocation.allocation_pct,
        role_on_project=allocation.role_on_project,
        status=allocation.status,
        notes=allocation.notes,
        created_at=allocation.created_at,
        updated_at=allocation.updated_at,
        employee_name=allocation.employee.full_name if allocation.employee else None,
        project_name=allocation.project.name if allocation.project else None,
    )


@router.get("", response_model=list[AllocationRead])
def list_allocations(
    status_filter: str | None = Query(default=None, alias="status"),
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    query = select(Allocation).order_by(Allocation.created_at.desc())
    if status_filter:
        query = query.where(Allocation.status == status_filter)
    allocations = db.scalars(query).all()
    return [_serialize_allocation(allocation) for allocation in allocations]


@router.get("/{allocation_id}", response_model=AllocationRead)
def get_allocation(allocation_id: str, db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    allocation = db.get(Allocation, allocation_id)
    if not allocation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Allocation not found")
    return _serialize_allocation(allocation)


@router.post("", response_model=AllocationRead, status_code=status.HTTP_201_CREATED)
def create_allocation(payload: AllocationCreate, db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    employee = db.get(Employee, payload.employee_id)
    project = db.get(Project, payload.project_id)
    if not employee or not project:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid employee or project")
    allocation = Allocation(**payload.model_dump())
    db.add(allocation)
    db.commit()
    db.refresh(allocation)
    return _serialize_allocation(allocation)


@router.put("/{allocation_id}", response_model=AllocationRead)
def update_allocation(allocation_id: str, payload: AllocationUpdate, db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    allocation = db.get(Allocation, allocation_id)
    if not allocation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Allocation not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(allocation, key, value)
    db.add(allocation)
    db.commit()
    db.refresh(allocation)
    return _serialize_allocation(allocation)


@router.delete("/{allocation_id}")
def delete_allocation(allocation_id: str, db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    allocation = db.get(Allocation, allocation_id)
    if not allocation:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Allocation not found")
    db.delete(allocation)
    db.commit()
    return {"ok": True}
