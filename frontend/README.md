# HobbyConnect — Frontend (React + Vite + Tailwind)

Plataforma para reunir a personas que comparten un hobby y un nivel de desempeño similar.

## Requisitos
- Node.js 18 o superior

## Instalación y ejecución
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # build de producción en /dist
```

## Estructura del proyecto
```
src/
├── main.jsx                 # Punto de entrada (Router + estilos)
├── App.jsx                  # Layout + rutas
├── index.css                # Tailwind + fuentes + utilidades
├── data/
│   └── seed.js              # Datos de ejemplo (hobbies, niveles, grupos)
├── components/              # Componentes reutilizables
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── LevelBadge.jsx
│   ├── Stat.jsx
│   ├── HobbyCard.jsx
│   └── GroupCard.jsx
├── sections/                # Secciones de la Home
│   ├── Hero.jsx
│   ├── FeaturedHobbies.jsx
│   └── RecommendedGroups.jsx
└── pages/                   # Páginas (rutas)
    ├── Home.jsx
    ├── Groups.jsx           # (por construir) Explorar + filtros
    └── CreateGroup.jsx      # (por construir) Formulario de grupo
```

## Rutas
- `/`        Home
- `/grupos`  Explorar grupos (placeholder)
- `/crear`   Crear grupo (placeholder)
