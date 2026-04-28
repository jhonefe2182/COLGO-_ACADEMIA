USE colgo_db;

UPDATE usuarios 
SET password_hash = '$2a$10$/CTVhEOsT5E.tvXxUEJiV.w9RDCn6BY7WLU0jFaRzijMV5xcyS0k6' 
WHERE email = 'mario@colgo.edu';

-- Verificar
SELECT id, email, rol, activo FROM usuarios WHERE email = 'mario@colgo.edu';
