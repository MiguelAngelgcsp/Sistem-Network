const { Usuario, ROLES } = require('../models/Usuario');


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


const obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });
    res.json({ exito: true, usuario });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};


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

const eliminarUsuario = async (req, res) => {
  try {
    if (req.params.id === req.usuario._id.toString()) {
      return res.status(400).json({ exito: false, mensaje: 'No puedes eliminarte a ti mismo.' });
    }
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });
    res.json({ exito: true, mensaje: 'Usuario eliminado.' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

const asignarRol = async (req, res) => {
  try {
    const { rol } = req.body;
    if (!Object.values(ROLES).includes(rol)) {
      return res.status(400).json({ exito: false, mensaje: `Rol inválido. Use: ${Object.values(ROLES).join(', ')}` });
    }

    if (req.params.id === req.usuario._id.toString()) {
      return res.status(400).json({ exito: false, mensaje: 'No puedes cambiar tu propio rol.' });
    }

    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      { rol },
      { new: true, runValidators: true }
    ).select('-password');

    if (!usuario) return res.status(404).json({ exito: false, mensaje: 'Usuario no encontrado.' });
    res.json({ exito: true, mensaje: `Rol actualizado a ${rol}.`, usuario });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

module.exports = { listarUsuarios, obtenerUsuario, editarUsuario, eliminarUsuario, asignarRol };
