const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  listarComentarios, agregarComentario, moderarComentario, eliminarComentario,
} = require('../controllers/comentarioController');
const { proteger, restringirA } = require('../middleware/auth');

// GET comentarios de una noticia (autenticación opcional)
router.get('/', (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    const jwt = require('jsonwebtoken');
    const { Usuario } = require('../models/Usuario');
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (!err) req.usuario = await Usuario.findById(decoded.id);
      next();
    });
  } else {
    next();
  }
}, listarComentarios);

// Protegidas
router.use(proteger);
router.post('/', agregarComentario);

module.exports = router;

// Rutas independientes de comentarios (para moderar/eliminar)
const comentarioRouter = express.Router();
comentarioRouter.patch('/:id/moderar', proteger, restringirA('administrador'), moderarComentario);
comentarioRouter.delete('/:id', proteger, eliminarComentario);

module.exports.comentarioRouter = comentarioRouter;
