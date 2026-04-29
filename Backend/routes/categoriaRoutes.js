const express = require('express');
const router = express.Router();
const {
  listarCategorias, obtenerCategoria, crearCategoria, editarCategoria, eliminarCategoria,
} = require('../controllers/categoriaController');
const { proteger, restringirA } = require('../middleware/auth');

// Públicas
router.get('/', listarCategorias);
router.get('/:id', obtenerCategoria);

// Protegidas
router.use(proteger);
router.post('/', restringirA('administrador', 'editor'), crearCategoria);
router.put('/:id', restringirA('administrador'), editarCategoria);
router.delete('/:id', restringirA('administrador'), eliminarCategoria);

module.exports = router;
