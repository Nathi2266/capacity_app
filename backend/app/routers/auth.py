from uuid import uuid4
from typing import cast

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..database import get_db
from ..config import settings
from ..dependencies import get_current_user
from ..models import User
from ..schemas.auth import (
    AuthResponse,
    ForgotPasswordRequest,
    LoginRequest,
    RegisterRequest,
    ResetPasswordRequest,
    UserRead,
)
from ..security import create_token, hash_password, verify_password

router = APIRouter()

_RESET_TOKENS: dict[str, str] = {}


def _demo_user_read() -> UserRead:
    return UserRead(
        id=settings.demo_user_id,
        email=settings.demo_user_email,
        full_name=settings.demo_user_full_name,
        role=settings.demo_user_role,
        is_verified=True,
    )


def _to_user_read(user: User) -> UserRead:
    return UserRead(
        id=cast(str, user.id),
        email=cast(str, user.email),
        full_name=cast(str, user.full_name),
        role=cast(str, user.role),
        is_verified=cast(bool, user.is_verified),
    )


def _token_response(user: User) -> AuthResponse:
    return AuthResponse(
        access_token=create_token(cast(str, user.id)),
        user=_to_user_read(user),
    )


@router.post("/register", response_model=AuthResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    if payload.email == settings.demo_user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This email is reserved for the demo account",
        )
    existing = db.scalar(select(User).where(User.email == payload.email))
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    user = User(
        id=str(uuid4()),
        email=payload.email,
        full_name=payload.full_name,
        password_hash=hash_password(payload.password),
        role=payload.role,
        is_verified=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return _token_response(user)


@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    if (
        payload.email == settings.demo_user_email
        and payload.password == settings.demo_user_password
    ):
        return AuthResponse(
            access_token=create_token(settings.demo_user_id),
            user=_demo_user_read(),
        )

    user = db.scalar(select(User).where(User.email == payload.email))
    if not user or not verify_password(
        payload.password,
        cast(str, user.password_hash),
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    return _token_response(user)


@router.get("/me", response_model=UserRead)
def me(current_user: User = Depends(get_current_user)):
    return _to_user_read(current_user)


@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.email == payload.email))
    if user:
        _RESET_TOKENS[cast(str, user.email)] = f"reset-{uuid4()}"
    return {"ok": True}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    email = next(
        (key for key, token in _RESET_TOKENS.items() if token == payload.token),
        None,
    )
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid reset token",
        )

    user = db.scalar(select(User).where(User.email == email))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    user.password_hash = hash_password(payload.new_password)
    db.add(user)
    db.commit()
    _RESET_TOKENS.pop(email, None)
    return {"ok": True}
