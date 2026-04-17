// ============================================================================
// Rutas API Express para COLGO
// Archivo: src/server/routes.ts
// 
// Ejemplo de cómo estructurar tus endpoints para conectar con la BD
// ============================================================================

import express, { type Request, type Response } from 'express';
import {
  StudentAPI,
  CourseAPI,
  EnrollmentAPI,
  PaymentAPI,
  LocationAPI,
  ActivityAPI,
} from './db';

const router = express.Router();

// Función auxiliar para manejo de errores
type AsyncHandler = (req: Request, res: Response, next: () => void) => Promise<void>;
const asyncHandler = (fn: AsyncHandler) => (req: Request, res: Response, next: () => void) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ============================================================================
// RUTAS - ESTUDIANTES
// ============================================================================

// GET /api/students - Obtener todos los estudiantes
router.get('/students', asyncHandler(async (_req: Request, res: Response) => {
  const students = await StudentAPI.getAll();
  res.json(students);
}));

// GET /api/students/:id - Obtener un estudiante por ID
router.get('/students/:id', asyncHandler(async (req: Request, res: Response) => {
  const student = await StudentAPI.getWithDetails(req.params.id);
  if (!student) {
    res.status(404).json({ error: 'Estudiante no encontrado' });
    return;
  }
  res.json(student);
}));

// POST /api/students - Crear nuevo estudiante
router.post('/students', asyncHandler(async (req: Request, res: Response) => {
  const { id, name, document, status, sede_id, email, phone } = req.body;

  // Validación básica
  if (!id || !name || !document) {
    res.status(400).json({ error: 'Campos requeridos: id, name, document' });
    return;
  }

  await StudentAPI.create({ id, name, document, status, sede_id, email, phone });
  res.status(201).json({ message: 'Estudiante creado', id });
}));

// PUT /api/students/:id/status - Actualizar estado del estudiante
router.put('/students/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  if (!status || !['Activo', 'Pendiente', 'Inactivo'].includes(status)) {
    res.status(400).json({ error: 'Estado inválido' });
    return;
  }

  await StudentAPI.updateStatus(req.params.id, status);
  res.json({ message: 'Estado actualizado', status });
}));

// GET /api/locations/:sedeId/students - Obtener estudiantes por sede
router.get('/locations/:sedeId/students', asyncHandler(async (req: Request, res: Response) => {
  const students = await StudentAPI.getByLocation(req.params.sedeId);
  res.json(students);
}));

// ============================================================================
// RUTAS - CURSOS
// ============================================================================

// GET /api/courses - Obtener todos los cursos
router.get('/courses', asyncHandler(async (_req: Request, res: Response) => {
  const courses = await CourseAPI.getAll();
  res.json(courses);
}));

// GET /api/courses/stats - Obtener cursos con estadísticas
router.get('/courses/stats', asyncHandler(async (_req: Request, res: Response) => {
  const courses = await CourseAPI.getWithStats();
  res.json(courses);
}));

// GET /api/courses/:id - Obtener un curso por ID
router.get('/courses/:id', asyncHandler(async (req: Request, res: Response) => {
  const course = await CourseAPI.getWithStats(req.params.id);
  if (!course) {
    res.status(404).json({ error: 'Curso no encontrado' });
    return;
  }
  res.json(course);
}));

// POST /api/courses - Crear nuevo curso
router.post('/courses', asyncHandler(async (req: Request, res: Response) => {
  const { id, title, modality, level, duration_weeks, weekly_hours, description, color } = req.body;

  if (!id || !title || !modality || !level || !duration_weeks || weekly_hours === undefined) {
    res.status(400).json({ error: 'Campos requeridos incompletos' });
    return;
  }

  await CourseAPI.create({ id, title, modality, level, duration_weeks, weekly_hours, description, color });
  res.status(201).json({ message: 'Curso creado', id });
}));

// GET /api/locations/:sedeId/courses - Obtener cursos por sede
router.get('/locations/:sedeId/courses', asyncHandler(async (req: Request, res: Response) => {
  const courses = await CourseAPI.getByLocation(req.params.sedeId);
  res.json(courses);
}));

// ============================================================================
// RUTAS - MATRÍCULAS
// ============================================================================

// GET /api/enrollments - Obtener todas las matrículas
router.get('/enrollments', asyncHandler(async (_req: Request, res: Response) => {
  const enrollments = await EnrollmentAPI.getAll();
  res.json(enrollments);
}));

// GET /api/enrollments/:id - Obtener una matrícula por ID
router.get('/enrollments/:id', asyncHandler(async (req: Request, res: Response) => {
  const enrollment = await EnrollmentAPI.getById(req.params.id);
  if (!enrollment) {
    res.status(404).json({ error: 'Matrícula no encontrada' });
    return;
  }
  res.json(enrollment);
}));

