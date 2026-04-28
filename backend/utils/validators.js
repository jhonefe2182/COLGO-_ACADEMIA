import { body, query, param, validationResult } from 'express-validator';

/**
 * Validadores para Estudiantes
 */
export const validateCreateStudent = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('Nombre requerido')
    .isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('apellido')
    .trim()
    .notEmpty().withMessage('Apellido requerido')
    .isLength({ min: 2 }).withMessage('Apellido debe tener al menos 2 caracteres'),
  body('email')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),
  body('documento')
    .optional()
    .trim()
    .isLength({ min: 5 }).withMessage('Documento inválido'),
  body('fecha_nacimiento')
    .optional()
    .isISO8601().withMessage('Fecha de nacimiento inválida'),
  body('telefono')
    .optional()
    .trim()
    .isLength({ min: 7 }).withMessage('Teléfono inválido'),
];

export const validateUpdateStudent = [
  param('id').isInt().withMessage('ID inválido'),
  body('nombre').optional().trim().isLength({ min: 2 }),
  body('apellido').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('documento').optional().trim(),
  body('telefono').optional().trim(),
];

/**
 * Validadores para Docentes
 */
export const validateCreateTeacher = [
  body('nombre').trim().notEmpty().withMessage('Nombre requerido'),
  body('apellido').trim().notEmpty().withMessage('Apellido requerido'),
  body('email').isEmail().withMessage('Email inválido').normalizeEmail(),
  body('especialidad').optional().trim(),
  body('documento').optional().trim(),
];

/**
 * Validadores para Cursos
 */
export const validateCreateCourse = [
  body('nombre').trim().notEmpty().withMessage('Nombre del curso requerido'),
  body('codigo').trim().notEmpty().withMessage('Código requerido'),
  body('descripcion').optional().trim(),
  body('docente_id').optional().isInt(),
  body('creditos').optional().isInt({ min: 1, max: 5 }),
  body('capacidad').optional().isInt({ min: 1, max: 100 }),
  body('semestre').optional().isInt({ min: 1, max: 10 }),
];

/**
 * Validadores para Matrículas
 */
export const validateEnrollment = [
  body('estudiante_id').isInt().withMessage('ID de estudiante requerido'),
  body('curso_id').isInt().withMessage('ID de curso requerido'),
];

/**
 * Validadores para Calificaciones
 */
export const validateGrade = [
  body('matricula_id').isInt().withMessage('ID de matrícula requerido'),
  body('evaluacion_numero').isInt({ min: 1 }).withMessage('Número de evaluación inválido'),
  body('nota').isFloat({ min: 0, max: 5 }).withMessage('Nota debe estar entre 0 y 5'),
];

/**
 * Validadores para Login
 */
export const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('Usuario o email requerido')
    .custom((value) => {
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      const isUsername = /^[a-zA-Z0-9_]{2,}$/.test(value);
      // Cédula / documento: números y separadores comunes
      const isDocumento = /^[0-9][0-9.\-]{3,29}$/.test(value);
      if (!isEmail && !isUsername && !isDocumento) {
        throw new Error('Formato inválido: ingresa correo, usuario o cédula');
      }
      return true;
    }),
  body('password').notEmpty().withMessage('Contraseña requerida'),
];

/**
 * Middleware para manejar errores de validación
 */
export function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validación fallida',
      details: errors.array()
    });
  }
  next();
}
