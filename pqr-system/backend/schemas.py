from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole, PQRType, PQRStatus, PQRPriority


# ─── Auth Schemas ────────────────────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str
    user: "UserOut"


class TokenData(BaseModel):
    email: Optional[str] = None


# ─── User Schemas ─────────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.user


class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    role: UserRole
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None


# ─── PQR Comment Schemas ──────────────────────────────────────────────────────

class CommentCreate(BaseModel):
    content: str


class CommentOut(BaseModel):
    id: int
    pqr_id: int
    user_id: int
    content: str
    created_at: Optional[datetime] = None
    user: Optional[UserOut] = None

    model_config = {"from_attributes": True}


# ─── PQR Schemas ─────────────────────────────────────────────────────────────

class PQRCreate(BaseModel):
    title: str
    description: str
    pqr_type: PQRType
    priority: PQRPriority = PQRPriority.media
    category: Optional[str] = None


class PQRUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[PQRStatus] = None
    priority: Optional[PQRPriority] = None
    category: Optional[str] = None
    assigned_to_id: Optional[int] = None
    resolution_notes: Optional[str] = None


class PQROut(BaseModel):
    id: int
    title: str
    description: str
    pqr_type: PQRType
    status: PQRStatus
    priority: PQRPriority
    category: Optional[str] = None
    created_by_id: int
    assigned_to_id: Optional[int] = None
    resolution_notes: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[UserOut] = None
    assigned_to: Optional[UserOut] = None
    comments: List[CommentOut] = []

    model_config = {"from_attributes": True}


class PQRListOut(BaseModel):
    id: int
    title: str
    pqr_type: PQRType
    status: PQRStatus
    priority: PQRPriority
    category: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    created_by: Optional[UserOut] = None
    assigned_to: Optional[UserOut] = None

    model_config = {"from_attributes": True}


# ─── Stats Schema ─────────────────────────────────────────────────────────────

class PQRStats(BaseModel):
    total: int
    pendiente: int
    en_proceso: int
    resuelto: int
    cerrado: int
    por_tipo: dict
