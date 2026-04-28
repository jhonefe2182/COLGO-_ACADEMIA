# 🎓 PLAN TÉCNICO COMPLETO - COLGO ACADEMIA SaaS

## 📊 VISIÓN GENERAL

Sistema académico SaaS con 3 paneles independientes:
1. **Panel Administrador** - Gestión completa
2. **Panel Estudiante** - Acceso privado
3. **Panel Docente** - Calificación y reportes

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────────────┐
│                          CLIENTE (WEB)                          │
├────────────────────────┬────────────────────┬──────────────────┤
│  Panel Admin           │  Panel Estudiante  │  Panel Docente   │
│  (React + Vite)       │  (React + Vite)    │  (React + Vite)  │
│  Puerto: 5173         │  Puerto: 5173      │  Puerto: 5173    │
└────────────────────────┴────────────────────┴──────────────────┘
                              ↓ HTTPS/JSON
        ┌─────────────────────────────────────────────────┐
        │            API REST (Express)                    │
        │            Puerto: 3001                          │
        ├─────────────────────────────────────────────────┤
        │  Autenticación (JWT)                             │
        │  Validaciones                                     │
        │  Manejo de errores                               │
        └─────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────────────┐
        │    BASE DE DATOS (MySQL 8.0+)                   │
        │    - Usuarios                                    │
        │    - Estudiantes                                 │
        │    - Docentes                                    │
        │    - Cursos                                      │
        │    - Matrículas                                  │
        │    - Notas                                       │
        │    - Asignaturas                                 │
        │    - Sedes                                       │
        └─────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────────────────────────────────┐
        │    SERVICIOS EXTERNOS                            │
        │    - Nodemailer (Gmail)                          │
        │    - Generación de PDFs                          │
        │    - Almacenamiento de archivos                  │
        └─────────────────────────────────────────────────┘
```

---

## 📦 ESTRUCTURA DE CARPETAS FINAL

```
colgo-academi-saas/
├── src/
│   ├── server/                          # Backend Express
│   │   ├── index.ts                     # Punto de entrada
│   │   ├── server.mjs                   # Servidor MJS
│   │   ├── routes.ts                    # Rutas principales
│   │   ├── db/
│   │   │   ├── index.ts                 # Conexión MySQL
│   │   │   ├── models/
│   │   │   │   ├── Usuario.ts
│   │   │   │   ├── Estudiante.ts
│   │   │   │   ├── Docente.ts
│   │   │   │   ├── Curso.ts
│   │   │   │   ├── Matricula.ts
│   │   │   │   └── Nota.ts
│   │   │   └── queries/
│   │   │       ├── usuarios.ts
│   │   │       ├── estudiantes.ts
│   │   │       ├── docentes.ts
│   │   │       ├── cursos.ts
│   │   │       ├── matriculas.ts
│   │   │       └── notas.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts                  # JWT verificación
│   │   │   ├── error.ts                 # Manejo de errores
│   │   │   └── validate.ts              # Validaciones
│   │   ├── services/
│   │   │   ├── auth.ts                  # Lógica de login
│   │   │   ├── email.ts                 # Envío de correos
│   │   │   ├── password.ts              # Hash de contraseñas
│   │   │   └── jwt.ts                   # Tokens JWT
│   │   └── routes/
│   │       ├── auth.ts                  # Login/Register
│   │       ├── admin/
│   │       │   ├── estudiantes.ts
│   │       │   ├── docentes.ts
│   │       │   ├── cursos.ts
│   │       │   └── matriculas.ts
│   │       ├── estudiante/
│   │       │   ├── dashboard.ts
│   │       │   ├── cursos.ts
│   │       │   ├── notas.ts
│   │       │   └── certificados.ts
│   │       └── docente/
│   │           ├── cursos.ts
│   │           ├── estudiantes.ts
│   │           └── notas.ts
│   │
│   ├── pages/                           # Páginas React
│   │   ├── LoginPage.tsx                ✓ Existe
│   │   ├── DashboardPage.tsx            ✓ Existe
│   │   ├── admin/
│   │   │   ├── EstudiantesPage.tsx
│   │   │   ├── DocentesPage.tsx
│   │   │   ├── CursosPage.tsx
│   │   │   ├── MatriculasPage.tsx
│   │   │   └── ReportesPage.tsx
│   │   ├── student/
│   │   │   ├── DashboardEstudiante.tsx
│   │   │   ├── MisCursos.tsx
│   │   │   ├── Notas.tsx
│   │   │   ├── Horarios.tsx
│   │   │   └── Certificados.tsx
│   │   └── teacher/
│   │       ├── DashboardDocente.tsx
│   │       ├── MisCursos.tsx
│   │       ├── EstudiantesCurso.tsx
│   │       ├── Calificaciones.tsx
│   │       └── Reportes.tsx
│   │
│   ├── components/                      # Componentes React
│   │   ├── admin/                       # Admin específico
│   │   ├── student/                     # Estudiante específico
│   │   ├── teacher/                     # Docente específico
│   │   ├── common/                      # Compartidos
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   └── Toast.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── AdminLayout.tsx
│   │
│   ├── services/
│   │   ├── api.ts                       # Llamadas HTTP
│   │   ├── auth.ts                      # Lógica de sesión
│   │   └── storage.ts                   # LocalStorage
│   │
│   ├── state/                           # Context API
│   │   ├── authContext.tsx
│   │   ├── authProvider.tsx
│   │   └── useAuth.ts
│   │
│   ├── types/
│   │   ├── database.ts                  # Tipos BD
│   │   ├── api.ts                       # Tipos API
│   │   └── auth.ts                      # Tipos auth
│   │
│   ├── utils/
│   │   ├── validators.ts                # Validaciones
│   │   ├── formatters.ts                # Formateo
│   │   └── constants.ts                 # Constantes
│   │
│   ├── App.tsx                          # Routing principal
│   ├── main.tsx                         # Entry point
│   └── index.css                        # Estilos globales
│
├── database/
│   ├── schema.sql                       # Esquema BD
│   ├── migrations/
│   │   ├── 001_create_tables.sql
│   │   ├── 002_add_indexes.sql
│   │   └── 003_seed_data.sql
│   └── backups/
│
├── .env                                 # Variables de entorno ✓ Existe
├── .env.example                         # Plantilla
├── .gitignore                           # Git ignore
├── package.json                         # Dependencias ✓ Existe
├── tsconfig.json                        # TypeScript ✓ Existe
├── vite.config.ts                       # Vite config ✓ Existe
│
├── DIAGNOSTICO_Y_PLAN.md               # Este archivo
├── VERIFICACION_INTERFAZ.md            # Troubleshooting
├── PLAN_TECNICO.md                     # Arquitectura (este archivo)
└── START_ALL.bat                        # Script inicio

