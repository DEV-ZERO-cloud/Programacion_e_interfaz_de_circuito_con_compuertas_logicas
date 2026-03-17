from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List, Optional

import models
import schemas
import auth
from database import engine, get_db, Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Sistema de PQR",
    description="API para gestión de Peticiones, Quejas y Reclamos",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────────────────────────────────────────
# Seed default users on startup
# ─────────────────────────────────────────────────────────────────────────────

def seed_users(db: Session):
    defaults = [
        {
            "full_name": "Administrador Operador",
            "email": "operador@pqr.com",
            "password": "operador123",
            "role": models.UserRole.operator,
        },
        {
            "full_name": "Supervisor Principal",
            "email": "supervisor@pqr.com",
            "password": "supervisor123",
            "role": models.UserRole.supervisor,
        },
        {
            "full_name": "Usuario Demo",
            "email": "usuario@pqr.com",
            "password": "usuario123",
            "role": models.UserRole.user,
        },
    ]
    for data in defaults:
        if not db.query(models.User).filter(models.User.email == data["email"]).first():
            db.add(models.User(
                full_name=data["full_name"],
                email=data["email"],
                hashed_password=auth.get_password_hash(data["password"]),
                role=data["role"],
            ))
    db.commit()


@app.on_event("startup")
def on_startup():
    db = next(get_db())
    seed_users(db)


# ─────────────────────────────────────────────────────────────────────────────
# Auth Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/auth/token", response_model=schemas.Token, tags=["Auth"])
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = auth.authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = auth.create_access_token(
        data={"sub": user.email},
        expires_delta=timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": token, "token_type": "bearer", "user": user}


@app.post("/api/auth/register", response_model=schemas.UserOut, tags=["Auth"])
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == user_data.email).first():
        raise HTTPException(status_code=400, detail="El email ya está registrado")
    user = models.User(
        full_name=user_data.full_name,
        email=user_data.email,
        hashed_password=auth.get_password_hash(user_data.password),
        role=user_data.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.get("/api/auth/me", response_model=schemas.UserOut, tags=["Auth"])
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user


# ─────────────────────────────────────────────────────────────────────────────
# User Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/api/users", response_model=List[schemas.UserOut], tags=["Users"])
def list_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role(
        models.UserRole.operator, models.UserRole.supervisor
    ))
):
    return db.query(models.User).all()


@app.get("/api/users/supervisors", response_model=List[schemas.UserOut], tags=["Users"])
def list_supervisors(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role(models.UserRole.operator))
):
    return db.query(models.User).filter(models.User.role == models.UserRole.supervisor).all()


