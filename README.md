---

## 🧪 Testing y Calidad

- Ejecuta `npm run lint` para asegurar código limpio antes de cada commit.
- Agrega pruebas unitarias en `src/__tests__/` usando Jest o Vitest para lógica crítica.
- Usa `npm run test` (si tienes pruebas configuradas) para validar cambios.

---

## ⚙️ CI/CD Sugerido

Integra GitHub Actions para automatizar calidad y despliegue:

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm install
      - run: npm run lint
      - run: npm run build
```

Puedes agregar pasos para pruebas y despliegue automático a Vercel/Railway.

---

## 📞 Contacto y Créditos

- Autor: [Tu Nombre]
- Email: [tu.email@ejemplo.com]
- LinkedIn: [linkedin.com/in/tuusuario](https://linkedin.com/in/tuusuario)
- Soporte: Consulta los archivos de ayuda y documentación incluida.

---

# COLGO SaaS Académico

Proyecto robusto y profesional para la gestión académica, desarrollado con React + Vite + TypeScript, Supabase y backend Node.js/Express. Incluye validación avanzada, feedback visual, conexión real a Supabase/MySQL y documentación completa.

---

## 🚀 Inicio Rápido

Sigue la guía en [QUICK_START.md](QUICK_START.md) para instalar dependencias y ejecutar frontend y backend en minutos.

---

## 📦 Estructura del Proyecto

- **src/**
  - **components/**: Componentes React reutilizables
  - **pages/**: Vistas principales (Estudiantes, Cursos, Pagos, etc.)
  - **server/**: Backend Express (rutas, conexión BD, lógica de negocio)
  - **services/**: Servicios de datos (API REST y Supabase)
  - **state/**: Contextos globales y reducers
  - **utils/**: Utilidades y helpers
- **database/**: Scripts y guía de base de datos
- **public/**: Recursos estáticos

---

## 🛠️ Funcionalidades Clave

- CRUD completo de estudiantes, cursos, matrículas, pagos y sedes
- Validación avanzada de formularios y feedback visual
- Manejo global de errores y fallback a datos mock
- Conexión real a Supabase y MySQL
- Backend Express modular y seguro
- ESLint estricto, sin errores ni warnings
- Documentación profesional y guías rápidas

---


---


## 🚢 Despliegue en Producción

### Frontend en Vercel
1. Sube el proyecto a GitHub.
2. Ve a [vercel.com](https://vercel.com/) y crea un nuevo proyecto importando tu repo.
3. Configura las variables de entorno (`VITE_API_URL`, etc) en Settings > Environment Variables.
4. Vercel detecta Vite automáticamente y despliega el frontend.
5. Accede a tu app en la URL pública que te da Vercel.

### Backend en Railway
1. Ve a [railway.app](https://railway.app/) y crea un nuevo proyecto.
2. Importa tu repo o sube el backend (`src/server`).
3. Configura variables de entorno (`DB_HOST`, `DB_USER`, etc).
4. Railway instala dependencias y ejecuta `npm run server`.
5. Obtén la URL pública del backend y actualízala en el frontend (`VITE_API_URL`).

### Base de datos
- Puedes usar Railway, Azure Database for MySQL, PlanetScale o tu propio servidor MySQL.
- Consulta [database/README.md](database/README.md) para detalles avanzados de conexión y seguridad.

---

## 📸 Screenshots

Coloca tus capturas en la carpeta `/screenshots` y enlázalas aquí:

| Login | Dashboard | Estudiantes |
|-------|-----------|------------|
| ![Login](./screenshots/login.png) | ![Dashboard](./screenshots/dashboard.png) | ![Estudiantes](./screenshots/estudiantes.png) |

Puedes generar screenshots fácilmente con la extensión "GoFullPage" (Chrome) o usando `Ctrl+Shift+S` en Windows.

---

## 🏅 Buenas Prácticas

- Usa variables de entorno seguras, nunca subas `.env` a GitHub.
- Mantén dependencias actualizadas y ejecuta `npm run lint` antes de cada commit.
- Documenta cambios importantes en el README y en los archivos de ayuda.
- Realiza respaldos periódicos de la base de datos.
- Usa HTTPS en producción y configura CORS correctamente en el backend.

---

---

## 📸 Screenshots

Agrega aquí capturas de pantalla de la app en funcionamiento:

| Login | Dashboard | Estudiantes |
|-------|-----------|------------|
| ![Login](./screenshots/login.png) | ![Dashboard](./screenshots/dashboard.png) | ![Estudiantes](./screenshots/estudiantes.png) |

---

- [QUICK_START.md](QUICK_START.md): Guía de instalación y ejecución
- [CREAR_ESTUDIANTES.md](CREAR_ESTUDIANTES.md): Cómo crear estudiantes y flujo de datos
- [SETUP_BD.md](SETUP_BD.md): Resumen de la base de datos y scripts
- [database/README.md](database/README.md): Configuración avanzada de MySQL/Azure

---

## 🖥️ Scripts Útiles

- `npm run dev` — Inicia frontend (React/Vite)
- `npm run server` — Inicia backend (Express)
- `npm run lint` — Ejecuta ESLint

---

## 🏆 Checklist Profesional

- [x] Sin errores de ESLint
- [x] Validación avanzada y feedback visual
- [x] Conexión real a Supabase/MySQL
- [x] Backend Express seguro y modular
- [x] Documentación clara y completa

---

## 📸 Screenshots

> Agrega aquí capturas de pantalla de la app en funcionamiento para una entrega profesional.

---

## 👨‍💻 Autor y Soporte

- Desarrollado por [Tu Nombre]
- Contacto: [tu.email@ejemplo.com]
- Soporte: Consulta los archivos de ayuda y documentación incluida.
