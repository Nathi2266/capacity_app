"""FastAPI dependencies for authentication."""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError  # type: ignore[import-untyped]
from sqlalchemy.orm import Session

from .config import settings
from .database import get_db
from .models.user import User
from .security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(oauth2_scheme),
) -> User:
    """Return the authenticated user for the current bearer token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
        subject = payload.get("sub")
        token_type = payload.get("type")
        if not subject or token_type != "access":
            raise credentials_exception
        if subject == settings.demo_user_id:
            return User(
                id=settings.demo_user_id,
                email=settings.demo_user_email,
                full_name=settings.demo_user_full_name,
                password_hash="demo-password-hash",
                role=settings.demo_user_role,
                is_verified=True,
            )
    except JWTError as exc:
        raise credentials_exception from exc

    user = db.get(User, subject)
    if user is None:
        raise credentials_exception
    return user
