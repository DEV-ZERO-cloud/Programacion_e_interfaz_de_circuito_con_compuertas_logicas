from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database import Base


class UserRole(str, enum.Enum):
    user = "user"
    supervisor = "supervisor"
    operator = "operator"


class PQRType(str, enum.Enum):
    peticion = "peticion"
    queja = "queja"
    reclamo = "reclamo"


class PQRStatus(str, enum.Enum):
    pendiente = "pendiente"
    en_proceso = "en_proceso"
    resuelto = "resuelto"
    cerrado = "cerrado"


class PQRPriority(str, enum.Enum):
    baja = "baja"
    media = "media"
    alta = "alta"
    critica = "critica"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.user, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    pqrs_created = relationship("PQR", foreign_keys="PQR.created_by_id", back_populates="created_by")
    pqrs_assigned = relationship("PQR", foreign_keys="PQR.assigned_to_id", back_populates="assigned_to")


class PQR(Base):
    __tablename__ = "pqrs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    pqr_type = Column(SAEnum(PQRType), nullable=False)
    status = Column(SAEnum(PQRStatus), default=PQRStatus.pendiente, nullable=False)
    priority = Column(SAEnum(PQRPriority), default=PQRPriority.media, nullable=False)
    category = Column(String(100), nullable=True)
    created_by_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    assigned_to_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    created_by = relationship("User", foreign_keys=[created_by_id], back_populates="pqrs_created")
    assigned_to = relationship("User", foreign_keys=[assigned_to_id], back_populates="pqrs_assigned")
    comments = relationship("PQRComment", back_populates="pqr", cascade="all, delete-orphan")


class PQRComment(Base):
    __tablename__ = "pqr_comments"

    id = Column(Integer, primary_key=True, index=True)
    pqr_id = Column(Integer, ForeignKey("pqrs.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    pqr = relationship("PQR", back_populates="comments")
    user = relationship("User")
