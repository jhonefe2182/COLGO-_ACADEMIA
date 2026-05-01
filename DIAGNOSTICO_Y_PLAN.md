# 🔍 DIAGNÓSTICO Y PLAN DE ACCIÓN - COLGO ACADEMIA

## PROBLEMAS IDENTIFICADOS

### ❌ Problema 1: Dos servidores no están corriendo en paralelo
- **Frontend**: Vite (puerto 5173)
- **Backend**: Express (puerto 3001)
- **Solución**: Scripts para ejecutar ambos simultáneamente

### ❌ Problema 2: Autenticación es hardcoded
- Solo funciona: usuario `MARIO` / contraseña `123`
- No hay integración con base de datos real
- **Solución**: Integrar con MySQL real

### ❌ Problema 3: Rutas del backend incompletas
- El servidor devuelve datos fake
- Las rutas no están conectadas a la BD
- **Solución**: Conectar Express con MySQL

### ❌ Problema 4: Falta integración frontend ↔ backend
- El frontend hace llamadas a `/api/` pero no hay conexión real
- **Solución**: Configurar correctamente las llamadas API

### ❌ Problema 5: No hay gestión de errores
- Fallos silenciosos en la interfaz
- **Solución**: Agregar validaciones y manejo de errores

---

## PLAN DE ACCIÓN (FASE POR FASE)

### FASE 1️⃣: REPARAR LO ACTUAL (Hoy)
**Objetivo**: Hacer que la interfaz se cargue sin errores

- [ ] Crear `.env` con variables correctas
- [ ] Crear scripts para ejecutar frontend + backend
- [ ] Revisar y arreglar errores de consola
- [ ] Verificar conexión API
- [ ] Hacer prueba de login funcional

### FASE 2️⃣: BASE DE DATOS (Mañana)
**Objetivo**: Conectar MySQL real con la aplicación

- [ ] Crear tablas necesarias
- [ ] Conectar Express con MySQL
- [ ] Implementar API real para estudiantes, cursos, etc.

### FASE 3️⃣: AUTENTICACIÓN REAL (Mañana)
**Objetivo**: Login con usuarios de la BD

- [ ] Crear tabla `usuarios` en BD
- [ ] Implementar login con email/password
- [ ] Agregar JWT tokens
- [ ] Crear endpoint de registro

### FASE 4️⃣: PANELES COMPLETOS (Esta semana)
**Objetivo**: Construir todo el sistema

**Panel Administrador:**
- Crear/editar estudiantes
- Crear/editar cursos
- Crear matrículas
- Ver reportes

**Panel Estudiante:**
- Ver cursos matriculados
- Ver notas
- Ver horarios
- Descargar certificados

**Panel Docente:**
- Ver cursos asignados
- Calificar estudiantes
- Ver lista de estudiantes

### FASE 5️⃣: ENVÍO DE CORREOS (Esta semana)
**Objetivo**: Automatizar notificaciones

- [ ] Configurar Nodemailer
- [ ] Enviar credenciales al crear usuario
- [ ] Enviar confirmación de matrícula

---

## REQUISITOS TÉCNICOS

```
TECNOLOGÍAS ACTUALES:
├── Frontend: React 19 + TypeScript + Vite + Tailwind
├── Backend: Express 5 + Node.js
├── Base de Datos: MySQL 2
├── Autenticación: JWT + localStorage
└── Correos: Nodemailer
```

---

## PRÓXIMAS ACCIONES

### AHORA - Ejecutar esto en terminal (2 ventanas):

**Ventana 1 - Frontend:**
```bash
npm run dev
# Abre en: http://localhost:5173
```

**Ventana 2 - Backend:**
```bash
npm run server
# Ejecuta en: /api
```

### PROBLEMAS A REVISAR:
1. ¿Funciona el login con usuario `MARIO` / `123`?
2. ¿Se ven errores en la consola del navegador (F12)?
3. ¿Se ven errores en la terminal donde corre el servidor?
4. ¿La interfaz se carga correctamente?

---

## ESTRUCTURA DE CARPETAS QUE VAMOS A CREAR

```
src/
├── server/
│   ├── index.ts          (Punto de entrada del servidor) ✅ Exists
│   ├── routes.ts         (Rutas API) ✅ Exists
│   ├── db/
│   │   ├── index.ts      (Conexión MySQL)
│   │   ├── models.ts     (Esquema de BD)
│   │   └── queries.ts    (Funciones de BD)
│   ├── middleware/
│   │   ├── auth.js       (Validar JWT)
│   │   └── error.js      (Manejo de errores)
│   └── services/
│       ├── email.js      (Envío de correos)
│       └── auth.js       (Lógica de autenticación)
│
├── components/
│   ├── admin/            (Panel admin)
│   ├── student/          (Panel estudiante)
│   ├── teacher/          (Panel docente)
│   └── common/           (Componentes compartidos)
│
└── services/
    ├── api.ts            (Llamadas HTTP)
    └── auth.ts           (Gestión de sesión)
```

---

## INDICA EN QUÉ LÍNEA ESTAMOS:

📍 **ESTAMOS AQUÍ**: Fase 1️⃣ - Reparar lo actual

**Siguiente paso**: ¿Ejecutaste el `npm run dev` y `npm run server`? ¿Qué errores ves?
