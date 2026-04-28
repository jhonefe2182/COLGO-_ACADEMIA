# 📚 DOCUMENTACIÓN DE ENDPOINTS - SISTEMA ACADÉMICO COLGO

## ✅ FASE 1 COMPLETADA - BACKEND IMPLEMENTADO

---

## 🔐 AUTENTICACIÓN (Público)

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "estudiante@colgo.edu",
  "password": "ContraseñaSegura123"
}

✓ Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "estudiante@colgo.edu",
    "rol": "estudiante",
    "cambiar_password": false
  }
}
```

### Register (Estudiantes autoadministrados)
```
POST /api/auth/register
Content-Type: application/json

{
  "nombre": "Juan",
  "apellido": "Pérez",
  "email": "juan@colgo.edu",
  "password": "ContraseñaSegura123"
}

✓ Response (201):
{
  "success": true,
  "message": "Registro exitoso. Ahora puedes iniciar sesión"
}
```

### Refresh Token
```
POST /api/auth/refresh-token
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

✓ Response (200):
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Get Current User
```
GET /api/auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

✓ Response (200):
{
  "success": true,
  "usuario": {
    "id": 1,
    "email": "usuario@colgo.edu",
    "rol": "admin",
    "activo": true,
    "cambiar_password": false
  }
}
```

---

## 👨‍💼 ADMIN ENDPOINTS (Requiere rol: admin)

### Obtener Estadísticas
```
GET /api/admin/estadisticas
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
{
  "estudiantes": 15,
  "docentes": 5,
  "cursos": 8,
  "matriculasActivas": 42
}
```

### ===== ESTUDIANTES =====

#### Listar Estudiantes
```
GET /api/admin/estudiantes
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "documento": "1001234567",
    "email": "juan@colgo.edu",
    "activo": true,
    "fecha_creacion": "2024-04-20T10:00:00Z"
  }
]
```

#### Obtener Estudiante
```
GET /api/admin/estudiantes/1
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "documento": "1001234567",
  "email": "juan@colgo.edu",
  "activo": true,
  "telefono": "3001234567",
  "direccion": "Calle 1 #1",
  "ciudad": "Bogotá"
}
```

#### Crear Estudiante (Genera contraseña + Envía email)
```
POST /api/admin/estudiantes
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "nombre": "Carlos",
  "apellido": "López",
  "email": "carlos@colgo.edu",
  "documento": "1987654321",
  "fecha_nacimiento": "2000-05-15",
  "telefono": "3109876543",
  "direccion": "Calle 2 #2",
  "ciudad": "Medellín"
}

✓ Response (201):
{
  "success": true,
  "message": "Estudiante creado exitosamente y email de credenciales enviado",
  "email": "carlos@colgo.edu",
  "nota": "El estudiante recibirá un email con sus credenciales de acceso"
}
```

#### Actualizar Estudiante
```
PUT /api/admin/estudiantes/1
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "nombre": "Carlos",
  "apellido": "López García",
  "documento": "1987654321",
  "telefono": "3119876543",
  "direccion": "Calle 3 #3"
}

✓ Response (200):
{
  "success": true,
  "message": "Estudiante actualizado"
}
```

#### Desactivar Estudiante
```
DELETE /api/admin/estudiantes/1
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
{
  "success": true,
  "message": "Estudiante desactivado"
}
```

### ===== DOCENTES =====

#### Listar Docentes
```
GET /api/admin/docentes
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
[
  {
    "id": 1,
    "nombre": "María",
    "apellido": "González",
    "especialidad": "Matemáticas",
    "email": "maria@colgo.edu",
    "activo": true
  }
]
```

#### Crear Docente
```
POST /api/admin/docentes
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "nombre": "Pedro",
  "apellido": "Rodríguez",
  "email": "pedro@colgo.edu",
  "especialidad": "Física",
  "documento": "1076543210",
  "telefono": "3147654321"
}

✓ Response (201):
{
  "success": true,
  "message": "Docente creado exitosamente",
  "email": "pedro@colgo.edu",
  "nota": "Se ha enviado un email con las credenciales de acceso"
}
```

#### Actualizar Docente
```
PUT /api/admin/docentes/1
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "nombre": "Pedro",
  "apellido": "Rodríguez García",
  "especialidad": "Física Cuántica",
  "telefono": "3157654321"
}

✓ Response (200):
{
  "success": true,
  "message": "Docente actualizado"
}
```

#### Desactivar Docente
```
DELETE /api/admin/docentes/1
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
{
  "success": true,
  "message": "Docente desactivado"
}
```

### ===== CURSOS =====

