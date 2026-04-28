/**
 * Middleware para manejo global de errores
 */
export function errorHandler(err, req, res, next) {
  console.error('Error Global:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Errores de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Error de validación',
      details: err.details
    });
  }

  // Errores de autenticación
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'No autorizado'
    });
  }

  // Errores de base de datos
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(400).json({
      error: 'El registro ya existe'
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW') {
    return res.status(400).json({
      error: 'Registro referenciado no existe'
    });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    error: err.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}

/**
 * Middleware para rutas no encontradas
 */
export function notFoundHandler(req, res) {
  res.status(404).json({
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
}

/**
 * Middleware de logging de requests
 */
export function requestLogger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
}
