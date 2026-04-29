const Categoria = require('../models/Categoria');

// GET /api/categorias
const listarCategorias = async (req, res) => {
  try {
    const { activa } = req.query;
    const filtro = {};
    if (activa !== undefined) filtro.activa = activa === 'true';

    const categorias = await Categoria.find(filtro)
      .populate('creadoPor', 'nombre apellido')
      .sort('nombre');

    res.json({ exito: true, total: categorias.length, categorias });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// GET /api/categorias/:id
const obtenerCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findById(req.params.id).populate('creadoPor', 'nombre apellido');
    if (!categoria) return res.status(404).json({ exito: false, mensaje: 'Categoría no encontrada.' });
    res.json({ exito: true, categoria });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// POST /api/categorias
const crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, color } = req.body;
    if (!nombre) return res.status(400).json({ exito: false, mensaje: 'El nombre es obligatorio.' });

    const categoria = await Categoria.create({
      nombre,
      descripcion,
      color,
      creadoPor: req.usuario._id,
    });

    res.status(201).json({ exito: true, mensaje: 'Categoría creada.', categoria });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ exito: false, mensaje: 'Ya existe una categoría con ese nombre.' });
    }
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// PUT /api/categorias/:id
const editarCategoria = async (req, res) => {
  try {
    const { nombre, descripcion, color, activa } = req.body;
    const categoria = await Categoria.findByIdAndUpdate(
      req.params.id,
      { nombre, descripcion, color, activa },
      { new: true, runValidators: true }
    );
    if (!categoria) return res.status(404).json({ exito: false, mensaje: 'Categoría no encontrada.' });
    res.json({ exito: true, mensaje: 'Categoría actualizada.', categoria });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// DELETE /api/categorias/:id
const eliminarCategoria = async (req, res) => {
  try {
    const categoria = await Categoria.findByIdAndDelete(req.params.id);
    if (!categoria) return res.status(404).json({ exito: false, mensaje: 'Categoría no encontrada.' });
    res.json({ exito: true, mensaje: 'Categoría eliminada.' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

module.exports = { listarCategorias, obtenerCategoria, crearCategoria, editarCategoria, eliminarCategoria };
