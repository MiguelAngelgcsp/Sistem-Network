const { Usuario, ROLES } = require('../models/Usuario');

// GET /api/usuarios — solo admin
const listarUsuarios = async (req, res) => {
  try {
    const { rol, activo, pagina = 1, limite = 10 } = req.query;
    const filtro = {};
    if (rol) filtro.rol = rol;
    if (activo !== undefined) filtro.activo = activo === 'true';

    const skip = (pagina - 1) * limite;
    const [usuarios, total] = await Promise.all([
      Usuario.find(filtro).select('-password').skip(skip).limit(Number(limite)).sort('-createdAt'),
      Usuario.countDocuments(filtro),
    ]);

    res.json({ exito: true, total, paginas: Math.ceil(total / limite), usuarios });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// GET /api/usuarios/:id
const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });
    res.json({ exito: true, usuario });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// PUT /api/usuarios/:id — admin puede editar todo
const editarUsuario = async (req, res) => {
  try {
    const camposPermitidos = ['nombre', 'apellido', 'bio', 'fotoPerfil', 'activo'];
    const actualizaciones = {};
    camposPermitidos.forEach((c) => {
      if (req.body[c] !== undefined) actualizaciones[c] = req.body[c];
    });

    const usuario = await Usuario.findByIdAndUpdate(req.params.id, actualizaciones, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });
    res.json({ exito: true, mensaje: 'Usuario actualizado.', usuario });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};