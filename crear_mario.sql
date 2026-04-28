-- CREAR USUARIO MARIO CON CONTRASEÑA 123
USE colgo_db;

-- Limpiar si existe
DELETE FROM usuarios WHERE email = 'mario@colgo.edu';

-- Crear usuario MARIO
-- La contraseña hasheada es: 123
-- Hash: $2a$10$X/oP7Tsl8X8UF3SHlf9YLeBbVKMAF/hqb5x3pJCv5KhAJ2T1/eqhe
INSERT INTO usuarios (email, password_hash, rol, activo, cambiar_password) 
VALUES ('mario@colgo.edu', '$2a$10$X/oP7Tsl8X8UF3SHlf9YLeBbVKMAF/hqb5x3pJCv5KhAJ2T1/eqhe', 'admin', 1, 0);

-- Verificar
SELECT id, email, rol FROM usuarios;
