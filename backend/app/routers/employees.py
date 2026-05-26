from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from ..database import get_db
from ..dependencies import get_current_user
from ..models import Employee, User
from ..schemas.employee import EmployeeCreate, EmployeeRead, EmployeeUpdate

router = APIRouter()


@router.get("", response_model=list[EmployeeRead])
def list_employees(
    department: str | None = None,
    status_filter: str | None = Query(default=None, alias="status"),
    search: str | None = None,
    db: Session = Depends(get_db),
    _current_user: User = Depends(get_current_user),
):
    query = select(Employee)
    if department and department != "All":
        query = query.where(Employee.department == department)
    if status_filter:
        query = query.where(Employee.status == status_filter)
    if search:
        like = f"%{search}%"
        query = query.where(
            or_(
                Employee.full_name.ilike(like),
                Employee.email.ilike(like),
                Employee.department.ilike(like),
            )
        )
    return list(db.scalars(query.order_by(Employee.full_name)).all())


@router.get("/{employee_id}", response_model=EmployeeRead)
def get_employee(employee_id: str, db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    return employee


@router.post("", response_model=EmployeeRead, status_code=status.HTTP_201_CREATED)
def create_employee(payload: EmployeeCreate, db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    employee = Employee(**payload.model_dump())
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.put("/{employee_id}", response_model=EmployeeRead)
def update_employee(employee_id: str, payload: EmployeeUpdate, db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(employee, key, value)
    db.add(employee)
    db.commit()
    db.refresh(employee)
    return employee


@router.delete("/{employee_id}")
def delete_employee(employee_id: str, db: Session = Depends(get_db), _current_user: User = Depends(get_current_user)):
    employee = db.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    db.delete(employee)
    db.commit()
    return {"ok": True}