```

---

## 🎯 FASES DE DESARROLLO

### FASE 1️⃣: REPARAR LO ACTUAL (AHORA)
**Duración:** 30 minutos
**Objetivo:** Interfaz funciona sin errores

- [x] Crear .env correcto
- [x] Script START_ALL.bat
- [x] Ambos servidores corren
- [x] Login funciona (MARIO/123)
- [x] Dashboard carga sin errores
- [ ] **TÚ ESTÁS AQUÍ**

---

### FASE 2️⃣: BASE DE DATOS REAL (Próximas 2 horas)
**Duración:** 2 horas
**Objetivo:** Reemplazar datos fake con BD real

#### Tablas a crear:
```sql
usuarios
├── id (INT PRIMARY KEY)
├── email (VARCHAR 255 UNIQUE)
├── password_hash (VARCHAR 255)
├── rol (ENUM: admin, estudiante, docente)
├── activo (BOOLEAN)
└── created_at (TIMESTAMP)

estudiantes
├── id (INT PRIMARY KEY)
├── usuario_id (INT FOREIGN KEY → usuarios)
├── nombre (VARCHAR 255)
├── apellido (VARCHAR 255)
├── documento (VARCHAR 50 UNIQUE)
├── telefono (VARCHAR 20)
├── direccion (TEXT)
├── ciudad (VARCHAR 100)
├── estado_civil (ENUM)
└── created_at (TIMESTAMP)

docentes
├── id (INT PRIMARY KEY)
├── usuario_id (INT FOREIGN KEY → usuarios)
├── nombre (VARCHAR 255)
├── apellido (VARCHAR 255)
├── especialidad (VARCHAR 255)
├── numero_ficha (VARCHAR 50 UNIQUE)
└── created_at (TIMESTAMP)

cursos
├── id (INT PRIMARY KEY)
├── nombre (VARCHAR 255)
├── codigo (VARCHAR 50 UNIQUE)
├── descripcion (TEXT)
├── horas (INT)
├── creditos (INT)
├── semestre (INT)
├── activo (BOOLEAN)
└── created_at (TIMESTAMP)

sedes
├── id (INT PRIMARY KEY)
├── nombre (VARCHAR 255)
├── ciudad (VARCHAR 100)
├── direccion (TEXT)
├── telefono (VARCHAR 20)
├── coordinador (VARCHAR 255)
└── created_at (TIMESTAMP)

matriculas
├── id (INT PRIMARY KEY)
├── estudiante_id (INT FOREIGN KEY → estudiantes)
├── curso_id (INT FOREIGN KEY → cursos)
├── fecha_matricula (DATE)
├── estado (ENUM: activa, completada, cancelada)
├── calificacion_final (DECIMAL 5,2 NULL)
└── created_at (TIMESTAMP)

notas
├── id (INT PRIMARY KEY)
├── matricula_id (INT FOREIGN KEY → matriculas)
├── actividad (VARCHAR 255)
├── nota (DECIMAL 5,2)
├── porcentaje (INT)
├── fecha (DATE)
└── created_at (TIMESTAMP)

