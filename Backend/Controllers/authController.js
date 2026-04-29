const jwt = require('jsonwebtoken');
const { Usuario, ROLES } = require('../models/Usuario');

// Generar JWT
const generarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// POST /api/auth/registro
const registro = async (req, res) => {
  try {
    const { nombre, apellido, email, password } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ exito: false, mensaje: 'Todos los campos son obligatorios.' });
    }

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ exito: false, mensaje: 'El email ya está registrado.' });
    }

    const usuario = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      rol: ROLES.ESTUDIANTE,
    });

    const token = generarToken(usuario._id);

    res.status(201).json({
      exito: true,
      mensaje: 'Usuario registrado exitosamente.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        permisos: usuario.permisos,
      },
    });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ exito: false, mensaje: 'Email y contraseña son obligatorios.' });
    }

    const usuario = await Usuario.findOne({ email }).select('+password');
    if (!usuario || !(await usuario.compararPassword(password))) {
      return res.status(401).json({ exito: false, mensaje: 'Credenciales inválidas.' });
    }

    if (!usuario.activo) {
      return res.status(401).json({ exito: false, mensaje: 'Cuenta desactivada.' });
    }

    usuario.ultimoAcceso = new Date();
    await usuario.save({ validateBeforeSave: false });

    const token = generarToken(usuario._id);

    res.json({
      exito: true,
      mensaje: 'Inicio de sesión exitoso.',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        permisos: usuario.permisos,
      },
    });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// GET /api/auth/perfil
const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario._id);
    res.json({
      exito: true,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: usuario.rol,
        permisos: usuario.permisos,
        bio: usuario.bio,
        fotoPerfil: usuario.fotoPerfil,
        ultimoAcceso: usuario.ultimoAcceso,
        createdAt: usuario.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// PUT /api/auth/perfil
const actualizarPerfil = async (req, res) => {
  try {
    const camposPermitidos = ['nombre', 'apellido', 'bio', 'fotoPerfil'];
    const actualizaciones = {};
    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) actualizaciones[campo] = req.body[campo];
    });

    // Cambio de contraseña
    if (req.body.passwordActual && req.body.nuevaPassword) {
      const usuarioConPass = await Usuario.findById(req.usuario._id).select('+password');
      const correcto = await usuarioConPass.compararPassword(req.body.passwordActual);
      if (!correcto) {
        return res.status(400).json({ exito: false, mensaje: 'Contraseña actual incorrecta.' });
      }
      // Usar save() para que el hook pre-save hashee la nueva contraseña
      Object.assign(usuarioConPass, actualizaciones);
      usuarioConPass.password = req.body.nuevaPassword;
      await usuarioConPass.save();
      const usuarioRespuesta = await Usuario.findById(req.usuario._id);
      return res.json({ exito: true, mensaje: 'Perfil y contraseña actualizados.', usuario: usuarioRespuesta });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.usuario._id,
      actualizaciones,
      { new: true, runValidators: true }
    );

    res.json({ exito: true, mensaje: 'Perfil actualizado.', usuario });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

module.exports = { registro, login, obtenerPerfil, actualizarPerfil };
