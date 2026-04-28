CREATE TABLE IF NOT EXISTS modulos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  titulo VARCHAR(180) NOT NULL,
  descripcion TEXT,
  orden INT NOT NULL DEFAULT 1,
  activo BOOLEAN DEFAULT TRUE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_modulo_orden (curso_id, orden),
  INDEX idx_modulo_curso (curso_id)
);

CREATE TABLE IF NOT EXISTS clases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  curso_id INT NOT NULL,
  modulo_id INT NULL,
  docente_id INT NOT NULL,
  titulo VARCHAR(180) NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  tipo ENUM('virtual', 'presencial') NOT NULL,
  enlace_virtual VARCHAR(500) NULL,
  ubicacion VARCHAR(255) NULL,
  estado ENUM('programada', 'en_curso', 'finalizada', 'cancelada') DEFAULT 'programada',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_clases_curso_fecha (curso_id, fecha),
  INDEX idx_clases_docente_fecha (docente_id, fecha)
);

CREATE TABLE IF NOT EXISTS materiales_modulo (
  id INT AUTO_INCREMENT PRIMARY KEY,
  modulo_id INT NOT NULL,
  docente_id INT NOT NULL,
  titulo VARCHAR(180) NOT NULL,
  descripcion TEXT,
  url VARCHAR(500) NOT NULL,
  tipo ENUM('video', 'documento', 'enlace', 'otro') DEFAULT 'enlace',
  fecha_publicacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_material_modulo (modulo_id)
);

CREATE TABLE IF NOT EXISTS asistencias_clase (
  id INT AUTO_INCREMENT PRIMARY KEY,
  clase_id INT NOT NULL,
  estudiante_id INT NOT NULL,
  estado ENUM('presente', 'ausente', 'tarde', 'justificado') NOT NULL DEFAULT 'presente',
  observacion VARCHAR(255),
  fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_asistencia (clase_id, estudiante_id),
  INDEX idx_asistencia_clase (clase_id),
  INDEX idx_asistencia_estudiante (estudiante_id)
);

CREATE TABLE IF NOT EXISTS notificaciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  tipo VARCHAR(80) NOT NULL,
  titulo VARCHAR(180) NOT NULL,
  mensaje TEXT NOT NULL,
  entidad_tipo VARCHAR(80),
  entidad_id INT,
  leida BOOLEAN DEFAULT FALSE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_usuario_fecha (usuario_id, fecha_creacion),
  INDEX idx_notif_usuario_leida (usuario_id, leida)
);

CREATE TABLE IF NOT EXISTS pagos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  monto DECIMAL(12,2) NOT NULL DEFAULT 0,
  estado VARCHAR(50) NOT NULL DEFAULT 'pendiente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