asignaturas
├── id (INT PRIMARY KEY)
├── curso_id (INT FOREIGN KEY → cursos)
├── docente_id (INT FOREIGN KEY → docentes)
├── horario (VARCHAR 255)
├── salon (VARCHAR 50)
└── created_at (TIMESTAMP)
```

**Tareas:**
- [ ] Crear BD `colgo_db`
- [ ] Ejecutar script SQL
- [ ] Conectar Express con MySQL
- [ ] Crear modelos en `/src/server/db/models/`
- [ ] Reemplazar datos fake con queries reales
- [ ] Probar todas las rutas API

---

### FASE 3️⃣: AUTENTICACIÓN REAL (Próximas 2 horas)
**Objetivo:** Login con usuarios de BD + JWT

- [ ] Hashear contraseñas con bcrypt
- [ ] Generar JWT tokens
- [ ] Middleware de verificación
- [ ] Rutas protegidas
- [ ] Refresh tokens
- [ ] Logout

---

### FASE 4️⃣: PANEL ADMINISTRADOR COMPLETO (Mañana)
**Objetivo:** Todas las funcionalidades de admin

**Subpáginas:**
- [ ] Gestión de Estudiantes (CRUD)
- [ ] Gestión de Docentes (CRUD)
- [ ] Gestión de Cursos (CRUD)
- [ ] Matrículas (Crear, editar estado)
- [ ] Reportes (Estudiantes, ingresos, etc.)
- [ ] Sedes (Gestión)

**Características:**
- [ ] Tabla con búsqueda y filtros
- [ ] Exportar a Excel/PDF
- [ ] Validaciones completas
- [ ] Confirmaciones de acción

---

### FASE 5️⃣: PANEL ESTUDIANTE (Mañana tarde)
**Objetivo:** Acceso estudiante con login real

**Funcionalidades:**
- [ ] Ver datos personales
- [ ] Ver cursos matriculados
- [ ] Ver notas por curso
- [ ] Ver horarios
- [ ] Descargar certificado
- [ ] Cambiar contraseña

---

### FASE 6️⃣: PANEL DOCENTE (Pasado mañana)
**Objetivo:** Gestión de calificaciones

**Funcionalidades:**
- [ ] Ver cursos asignados
- [ ] Ver estudiantes por curso
- [ ] Subir/editar notas
- [ ] Enviar mensajes a estudiantes
- [ ] Generar reportes

---

### FASE 7️⃣: CORREOS AUTOMÁTICOS (Pasado mañana tarde)
**Objetivo:** Notificaciones automáticas

**Correos:**
- [ ] Bienvenida con credenciales
- [ ] Confirmación de matrícula
- [ ] Cambio de calificación
- [ ] Recordatorios
- [ ] Certificado descargado

---

## 🔑 CREDENCIALES DE PRUEBA

### Admin (Temporal - Fase 1)
```
Usuario: MARIO
Contraseña: 123
```

### Admin (Real - Fase 3)
```
Email: admin@colgo.edu
Contraseña: Admin123!@
```

### Estudiante de prueba
```
Email: mario@colgo.edu
Contraseña: Mario123!@
```

### Docente de prueba
```
Email: docente@colgo.edu
Contraseña: Docente123!@
```

---

## 🛠️ TECNOLOGÍAS USADAS

### Frontend
- React 19
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM

### Backend
- Node.js
- Express 5
- TypeScript
- MySQL 2

### Seguridad
- JWT (jsonwebtoken)
- bcryptjs (hash de contraseñas)
- CORS
- Validaciones (express-validator)

### Emails
- Nodemailer
- Gmail SMTP

### Utils
- dotenv
- clsx
- lucide-react (iconos)

---

## 📋 CHECKLIST MAESTRO

### Fase 1 (Hoy)
- [x] Servidores corriendo
- [x] Login funciona
- [x] Dashboard carga
- [ ] **SIN ERRORES EN CONSOLA**

### Fase 2 (Mañana)
- [ ] BD conectada
- [ ] Tabla usuarios funciona
- [ ] API devuelve datos reales
- [ ] Tabla estudiantes se llena

### Fase 3
- [ ] Login con BD real
- [ ] JWT tokens funcionan
- [ ] Rutas protegidas funcionan

### Fase 4
- [ ] Crud de estudiantes
- [ ] Crud de cursos
- [ ] Sistema de matrículas
- [ ] Reportes básicos

### Fase 5
- [ ] Panel estudiante completo

### Fase 6
- [ ] Panel docente completo

### Fase 7
- [ ] Correos automáticos

---

## ⚡ SIGUIENTES PASOS

1. **Ahora (próximos 30 min):**
   - Asegúrate que la interfaz se carga sin errores
   - Prueba login con MARIO/123
   - Verifica que no haya errores en F12

2. **Cuando todo funcione:**
   - Avísame "✅ Todo está funcionando"
   - Vamos a FASE 2: Base de datos real

3. **Preguntas:**
   - ¿Ya tienes MySQL instalado?
   - ¿Tienes configurada una BD existente?
   - ¿Necesitas que te ayude a instalar MySQL?

---

## 📞 SOPORTE

Si tienes dudas o errores:
1. Revisa: `VERIFICACION_INTERFAZ.md`
2. Copia el error exacto
3. Cuéntame qué paso estabas haciendo