# ─────────────────────────────────────────────────────────────────────────────
# PQR Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/pqrs", response_model=schemas.PQROut, tags=["PQRs"])
def create_pqr(
    pqr_data: schemas.PQRCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    pqr = models.PQR(
        **pqr_data.model_dump(),
        created_by_id=current_user.id,
    )
    db.add(pqr)
    db.commit()
    db.refresh(pqr)
    return pqr


@app.get("/api/pqrs", response_model=List[schemas.PQRListOut], tags=["PQRs"])
def list_pqrs(
    status: Optional[str] = None,
    pqr_type: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.PQR)

    # Role-based filtering
    if current_user.role == models.UserRole.user:
        query = query.filter(models.PQR.created_by_id == current_user.id)
    elif current_user.role == models.UserRole.supervisor:
        query = query.filter(models.PQR.assigned_to_id == current_user.id)
    # Operators see all

    if status:
        query = query.filter(models.PQR.status == status)
    if pqr_type:
        query = query.filter(models.PQR.pqr_type == pqr_type)
    if priority:
        query = query.filter(models.PQR.priority == priority)

    return query.order_by(models.PQR.created_at.desc()).all()


@app.get("/api/pqrs/stats", response_model=schemas.PQRStats, tags=["PQRs"])
def get_stats(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.PQR)
    if current_user.role == models.UserRole.user:
        query = query.filter(models.PQR.created_by_id == current_user.id)
    elif current_user.role == models.UserRole.supervisor:
        query = query.filter(models.PQR.assigned_to_id == current_user.id)

    all_pqrs = query.all()
    return {
        "total": len(all_pqrs),
        "pendiente": sum(1 for p in all_pqrs if p.status == models.PQRStatus.pendiente),
        "en_proceso": sum(1 for p in all_pqrs if p.status == models.PQRStatus.en_proceso),
        "resuelto": sum(1 for p in all_pqrs if p.status == models.PQRStatus.resuelto),
        "cerrado": sum(1 for p in all_pqrs if p.status == models.PQRStatus.cerrado),
        "por_tipo": {
            "peticion": sum(1 for p in all_pqrs if p.pqr_type == models.PQRType.peticion),
            "queja": sum(1 for p in all_pqrs if p.pqr_type == models.PQRType.queja),
            "reclamo": sum(1 for p in all_pqrs if p.pqr_type == models.PQRType.reclamo),
        }
    }


@app.get("/api/pqrs/{pqr_id}", response_model=schemas.PQROut, tags=["PQRs"])
def get_pqr(
    pqr_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    pqr = db.query(models.PQR).filter(models.PQR.id == pqr_id).first()
    if not pqr:
        raise HTTPException(status_code=404, detail="PQR no encontrada")

    # Authorization check
    if current_user.role == models.UserRole.user and pqr.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso a esta PQR")
    if current_user.role == models.UserRole.supervisor and pqr.assigned_to_id != current_user.id:
        raise HTTPException(status_code=403, detail="Esta PQR no está asignada a usted")

    return pqr


@app.patch("/api/pqrs/{pqr_id}", response_model=schemas.PQROut, tags=["PQRs"])
def update_pqr(
    pqr_id: int,
    pqr_update: schemas.PQRUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    pqr = db.query(models.PQR).filter(models.PQR.id == pqr_id).first()
    if not pqr:
        raise HTTPException(status_code=404, detail="PQR no encontrada")

    # Role-based permissions
    if current_user.role == models.UserRole.user:
        if pqr.created_by_id != current_user.id:
            raise HTTPException(status_code=403, detail="Sin acceso")
        # Users can only update title/description if still pending
        if pqr.status != models.PQRStatus.pendiente:
            raise HTTPException(status_code=400, detail="Solo se puede editar PQRs en estado pendiente")
        allowed_fields = {"title", "description"}
        update_data = {k: v for k, v in pqr_update.model_dump(exclude_none=True).items() if k in allowed_fields}
    elif current_user.role == models.UserRole.supervisor:
        if pqr.assigned_to_id != current_user.id:
            raise HTTPException(status_code=403, detail="Esta PQR no está asignada a usted")
        allowed_fields = {"status", "resolution_notes", "priority"}
        update_data = {k: v for k, v in pqr_update.model_dump(exclude_none=True).items() if k in allowed_fields}
    else:
        # Operator can update all fields
        update_data = pqr_update.model_dump(exclude_none=True)

    for field, value in update_data.items():
        setattr(pqr, field, value)

    db.commit()
    db.refresh(pqr)
    return pqr


@app.delete("/api/pqrs/{pqr_id}", tags=["PQRs"])
def delete_pqr(
    pqr_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.require_role(models.UserRole.operator))
):
    pqr = db.query(models.PQR).filter(models.PQR.id == pqr_id).first()
    if not pqr:
        raise HTTPException(status_code=404, detail="PQR no encontrada")
    db.delete(pqr)
    db.commit()
    return {"message": "PQR eliminada correctamente"}


# ─────────────────────────────────────────────────────────────────────────────
# Comment Routes
# ─────────────────────────────────────────────────────────────────────────────

@app.post("/api/pqrs/{pqr_id}/comments", response_model=schemas.CommentOut, tags=["Comments"])
def add_comment(
    pqr_id: int,
    comment_data: schemas.CommentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    pqr = db.query(models.PQR).filter(models.PQR.id == pqr_id).first()
    if not pqr:
        raise HTTPException(status_code=404, detail="PQR no encontrada")

    # Access check
    if current_user.role == models.UserRole.user and pqr.created_by_id != current_user.id:
        raise HTTPException(status_code=403, detail="Sin acceso")
    if current_user.role == models.UserRole.supervisor and pqr.assigned_to_id != current_user.id:
        raise HTTPException(status_code=403, detail="Esta PQR no está asignada a usted")

    comment = models.PQRComment(
        pqr_id=pqr_id,
        user_id=current_user.id,
        content=comment_data.content,
    )
    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
