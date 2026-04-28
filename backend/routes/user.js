const express = require('express');
const db = require('../db');
const router = express.Router();

// Ejemplo de ruta protegida para usuarios aprobados
router.get('/panel', async (req, res) => {
  // Aquí puedes validar permisos específicos
  res.json({ message: 'Bienvenido al panel de usuario aprobado.' });
});

module.exports = router;
