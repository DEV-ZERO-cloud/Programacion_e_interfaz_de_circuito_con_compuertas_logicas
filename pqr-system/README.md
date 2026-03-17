# Sistema de Gestión de PQR

Sistema completo de gestión de **Peticiones, Quejas y Reclamos (PQR)** con frontend en React.js y backend en Python (FastAPI).

## 🎯 Características

### 3 Roles con Paneles Dedicados

| Rol | Capacidades |
|-----|-------------|
| **Usuario** | Crear PQRs, consultar estado, ver historial propio |
| **Supervisor** | Ver y gestionar PQRs asignadas, actualizar estados |
| **Operador** | Vista global de todas las PQRs, asignar supervisores, exportar CSV |

### Funcionalidades del Sistema
- ✅ Autenticación JWT con roles diferenciados
- ✅ Dashboard con estadísticas en tiempo real
- ✅ Filtros por estado, tipo y prioridad
- ✅ Sistema de comentarios en cada PQR
- ✅ Asignación de supervisores (operadores)
- ✅ Exportación a CSV
- ✅ Diseño responsive y visualmente amigable
- ✅ Cuentas de demostración precargadas

## 🎨 Paleta de Colores

| Rol | Color |
|-----|-------|
| Usuario | `#6366f1` (Índigo) |
| Supervisor | `#ec4899` (Rosa) |
| Operador | `#f59e0b` (Ámbar) |

## 🚀 Inicio Rápido

### Con Docker Compose (Recomendado)

```bash
cd pqr-system
docker-compose up
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:8000  
- Docs API: http://localhost:8000/docs

### Manualmente

**Backend:**
```bash
cd pqr-system/backend
pip install -r requirements.txt
python main.py
```

**Frontend:**
```bash
cd pqr-system/frontend
npm install
npm start
```

## 👤 Cuentas de Demostración

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Operador | `operador@pqr.com` | `operador123` |
| Supervisor | `supervisor@pqr.com` | `supervisor123` |
| Usuario | `usuario@pqr.com` | `usuario123` |

## 📂 Estructura del Proyecto

```
pqr-system/
├── backend/
│   ├── main.py          # Endpoints FastAPI
│   ├── models.py        # Modelos SQLAlchemy
│   ├── schemas.py       # Esquemas Pydantic
│   ├── auth.py          # JWT + Hashing
│   ├── database.py      # Configuración BD
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── api/         # Cliente HTTP (Axios)
│       ├── components/  # Componentes reutilizables
│       ├── context/     # AuthContext (JWT)
│       └── pages/
│           ├── user/        # Páginas del rol Usuario
│           ├── supervisor/  # Páginas del rol Supervisor
│           └── operator/    # Páginas del rol Operador
└── docker-compose.yml
```

## 🔌 API Endpoints

| Método | Endpoint | Descripción |
|--------|---------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/token` | Login |
| GET | `/api/auth/me` | Perfil actual |
| GET | `/api/pqrs` | Listar PQRs (filtradas por rol) |
| POST | `/api/pqrs` | Crear PQR |
| GET | `/api/pqrs/{id}` | Detalle PQR |
| PATCH | `/api/pqrs/{id}` | Actualizar PQR |
| POST | `/api/pqrs/{id}/comments` | Agregar comentario |
| GET | `/api/pqrs/stats` | Estadísticas |
| GET | `/api/users` | Listar usuarios (operador) |
| GET | `/api/users/supervisors` | Listar supervisores |

## 🛡️ Seguridad

- Contraseñas hasheadas con bcrypt
- Autenticación con JWT (tokens 8 horas)
- Acceso a endpoints filtrado por rol
- CORS configurado para desarrollo

## 📊 Estados de PQR

| Estado | Descripción |
|--------|-------------|
| `pendiente` | Recién creada, sin atender |
| `en_proceso` | Siendo trabajada por supervisor |
| `resuelto` | Solución encontrada |
| `cerrado` | Caso finalizado |
