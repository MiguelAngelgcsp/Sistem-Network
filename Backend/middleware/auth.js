const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/Usuario');


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


const restringirA = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({
        exito: false,
        mensaje: `Acceso denegado. Se requiere rol: ${roles.join(' o ')}.`,
      });
    }
    next();
  };
};


const requierePermiso = (permiso) => {
  return (req, res, next) => {
    if (!req.usuario.tienePermiso(permiso)) {
      return res.status(403).json({
        exito: false,
        mensaje: `No tienes permiso para: ${permiso}`,
      });
    }
    next();
  };
};

module.exports = { proteger, restringirA, requierePermiso };
