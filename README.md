# 🎓 COLGO ACADEMIA - Sistema Académico SaaS

**Estado:** En construcción (Fase 1 - Reparación de interfaz)

---

## 📍 ¿DÓNDE ESTAMOS?

**Estamos aquí:**
- ✅ Estructura del proyecto completa
- ✅ Frontend React + Tailwind
- ✅ Backend Express
- ✅ Autenticación básica (temporal)
- ⏳ **Fase 1:** Verificar que interfaz funciona
- ⛔ Fase 2+: BD, paneles, correos (próximamente)

---

## 🚀 INICIO RÁPIDO

### 1️⃣ Ejecutar automáticamente (RECOMENDADO)
```bash
# Haz doble clic en:
START_ALL.bat

# O ejecuta en PowerShell:
.\START_ALL.bat
```

Esto abrirá 2 ventanas automáticamente:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### 2️⃣ O ejecutar manualmente

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run server
```

---

## 🔑 Credenciales de Prueba

```
Usuario:      MARIO
Contraseña:   123
Rol:          Admin
```

---

## 📊 Estructura del Proyecto

```
src/
├── server/              # Backend Express
├── pages/               # Páginas React
├── components/          # Componentes UI
├── services/            # Llamadas API
├── state/               # Context API
└── types/               # TypeScript types
```

---

## 📖 DOCUMENTACIÓN

### Para comenzar (LEE ESTO PRIMERO):
1. **[RESUMEN_EJECUTIVO.md](./RESUMEN_EJECUTIVO.md)** - ¿Qué hacer ahora?
2. **[VERIFICACION_INTERFAZ.md](./VERIFICACION_INTERFAZ.md)** - ¿No funciona? Lee aquí
3. **[DIAGNOSTICO_Y_PLAN.md](./DIAGNOSTICO_Y_PLAN.md)** - Problemas identificados

### Para entender la arquitectura:
- **[PLAN_TECNICO.md](./PLAN_TECNICO.md)** - Arquitectura completa del sistema

---

## 🛠️ Tecnologías

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript |
| BD | MySQL 8.0+ |
| Auth | JWT, bcryptjs |
| Emails | Nodemailer |

---

## ✅ Checklist - "Todo funciona"

- [ ] Ejecuté `START_ALL.bat` o ambos servidores
- [ ] Accedí a http://localhost:5173
- [ ] Vi página de login
- [ ] Ingresé MARIO / 123
- [ ] El dashboard abrió correctamente
- [ ] No hay errores en F12 (Developer Tools)

---

## 🆘 Si algo no funciona

1. Abre: **[VERIFICACION_INTERFAZ.md](./VERIFICACION_INTERFAZ.md)**
2. Busca tu problema en la tabla "PROBLEMAS COMUNES"
3. Sigue las soluciones

---

## 📋 Scripts disponibles

```bash
npm run dev        # Inicia frontend Vite
npm run server     # Inicia backend Express
npm run build      # Compilar para producción
npm run lint       # Verificar código
```

---

## 🎯 Próximas fases

- **Fase 2:** Conectar BD MySQL real
- **Fase 3:** Autenticación real con BD
- **Fase 4:** Panel administrador completo
- **Fase 5:** Panel estudiante
- **Fase 6:** Panel docente
- **Fase 7:** Sistema de correos automáticos

---

## 🤝 Contribuciones

Este proyecto está en construcción activa. Para cambios importantes, por favor consulta primero.

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
