const express = require('express');
const router = express.Router();
const {
  listarUsuarios, obtenerUsuario, editarUsuario, eliminarUsuario, asignarRol,
} = require('../controllers/usuarioController');
const { proteger, restringirA } = require('../middleware/auth');

router.use(proteger);

router.get('/', restringirA('administrador'), listarUsuarios);
router.get('/:id', restringirA('administrador'), obtenerUsuario);
router.put('/:id', restringirA('administrador'), editarUsuario);
router.delete('/:id', restringirA('administrador'), eliminarUsuario);
router.patch('/:id/rol', restringirA('administrador'), asignarRol);

module.exports = router;
