-- ============================================================================
-- Base de datos COLGO - Sistema de Gestión Académica SaaS
-- ============================================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS colgo_db;
USE colgo_db;

-- ============================================================================
-- TABLA: usuarios (Autenticación)
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'estudiante', 'docente') NOT NULL DEFAULT 'estudiante',
  activo BOOLEAN DEFAULT 1,
  cambiar_password BOOLEAN DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: sedes (Ubicaciones/Sedes)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sedes (
  id VARCHAR(50) PRIMARY KEY,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- TABLA: courses (Cursos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS courses (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL UNIQUE,
  modality ENUM('Presencial', 'Virtual') NOT NULL,
  level ENUM('Básico', 'Intermedio', 'Avanzado') NOT NULL,
  duration_weeks INT NOT NULL,
  weekly_hours INT NOT NULL,
  description TEXT,
  color VARCHAR(7),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_title (title),
  INDEX idx_modality (modality),
  INDEX idx_level (level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar usuario MARIO
INSERT IGNORE INTO usuarios (email, password_hash, rol, activo, cambiar_password) 
VALUES (
  'mario@colgo.edu',
  '$2a$10$X/oP7Tsl8X8UF3SHlf9YLeBbVKMAF/hqb5x3pJCv5KhAJ2T1/eqhe',
  'admin',
  1,
  0
);