#### Listar Cursos
```
GET /api/admin/cursos
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
[
  {
    "id": 1,
    "nombre": "Matemáticas I",
    "codigo": "MAT101",
    "descripcion": "Introducción a cálculo",
    "creditos": 3,
    "capacidad": 30,
    "semestre": 1,
    "activo": true,
    "docente": "María González"
  }
]
```

#### Crear Curso
```
POST /api/admin/cursos
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "nombre": "Física I",
  "codigo": "FIS101",
  "descripcion": "Introducción a la física",
  "docente_id": 1,
  "creditos": 3,
  "capacidad": 25,
  "semestre": 1
}

✓ Response (201):
{
  "success": true,
  "message": "Curso creado exitosamente",
  "id": 1
}
```

#### Actualizar Curso
```
PUT /api/admin/cursos/1
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "nombre": "Física I Avanzado",
  "codigo": "FIS101A",
  "descripcion": "Física con aplicaciones",
  "docente_id": 2,
  "creditos": 4,
  "capacidad": 20,
  "semestre": 2
}

✓ Response (200):
{
  "success": true,
  "message": "Curso actualizado"
}
```

#### Desactivar Curso
```
DELETE /api/admin/cursos/1
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
{
  "success": true,
  "message": "Curso desactivado"
}
```

### ===== MATRÍCULAS =====

#### Crear Matrícula (Con notificación por email)
```
POST /api/matriculas/crear
Authorization: Bearer TOKEN_ADMIN
Content-Type: application/json

{
  "estudiante_id": 1,
  "curso_id": 1
}

✓ Response (201):
{
  "success": true,
  "message": "Matrícula creada exitosamente y notificación enviada",
  "id": 1,
  "estudiante": "juan@colgo.edu"
}

! El estudiante recibe email: "Matrícula confirmada: [Nombre Curso]"
```

#### Listar Matrículas
```
GET /api/matriculas/listar
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
[
  {
    "id": 1,
    "fecha_matricula": "2024-04-20T10:00:00Z",
    "estado": "activa",
    "calificacion_final": null,
    "estudiante": "Juan Pérez",
    "curso": "Matemáticas I",
    "codigo": "MAT101"
  }
]
```

#### Obtener Matrículas de Estudiante
```
GET /api/matriculas/estudiante/1
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
[
  {
    "id": 1,
    "fecha_matricula": "2024-04-20T10:00:00Z",
    "estado": "activa",
    "calificacion_final": null,
    "nombre": "Matemáticas I",
    "codigo": "MAT101",
    "descripcion": "Introducción a cálculo",
    "creditos": 3
  }
]
```

#### Cancelar Matrícula
```
DELETE /api/matriculas/1
Authorization: Bearer TOKEN_ADMIN

✓ Response (200):
{
  "success": true,
  "message": "Matrícula cancelada"
}
```

---

## 👤 STUDENT ENDPOINTS (Requiere rol: estudiante)

### Obtener Perfil
```
GET /api/student/perfil
Authorization: Bearer TOKEN_STUDENT

✓ Response (200):
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "documento": "1001234567",
  "fecha_nacimiento": "2000-05-15",
  "telefono": "3001234567",
  "direccion": "Calle 1 #1",
  "ciudad": "Bogotá",
  "email": "juan@colgo.edu",
  "activo": true
}
```

### Actualizar Perfil
```
PUT /api/student/perfil
Authorization: Bearer TOKEN_STUDENT
Content-Type: application/json

{
  "nombre": "Juan Carlos",
  "apellido": "Pérez López",
  "telefono": "3109876543",
  "direccion": "Calle 2 #2"
}

✓ Response (200):
{
  "success": true,
  "message": "Perfil actualizado"
}
```

### Obtener Cursos Matriculados
```
GET /api/student/cursos
Authorization: Bearer TOKEN_STUDENT

✓ Response (200):
[
  {
    "id": 1,
    "nombre": "Matemáticas I",
    "codigo": "MAT101",
    "descripcion": "Introducción a cálculo",
    "creditos": 3,
    "matricula_id": 1,
    "estado": "activa",
    "calificacion_final": null,
    "fecha_matricula": "2024-04-20T10:00:00Z",
    "docente": "María González"
  }
]
```

### Obtener Notas de Cursos
```
GET /api/student/cursos/1/notas
Authorization: Bearer TOKEN_STUDENT

✓ Response (200):
[
  {
    "id": 1,
    "evaluacion_numero": 1,
    "nota": 4.5,
    "descripcion": "Quiz 1",
    "fecha_evaluacion": "2024-04-15"
  }
]
```

