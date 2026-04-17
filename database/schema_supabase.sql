-- ============================================================================
-- Base de datos COLGO - Sistema de Gestión Académica SaaS
-- Adaptado para Supabase (PostgreSQL)
-- ============================================================================

-- Crear tipos personalizados para ENUM
CREATE TYPE modality_type AS ENUM ('Presencial', 'Virtual');
CREATE TYPE level_type AS ENUM ('Básico', 'Intermedio', 'Avanzado');
CREATE TYPE student_status AS ENUM ('Activo', 'Pendiente', 'Inactivo');
CREATE TYPE enrollment_status AS ENUM ('Activa', 'Pendiente', 'Cancelada');
CREATE TYPE payment_status AS ENUM ('Pendiente', 'Aprobado', 'Rechazado');
CREATE TYPE activity_kind AS ENUM ('Matrícula', 'Pago', 'Curso', 'Sede', 'Estudiante');

-- ============================================================================
-- TABLA: sedes (Ubicaciones/Sedes)
-- ============================================================================
CREATE TABLE sedes (
  id VARCHAR(50) PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TABLA: courses (Cursos)
-- ============================================================================
CREATE TABLE courses (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  modality modality_type NOT NULL,
  level level_type NOT NULL,
  duration_weeks INTEGER NOT NULL,
  weekly_hours INTEGER NOT NULL,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- TABLA: course_locations (Relación Cursos - Sedes)
-- ============================================================================
CREATE TABLE course_locations (
  id SERIAL PRIMARY KEY,
  course_id VARCHAR(50) NOT NULL,
  sede_id VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE CASCADE,
  UNIQUE (course_id, sede_id)
);

-- ============================================================================
-- TABLA: students (Estudiantes)
-- ============================================================================
CREATE TABLE students (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  document VARCHAR(50) NOT NULL UNIQUE,
  status student_status DEFAULT 'Pendiente',
  sede_id VARCHAR(50),
  email VARCHAR(255),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (sede_id) REFERENCES sedes(id) ON DELETE SET NULL
);

-- ============================================================================
-- TABLA: enrollments (Matrículas)
-- ============================================================================
CREATE TABLE enrollments (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  course_id VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status enrollment_status DEFAULT 'Pendiente',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- ============================================================================
-- TABLA: payments (Pagos)
-- ============================================================================
CREATE TABLE payments (
  id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  course_id VARCHAR(50) NOT NULL,
  enrollment_id VARCHAR(50),
  amount DECIMAL(10, 2) NOT NULL,
  payment_date DATE NOT NULL,
  status payment_status DEFAULT 'Pendiente',
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE SET NULL
);

-- ============================================================================
-- TABLA: recent_activity (Actividad Reciente)
-- ============================================================================
CREATE TABLE recent_activity (
  id VARCHAR(50) PRIMARY KEY,
  kind activity_kind NOT NULL,
  title VARCHAR(255) NOT NULL,
  detail TEXT,
  student_id VARCHAR(50),
  course_id VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE SET NULL,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- ============================================================================
-- ÍNDICES
-- ============================================================================
CREATE INDEX idx_courses_title ON courses (title);
CREATE INDEX idx_courses_modality ON courses (modality);
CREATE INDEX idx_courses_level ON courses (level);

CREATE INDEX idx_course_locations_course_id ON course_locations (course_id);
CREATE INDEX idx_course_locations_sede_id ON course_locations (sede_id);

CREATE INDEX idx_students_document ON students (document);
CREATE INDEX idx_students_name ON students (name);
CREATE INDEX idx_students_status ON students (status);
CREATE INDEX idx_students_sede_id ON students (sede_id);

CREATE INDEX idx_enrollments_student_id ON enrollments (student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments (course_id);
CREATE INDEX idx_enrollments_status ON enrollments (status);
CREATE INDEX idx_enrollments_dates ON enrollments (start_date, end_date);

CREATE INDEX idx_payments_student_id ON payments (student_id);
CREATE INDEX idx_payments_course_id ON payments (course_id);
CREATE INDEX idx_payments_status ON payments (status);
CREATE INDEX idx_payments_payment_date ON payments (payment_date);

CREATE INDEX idx_recent_activity_kind ON recent_activity (kind);
CREATE INDEX idx_recent_activity_created_at ON recent_activity (created_at);
CREATE INDEX idx_recent_activity_student_id ON recent_activity (student_id);
CREATE INDEX idx_recent_activity_course_id ON recent_activity (course_id);

-- ============================================================================
-- TRIGGER PARA updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sedes_updated_at BEFORE UPDATE ON sedes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_enrollments_updated_at BEFORE UPDATE ON enrollments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- INSERTAR DATOS INICIALES: SEDES
-- ============================================================================
INSERT INTO sedes (id, city, address, phone, color) VALUES
('sed_001', 'Medellín', 'Cll 10 #5-50, Medellín', '(4) 2123456', '#fbbf24'),
('sed_002', 'Bogotá', 'Cra 7 #24-89, Bogotá', '(1) 7654321', '#f59e0b'),
('sed_003', 'Virtual', 'Plataforma Virtual', '(1) 8000000', '#3b82f6');

-- ============================================================================
-- INSERTAR DATOS INICIALES: CURSOS
-- ============================================================================
INSERT INTO courses (id, title, modality, level, duration_weeks, weekly_hours, description, color) VALUES
('crs_001', 'Corte y Confección Básico', 'Presencial', 'Básico', 8, 6, 'Domina el proceso completo: patrones, costura y acabado con acompañamiento experto.', '#fbbf24'),
('crs_002', 'Patronaje para Iniciantes', 'Virtual', 'Básico', 6, 4, 'Aprende a construir patrones base y ajustarlos con técnicas claras y ejercicios guiados.', '#f59e0b'),
('crs_003', 'Confección de Blusas', 'Presencial', 'Intermedio', 7, 5, 'De la medida al resultado: frunces, cierres, cuellos y acabados profesionales.', '#fbbf24'),
('crs_004', 'Moda Sostenible', 'Virtual', 'Intermedio', 5, 3, 'Transforma prendas con enfoque en materiales y técnicas de bajo impacto.', '#f59e0b'),
('crs_005', 'Patronaje Avanzado', 'Presencial', 'Avanzado', 9, 6, 'Modelaje avanzado, tallaje y ajustes para lograr fit perfecto en cada proyecto.', '#fbbf24'),
('crs_006', 'Confección de Pantalones', 'Virtual', 'Avanzado', 8, 4, 'Construcción de patrones, vistas, pretinas y terminaciones con alta precisión.', '#f59e0b');

-- ============================================================================
-- INSERTAR DATOS INICIALES: RELACIÓN CURSOS - SEDES
-- ============================================================================
INSERT INTO course_locations (course_id, sede_id) VALUES
('crs_001', 'sed_001'),
('crs_003', 'sed_001'),
('crs_005', 'sed_001'),
('crs_002', 'sed_002'),
('crs_004', 'sed_002'),
('crs_006', 'sed_002'),
('crs_002', 'sed_003'),
('crs_004', 'sed_003'),
('crs_006', 'sed_003');

-- ============================================================================
-- INSERTAR DATOS INICIALES: ESTUDIANTES
-- ============================================================================
INSERT INTO students (id, name, document, status, sede_id, created_at) VALUES
('stu_001', 'Mariana Gómez', '1.045.238.771', 'Activo', 'sed_001', NOW()),
('stu_002', 'Sofía Ríos', '1.109.882.314', 'Pendiente', 'sed_002', NOW()),
('stu_003', 'Daniela Herrera', '1.021.773.509', 'Activo', 'sed_003', NOW()),
('stu_004', 'Valentina Vargas', '1.096.341.018', 'Inactivo', 'sed_001', NOW()),
('stu_005', 'Paola Martínez', '1.145.992.660', 'Activo', 'sed_002', NOW()),
('stu_006', 'Camila Álvarez', '1.018.244.991', 'Pendiente', 'sed_003', NOW()),
('stu_007', 'Andrea Molina', '1.082.990.122', 'Activo', 'sed_001', NOW()),
('stu_008', 'Laura Duarte', '1.061.332.778', 'Inactivo', 'sed_002', NOW());

-- ============================================================================
-- INSERTAR DATOS INICIALES: MATRÍCULAS
-- ============================================================================
INSERT INTO enrollments (id, student_id, course_id, start_date, status, created_at) VALUES
('enr_001', 'stu_001', 'crs_001', CURRENT_DATE - INTERVAL '15 days', 'Activa', NOW()),
('enr_002', 'stu_002', 'crs_002', CURRENT_DATE - INTERVAL '30 days', 'Pendiente', NOW()),
('enr_003', 'stu_003', 'crs_004', CURRENT_DATE - INTERVAL '10 days', 'Activa', NOW()),
('enr_004', 'stu_004', 'crs_001', CURRENT_DATE - INTERVAL '60 days', 'Cancelada', NOW()),
('enr_005', 'stu_005', 'crs_003', CURRENT_DATE - INTERVAL '20 days', 'Activa', NOW()),
('enr_006', 'stu_006', 'crs_006', CURRENT_DATE - INTERVAL '5 days', 'Pendiente', NOW()),
('enr_007', 'stu_007', 'crs_005', CURRENT_DATE - INTERVAL '25 days', 'Activa', NOW()),
('enr_008', 'stu_008', 'crs_002', CURRENT_DATE - INTERVAL '90 days', 'Cancelada', NOW());

-- ============================================================================
-- INSERTAR DATOS INICIALES: PAGOS
-- ============================================================================
INSERT INTO payments (id, student_id, course_id, enrollment_id, amount, payment_date, status, payment_method, notes, created_at) VALUES
('pay_001', 'stu_001', 'crs_001', 'enr_001', 450000.00, CURRENT_DATE - INTERVAL '15 days', 'Aprobado', 'Transferencia', 'Pago completo del curso', NOW()),
('pay_002', 'stu_002', 'crs_002', 'enr_002', 320000.00, CURRENT_DATE - INTERVAL '30 days', 'Pendiente', 'Efectivo', 'Pago parcial', NOW()),
('pay_003', 'stu_003', 'crs_004', 'enr_003', 280000.00, CURRENT_DATE - INTERVAL '10 days', 'Aprobado', 'Tarjeta', 'Descuento aplicado', NOW()),
('pay_004', 'stu_004', 'crs_001', 'enr_004', 450000.00, CURRENT_DATE - INTERVAL '60 days', 'Rechazado', 'Transferencia', 'Fondos insuficientes', NOW()),
('pay_005', 'stu_005', 'crs_003', 'enr_005', 380000.00, CURRENT_DATE - INTERVAL '20 days', 'Aprobado', 'Efectivo', 'Pago en sede', NOW()),
('pay_006', 'stu_006', 'crs_006', 'enr_006', 520000.00, CURRENT_DATE - INTERVAL '5 days', 'Pendiente', 'Tarjeta', 'Procesando', NOW()),
('pay_007', 'stu_007', 'crs_005', 'enr_007', 600000.00, CURRENT_DATE - INTERVAL '25 days', 'Aprobado', 'Transferencia', 'Pago completo', NOW()),
('pay_008', 'stu_008', 'crs_002', 'enr_008', 320000.00, CURRENT_DATE - INTERVAL '90 days', 'Rechazado', 'Efectivo', 'Cancelado por estudiante', NOW());

-- ============================================================================
-- INSERTAR DATOS INICIALES: ACTIVIDAD RECIENTE
-- ============================================================================
INSERT INTO recent_activity (id, kind, title, detail, student_id, course_id, created_at) VALUES
('act_001', 'Matrícula', 'Nueva matrícula', 'Mariana Gómez se matriculó en Corte y Confección Básico', 'stu_001', 'crs_001', NOW()),
('act_002', 'Pago', 'Pago aprobado', 'Pago de $450,000 aprobado para Mariana Gómez', 'stu_001', 'crs_001', NOW()),
('act_003', 'Matrícula', 'Nueva matrícula', 'Sofía Ríos se matriculó en Patronaje para Iniciantes', 'stu_002', 'crs_002', NOW()),
('act_004', 'Pago', 'Pago pendiente', 'Pago de $320,000 pendiente para Sofía Ríos', 'stu_002', 'crs_002', NOW()),
('act_005', 'Matrícula', 'Nueva matrícula', 'Daniela Herrera se matriculó en Moda Sostenible', 'stu_003', 'crs_004', NOW()),
('act_006', 'Pago', 'Pago aprobado', 'Pago de $280,000 aprobado para Daniela Herrera', 'stu_003', 'crs_004', NOW()),
('act_007', 'Matrícula', 'Nueva matrícula', 'Paola Martínez se matriculó en Confección de Blusas', 'stu_005', 'crs_003', NOW()),
('act_008', 'Pago', 'Pago aprobado', 'Pago de $380,000 aprobado para Paola Martínez', 'stu_005', 'crs_003', NOW()),
('act_009', 'Matrícula', 'Nueva matrícula', 'Andrea Molina se matriculó en Patronaje Avanzado', 'stu_007', 'crs_005', NOW()),
('act_010', 'Pago', 'Pago aprobado', 'Pago de $600,000 aprobado para Andrea Molina', 'stu_007', 'crs_005', NOW());