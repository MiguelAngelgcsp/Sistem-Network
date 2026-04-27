const express = require('express');
const router = express.Router();
const { registro, login, obtenerPerfil, actualizarPerfil } = require('../controllers/authController');
const { proteger } = require('../middleware/auth');

router.post('/registro', registro);
router.post('/login', login);
router.get('/perfil', proteger, obtenerPerfil);
router.put('/perfil', proteger, actualizarPerfil);

module.exports = router;
