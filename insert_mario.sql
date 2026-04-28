
-- Insertar usuario MARIO si no existe
USE colgo_db;

DELETE FROM usuarios WHERE email = 'mario@colgo.edu';

INSERT INTO usuarios (email, password_hash, rol, activo, cambiar_password) 
VALUES (
  'mario@colgo.edu',
  '$2a$10$X/oP7Tsl8X8UF3SHlf9YLeBbVKMAF/hqb5x3pJCv5KhAJ2T1/eqhe',
  'admin',
  1,
  0
);

-- Verificar
SELECT id, email, rol, activo FROM usuarios WHERE email = 'mario@colgo.edu';
