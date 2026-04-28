-- ===============================================
-- DATOS DE PRUEBA PARA COLGO
-- ===============================================

USE colgo_db;

-- 1. LIMPIAR DATOS ANTERIORES (opcional)
-- DELETE FROM usuarios;
-- DELETE FROM estudiantes;
-- DELETE FROM docentes;

-- 2. CREAR USUARIOS

-- Admin (contraseña: admin123)
INSERT INTO usuarios (email, password_hash, rol, activo, cambiar_password) VALUES
('admin@colgo.edu', '$2a$10$slYQmyNdGzin0rdAHF.remedK8KwZaIv2l4R5.pK1BpP.t/LK2TO', 'admin', TRUE, FALSE);

-- Docente (contraseña: docente123)
INSERT INTO usuarios (email, password_hash, rol, activo, cambiar_password) VALUES
('docente@colgo.edu', '$2a$10$slYQmyNdGzin0rdAHF.remedK8KwZaIv2l4R5.pK1BpP.t/LK2TO', 'docente', TRUE, FALSE);

-- Estudiante (contraseña: estudiante123)
INSERT INTO usuarios (email, password_hash, rol, activo, cambiar_password) VALUES
('estudiante@colgo.edu', '$2a$10$slYQmyNdGzin0rdAHF.remedK8KwZaIv2l4R5.pK1BpP.t/LK2TO', 'estudiante', TRUE, FALSE);

-- 3. CREAR ESTUDIANTE
INSERT INTO estudiantes (usuario_id, nombre, apellido, documento, fecha_nacimiento, telefono, direccion, ciudad) VALUES
(3, 'Juan', 'Pérez', '1234567890', '2005-03-15', '3001234567', 'Calle 123', 'Bogotá');

-- 4. CREAR DOCENTE
INSERT INTO docentes (usuario_id, nombre, apellido, documento, especialidad, telefono) VALUES
(2, 'Carlos', 'García', '9876543210', 'Programación', '3007654321');

-- 5. CREAR CURSOS
INSERT INTO cursos (nombre, codigo, descripcion, docente_id, creditos, capacidad, semestre, activo) VALUES
('Programación en Python', 'PY101', 'Curso introductorio a Python', 1, 3, 30, 1, TRUE),
('Base de Datos SQL', 'BD101', 'Fundamentos de SQL y bases de datos', 1, 3, 25, 1, TRUE),
('Desarrollo Web con React', 'WEB101', 'Frontend con React y TypeScript', 1, 4, 20, 2, TRUE);

-- 6. CREAR HORARIOS
INSERT INTO horarios (curso_id, dia_semana, hora_inicio, hora_fin, sala) VALUES
(1, 'Lunes', '08:00', '10:00', 'Aula 101'),
(1, 'Miércoles', '08:00', '10:00', 'Aula 101'),
(2, 'Martes', '10:00', '12:00', 'Aula 102'),
(2, 'Jueves', '10:00', '12:00', 'Aula 102'),
(3, 'Lunes', '14:00', '16:00', 'Aula 103'),
(3, 'Viernes', '14:00', '16:00', 'Aula 103');

-- 7. CREAR MATRÍCULAS
INSERT INTO matriculas (estudiante_id, curso_id, estado) VALUES
(1, 1, 'activa'),
(1, 2, 'activa');

-- 8. CREAR NOTAS
INSERT INTO notas (matricula_id, evaluacion_numero, nota, descripcion, fecha_evaluacion) VALUES
(1, 1, 4.5, 'Primer parcial - Bien estructurado', '2026-04-10'),
(1, 2, 4.0, 'Taller en clase - Regular', '2026-04-15'),
(2, 1, 3.5, 'Primer parcial - Necesita mejorar', '2026-04-12');

-- 9. VER DATOS CREADOS
SELECT '=== USUARIOS CREADOS ===' as Info;
SELECT id, email, rol FROM usuarios;

SELECT '=== ESTUDIANTES CREADOS ===' as Info;
SELECT e.id, e.nombre, e.apellido, u.email FROM estudiantes e JOIN usuarios u ON e.usuario_id = u.id;

SELECT '=== DOCENTES CREADOS ===' as Info;
SELECT d.id, d.nombre, d.apellido, u.email FROM docentes d JOIN usuarios u ON d.usuario_id = u.id;

SELECT '=== CURSOS CREADOS ===' as Info;
SELECT id, nombre, codigo FROM cursos;

SELECT '=== MATRÍCULAS CREADAS ===' as Info;
SELECT m.id, CONCAT(e.nombre, ' ', e.apellido) as Estudiante, c.nombre as Curso, m.estado FROM matriculas m JOIN estudiantes e ON m.estudiante_id = e.id JOIN cursos c ON m.curso_id = c.id;