// POST /api/enrollments - Crear nueva matrícula
router.post('/enrollments', asyncHandler(async (req: Request, res: Response) => {
  const { id, student_id, course_id, start_date, status } = req.body;

  if (!id || !student_id || !course_id || !start_date) {
    res.status(400).json({ error: 'Campos requeridos: id, student_id, course_id, start_date' });
    return;
  }

  await EnrollmentAPI.create({ id, student_id, course_id, start_date, status: status || 'Pendiente' });
  res.status(201).json({ message: 'Matrícula creada', id });
}));

// PUT /api/enrollments/:id/status - Actualizar estado de matrícula
router.put('/enrollments/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  if (!status || !['Activa', 'Pendiente', 'Cancelada'].includes(status)) {
    res.status(400).json({ error: 'Estado inválido' });
    return;
  }

  await EnrollmentAPI.updateStatus(req.params.id, status);
  res.json({ message: 'Estado de matrícula actualizado', status });
}));

// GET /api/students/:studentId/enrollments - Obtener matrículas de un estudiante
router.get('/students/:studentId/enrollments', asyncHandler(async (req: Request, res: Response) => {
  const enrollments = await EnrollmentAPI.getByStudent(req.params.studentId);
  res.json(enrollments);
}));

// ============================================================================
// RUTAS - PAGOS
// ============================================================================

// GET /api/payments - Obtener todos los pagos
router.get('/payments', asyncHandler(async (_req: Request, res: Response) => {
  const payments = await PaymentAPI.getAll();
  res.json(payments);
}));

// GET /api/payments/revenue - Obtener ingresos totales
router.get('/payments/revenue', asyncHandler(async (_req: Request, res: Response) => {
  const revenue = await PaymentAPI.getTotalRevenue();
  res.json(revenue);
}));

// GET /api/payments/:id - Obtener un pago por ID
router.get('/payments/:id', asyncHandler(async (req: Request, res: Response) => {
  const payment = await PaymentAPI.getById(req.params.id);
  if (!payment) {
    res.status(404).json({ error: 'Pago no encontrado' });
    return;
  }
  res.json(payment);
}));

// POST /api/payments - Crear nuevo pago
router.post('/payments', asyncHandler(async (req: Request, res: Response) => {
  const { id, student_id, course_id, enrollment_id, amount, payment_date, status, payment_method, notes } = req.body;

  if (!id || !student_id || !course_id || !amount || !payment_date) {
    res.status(400).json({ error: 'Campos requeridos incompletos' });
    return;
  }

  await PaymentAPI.create({
    id,
    student_id,
    course_id,
    enrollment_id,
    amount,
    payment_date,
    status: status || 'Pendiente',
    payment_method,
    notes,
  });
  res.status(201).json({ message: 'Pago registrado', id });
}));

// PUT /api/payments/:id/status - Actualizar estado de pago
router.put('/payments/:id/status', asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  if (!status || !['Pendiente', 'Aprobado', 'Rechazado'].includes(status)) {
    res.status(400).json({ error: 'Estado inválido' });
    return;
  }

  await PaymentAPI.updateStatus(req.params.id, status);
  res.json({ message: 'Estado de pago actualizado', status });
}));

// GET /api/students/:studentId/payments - Obtener pagos de un estudiante
router.get('/students/:studentId/payments', asyncHandler(async (req: Request, res: Response) => {
  const payments = await PaymentAPI.getByStudent(req.params.studentId);
  res.json(payments);
}));

// ============================================================================
// RUTAS - SEDES
// ============================================================================

// GET /api/locations - Obtener todas las sedes
router.get('/locations', asyncHandler(async (_req: Request, res: Response) => {
  const locations = await LocationAPI.getAll();
  res.json(locations);
}));

// GET /api/locations/stats - Obtener sedes con estadísticas
router.get('/locations/stats', asyncHandler(async (_req: Request, res: Response) => {
  const stats = await LocationAPI.getStats();
  res.json(stats);
}));

// GET /api/locations/:id - Obtener una sede por ID
router.get('/locations/:id', asyncHandler(async (req: Request, res: Response) => {
  const location = await LocationAPI.getStats(req.params.id);
  if (!location) {
    res.status(404).json({ error: 'Sede no encontrada' });
    return;
  }
  res.json(location);
}));

// ============================================================================
// RUTAS - ACTIVIDAD RECIENTE
// ============================================================================

// GET /api/activity - Obtener actividad reciente
router.get('/activity', asyncHandler(async (req: Request, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 50;
  const activity = await ActivityAPI.getRecent(limit);
  res.json(activity);
}));

// ============================================================================
// MANEJO DE ERRORES
// ============================================================================

router.use((err: Error, _req: Request, res: Response) => {
  // console.error('Error:', err); // Comentado para producción
  res.status(500).json({
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

export default router;
