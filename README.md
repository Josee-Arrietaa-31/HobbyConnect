# HobbyConnect — Aplicación full-stack (Docker)

Plataforma para reunir a personas que comparten un hobby y un nivel de desempeño similar.

Stack: **React + Vite + Tailwind** (frontend) · **Node.js + Express** (backend) · **PostgreSQL** (base de datos), todo orquestado con **Docker Compose**.

## Requisitos
- Docker Desktop (incluye Docker Compose)

## Levantar TODO con un comando
```bash
docker compose up --build
```
Esto crea y arranca:
- **Frontend**  → http://localhost:5173
- **Backend / API** → http://localhost:3001/api/health
- **PostgreSQL** → localhost:5432  (usuario: hobby_user / clave: hobby_pass / base: hobbyconnect)
- **Adminer** (ver la base en el navegador) → http://localhost:8080

La base de datos se crea y se llena con datos de ejemplo **automáticamente** la primera vez que arranca el backend.

Usuario demo: `demo@hobbyconnect.cr` / `demo1234`

Para detener:
```bash
docker compose down          # conserva los datos
docker compose down -v       # borra también la base (empieza de cero)
```

## Modo desarrollo (frontend con recarga en caliente)
Levantá solo la base y el backend con Docker, y el frontend con Vite:
```bash
docker compose up -d db backend
cd frontend
npm install
npm run dev        # http://localhost:5173 (proxy /api -> localhost:3001)
```

## Estructura
```
hobbyconnect/
├── docker-compose.yml
├── backend/        Node + Express (API REST) + esquema y semilla automáticos
└── frontend/       React + Vite + Tailwind
```

Cambio de prueba para el flujo de CI/CD.
