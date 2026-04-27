const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/Usuario');

// Verificar token JWT
const proteger = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      exito: false,
      mensaje: 'No autorizado. Token no proporcionado.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);

    if (!usuario) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Usuario no encontrado.',
      });
    }

    if (!usuario.activo) {
      return res.status(401).json({
        exito: false,
        mensaje: 'Cuenta desactivada. Contacta al administrador.',
      });
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      exito: false,
      mensaje: 'Token inválido o expirado.',
    });
  }
};