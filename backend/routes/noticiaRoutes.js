const express = require('express');
const router = express.Router();
const {
  listarNoticias, obtenerNoticia, crearNoticia, editarNoticia,
  publicarNoticia, archivarNoticia, eliminarNoticia, generarReporte,
} = require('../controllers/noticiaController');
const { proteger, restringirA } = require('../middleware/auth');

// Públicas (pero el controller filtra por rol si hay token)
router.get('/', (req, res, next) => {
  // Intentar autenticar opcionalmente
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const jwt = require('jsonwebtoken');
    const { Usuario } = require('../models/Usuario');
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (!err) {
        req.usuario = await Usuario.findById(decoded.id);
      }
      next();
    });
  } else {
    next();
  }
}, listarNoticias);

// IMPORTANTE: esta ruta debe ir ANTES de /:id para que Express no la confunda con un ID
router.get('/reporte/estadisticas', proteger, restringirA('administrador'), generarReporte);
router.get('/:id', obtenerNoticia);

// Protegidas
router.use(proteger);
router.post('/', restringirA('administrador', 'editor'), crearNoticia);
router.put('/:id', restringirA('administrador', 'editor'), editarNoticia);
router.patch('/:id/publicar', restringirA('administrador', 'editor'), publicarNoticia);
router.patch('/:id/archivar', restringirA('administrador', 'editor'), archivarNoticia);
router.delete('/:id', restringirA('administrador'), eliminarNoticia);

module.exports = router;
