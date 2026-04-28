import express from 'express';
import { query } from '../db.js';
import { authorizeRole } from '../middleware/auth.js';
import { validateEnrollment, handleValidationErrors } from '../utils/validators.js';
import { sendEnrollmentNotificationEmail } from '../utils/emailService.js';

const router = express.Router();

/**
 * POST /api/matriculas/crear
 * Crear matrícula (solo admin)
 */
router.post('/crear', validateEnrollment, handleValidationErrors, authorizeRole('admin'), async (req, res) => {
  try {
    const { estudiante_id, curso_id } = req.body;

    // Verificar que la matrícula no exista
    const matriculasExistentes = await query(
      'SELECT id FROM matriculas WHERE estudiante_id = ? AND curso_id = ?',
      [estudiante_id, curso_id]
    );

    if (matriculasExistentes.length > 0) {
      return res.status(400).json({ error: 'El estudiante ya está matriculado en este curso' });
    }

    // Obtener información del curso
    const cursos = await query(
      'SELECT nombre, capacidad, docente_id FROM cursos WHERE id = ?',
      [curso_id]
    );

    if (cursos.length === 0) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    const curso = cursos[0];

    // Verificar capacidad del curso
    const matriculasEnCurso = await query(
      'SELECT COUNT(*) as total FROM matriculas WHERE curso_id = ? AND estado = "activa"',
      [curso_id]
    );

    if (matriculasEnCurso[0].total >= curso.capacidad) {
      return res.status(400).json({ error: 'El curso está lleno' });
    }

    // Obtener datos del estudiante
    const estudiantes = await query(
      'SELECT e.nombre, e.apellido, u.email FROM estudiantes e JOIN usuarios u ON e.usuario_id = u.id WHERE e.id = ?',
      [estudiante_id]
    );

    if (estudiantes.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    const estudiante = estudiantes[0];

    // Obtener nombre del docente si existe
    let nombreDocente = 'Por definir';
    if (curso.docente_id) {
      const docentes = await query(
        'SELECT CONCAT(nombre, " ", apellido) as nombre_completo FROM docentes WHERE id = ?',
        [curso.docente_id]
      );
      if (docentes.length > 0) {
        nombreDocente = docentes[0].nombre_completo;
      }
    }

    // Crear matrícula
    const resultado = await query(
      'INSERT INTO matriculas (estudiante_id, curso_id, estado) VALUES (?, ?, ?)',
      [estudiante_id, curso_id, 'activa']
    );

    // Enviar email de notificación de matrícula
    await sendEnrollmentNotificationEmail(
      estudiante.email,
      `${estudiante.nombre} ${estudiante.apellido}`,
      curso.nombre,
      nombreDocente
    );

    res.status(201).json({
      success: true,
      message: 'Matrícula creada exitosamente y notificación enviada',
      id: resultado.insertId,
      estudiante: estudiante.email
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al crear matrícula' });
  }
});

/**
 * GET /api/matriculas/listar
 * Listar todas las matrículas (solo admin)
 */
router.get('/listar', authorizeRole('admin'), async (req, res) => {
  try {
    const matriculas = await query(`
      SELECT m.id, m.fecha_matricula, m.estado, m.calificacion_final,
             CONCAT(e.nombre, ' ', e.apellido) as estudiante,
             c.nombre as curso, c.codigo
      FROM matriculas m
      JOIN estudiantes e ON m.estudiante_id = e.id
      JOIN cursos c ON m.curso_id = c.id
      ORDER BY m.fecha_matricula DESC
    `);

    res.json(matriculas);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener matrículas' });
  }
});

/**
 * GET /api/matriculas/estudiante/:estudianteId
 * Obtener matrículas de un estudiante (admin o el mismo estudiante)
 */
router.get('/estudiante/:estudianteId', async (req, res) => {
  try {
    // Verificar permisos
    if (req.user.rol === 'estudiante') {
      const estudiantes = await query(
        'SELECT id FROM estudiantes WHERE usuario_id = ?',
        [req.user.id]
      );

      if (estudiantes.length === 0 || estudiantes[0].id != req.params.estudianteId) {
        return res.status(403).json({ error: 'No tienes permiso para ver estas matrículas' });
      }
    }

    const matriculas = await query(`
      SELECT m.id, m.fecha_matricula, m.estado, m.calificacion_final,
             c.nombre, c.codigo, c.descripcion, c.creditos
      FROM matriculas m
      JOIN cursos c ON m.curso_id = c.id
      WHERE m.estudiante_id = ?
      ORDER BY m.fecha_matricula DESC
    `, [req.params.estudianteId]);

    res.json(matriculas);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al obtener matrículas' });
  }
});

/**
 * DELETE /api/matriculas/:id
 * Cancelar matrícula (solo admin)
 */
router.delete('/:id', authorizeRole('admin'), async (req, res) => {
  try {
    const resultado = await query(
      'UPDATE matriculas SET estado = ? WHERE id = ?',
      ['cancelada', req.params.id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Matrícula no encontrada' });
    }

    res.json({ success: true, message: 'Matrícula cancelada' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al cancelar matrícula' });
  }
});

/**
 * POST /api/matriculas/:id/generar-certificado
 * Generar certificado de un curso completado (admin)
 */
router.post('/:id/generar-certificado', authorizeRole('admin'), async (req, res) => {
  try {
    // Obtener datos de la matrícula
    const matriculas = await query(
      'SELECT * FROM matriculas WHERE id = ?',
      [req.params.id]
    );

    if (matriculas.length === 0) {
      return res.status(404).json({ error: 'Matrícula no encontrada' });
    }

    const matricula = matriculas[0];

    // Verificar que la matrícula esté completada
    if (matricula.estado !== 'completada' || !matricula.calificacion_final) {
      return res.status(400).json({ error: 'La matrícula debe estar completada con calificación final' });
    }

    // Generar número de certificado único
    const numeroCertificado = `CERT-${Date.now()}-${matricula.id}`;

    // Crear certificado
    const resultado = await query(
      'INSERT INTO certificados (matricula_id, numero_certificado, fecha_emision) VALUES (?, ?, NOW())',
      [req.params.id, numeroCertificado]
    );

    res.json({
      success: true,
      message: 'Certificado generado',
      numero_certificado: numeroCertificado,
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error al generar certificado' });
  }
});

/**
 * Función auxiliar: Enviar email con credenciales
 */
async function enviarCredenciales(email, usuario, contraseña, nombreEstudiante) {
  try {
    const htmlContent = `
      <html>
        <body style="font-family: Arial, sans-serif;">
          <h2>¡Bienvenido a COLGO!</h2>
          <p>Hola <strong>${nombreEstudiante}</strong>,</p>
          <p>Has sido matriculado exitosamente en la plataforma académica. Aquí están tus credenciales de acceso:</p>
          <table style="border-collapse: collapse; width: 100%; margin: 20px 0;">
            <tr style="background-color: #f2f2f2;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Usuario:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;">${usuario}</td>
            </tr>
            <tr style="background-color: #f2f2f2;">
              <td style="padding: 10px; border: 1px solid #ddd;"><strong>Contraseña Temporal:</strong></td>
              <td style="padding: 10px; border: 1px solid #ddd;"><code>${contraseña}</code></td>
            </tr>
          </table>
          <p><strong style="color: red;">IMPORTANTE:</strong> Debes cambiar esta contraseña al primer login por tu propia seguridad.</p>
          <p><a href="http://localhost:5173/login" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Ir a Login</a></p>
          <p>Si tienes problemas, contacta a soporte@colgo.edu</p>
          <hr>
          <p><em>Este es un correo automático, no respondas directamente.</em></p>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@colgo.edu',
      to: email,
      subject: '🎓 Bienvenido a COLGO - Tus credenciales de acceso',
      html: htmlContent
    });

    console.log(`✓ Email enviado a ${email}`);
    return true;
  } catch (error) {
    console.error('Error al enviar email:', error);
    return false;
  }
}

export default router;