### Obtener Horarios
```
GET /api/student/horarios
Authorization: Bearer TOKEN_STUDENT

✓ Response (200):
[
  {
    "id": 1,
    "dia_semana": "Lunes",
    "hora_inicio": "08:00:00",
    "hora_fin": "10:00:00",
    "sala": "Aula 101",
    "nombre": "Matemáticas I",
    "codigo": "MAT101"
  }
]
```

### Obtener Certificados
```
GET /api/student/certificados
Authorization: Bearer TOKEN_STUDENT

✓ Response (200):
[
  {
    "id": 1,
    "numero_certificado": "CERT2024001",
    "fecha_emision": "2024-04-20",
    "descargado": false,
    "curso_nombre": "Matemáticas I",
    "calificacion_final": 4.2
  }
]
```

### Descargar Certificado
```
POST /api/student/certificados/1/descargar
Authorization: Bearer TOKEN_STUDENT

✓ Response (200):
{
  "success": true,
  "message": "Certificado descargado",
  "url": "/api/student/certificados/1/documento"
}
```

---

## 👨‍🏫 TEACHER ENDPOINTS (Requiere rol: docente)

### Obtener Perfil
```
GET /api/teacher/perfil
Authorization: Bearer TOKEN_TEACHER

✓ Response (200):
{
  "id": 1,
  "nombre": "María",
  "apellido": "González",
  "documento": "1076543210",
  "especialidad": "Matemáticas",
  "telefono": "3147654321",
  "email": "maria@colgo.edu",
  "activo": true
}
```

### Obtener Cursos Asignados
```
GET /api/teacher/cursos
Authorization: Bearer TOKEN_TEACHER

✓ Response (200):
[
  {
    "id": 1,
    "nombre": "Matemáticas I",
    "codigo": "MAT101",
    "descripcion": "Introducción a cálculo",
    "creditos": 3,
    "capacidad": 30,
    "semestre": 1,
    "estudiantes_inscritos": 15,
    "activo": true
  }
]
```

### Obtener Estudiantes de un Curso
```
GET /api/teacher/cursos/1/estudiantes
Authorization: Bearer TOKEN_TEACHER

✓ Response (200):
[
  {
    "id": 1,
    "nombre": "Juan",
    "apellido": "Pérez",
    "documento": "1001234567",
    "email": "juan@colgo.edu",
    "matricula_id": 1,
    "estado": "activa",
    "calificacion_final": null,
    "promedio_evaluaciones": 4.2
  }
]
```

### Obtener Notas de un Estudiante
```
GET /api/teacher/cursos/1/estudiantes/1/notas
Authorization: Bearer TOKEN_TEACHER

✓ Response (200):
[
  {
    "id": 1,
    "evaluacion_numero": 1,
    "nota": 4.5,
    "fecha_creacion": "2024-04-20",
    "descripcion": "Quiz 1"
  }
]
```

### Registrar Calificación
```
POST /api/teacher/cursos/1/estudiantes/1/notas
Authorization: Bearer TOKEN_TEACHER
Content-Type: application/json

{
  "evaluacion_numero": 1,
  "nota": 4.5,
  "descripcion": "Quiz 1",
  "fecha_evaluacion": "2024-04-15"
}

✓ Response (201):
{
  "success": true,
  "message": "Nota registrada exitosamente"
}
```

### Actualizar Calificación Final
```
PUT /api/teacher/cursos/1/estudiantes/1/calificacion-final
Authorization: Bearer TOKEN_TEACHER
Content-Type: application/json

{
  "calificacion_final": 4.2,
  "estado": "completada",
  "observaciones": "Excelente desempeño"
}

✓ Response (200):
{
  "success": true,
  "message": "Calificación final registrada"
}
```

### Obtener Horarios de un Curso
```
GET /api/teacher/cursos/1/horarios
Authorization: Bearer TOKEN_TEACHER

✓ Response (200):
[
  {
    "id": 1,
    "dia_semana": "Lunes",
    "hora_inicio": "08:00:00",
    "hora_fin": "10:00:00",
    "sala": "Aula 101",
    "curso_id": 1
  }
]
```

---

## 📊 CÓDIGOS DE RESPUESTA

| Código | Significado |
|--------|------------|
| 200 | OK - Solicitud exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Datos inválidos |
| 401 | Unauthorized - No autenticado o credenciales inválidas |
| 403 | Forbidden - No tiene permiso |
| 404 | Not Found - Recurso no encontrado |
| 500 | Server Error - Error interno del servidor |

---

## 🧪 TESTING

Ver archivo `TESTING_ENDPOINTS.md` para guías completas de testing.

