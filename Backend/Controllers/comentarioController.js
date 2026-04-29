const { Comentario, ESTADOS_COMENTARIO } = require('../models/Comentario');
const { Noticia } = require('../models/Noticia');

// GET /api/noticias/:noticiaId/comentarios
const listarComentarios = async (req, res) => {
  try {
    const { noticiaId } = req.params;
    const esAdmin = req.usuario && req.usuario.rol === 'administrador';

    const filtro = { noticia: noticiaId };
    if (!esAdmin) filtro.estado = ESTADOS_COMENTARIO.ACTIVO;

    const comentarios = await Comentario.find(filtro)
      .populate('autor', 'nombre apellido fotoPerfil rol')
      .populate('moderadoPor', 'nombre apellido')
      .sort('createdAt');

    res.json({ exito: true, total: comentarios.length, comentarios });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// POST /api/noticias/:noticiaId/comentarios
const agregarComentario = async (req, res) => {
  try {
    const { noticiaId } = req.params;
    const { contenido } = req.body;

    if (!contenido) return res.status(400).json({ exito: false, mensaje: 'El contenido es obligatorio.' });

    const noticia = await Noticia.findById(noticiaId);
    if (!noticia || noticia.estado !== 'publicada') {
      return res.status(404).json({ exito: false, mensaje: 'Noticia no encontrada o no publicada.' });
    }

    const comentario = await Comentario.create({
      contenido,
      noticia: noticiaId,
      autor: req.usuario._id,
    });

    await comentario.populate('autor', 'nombre apellido fotoPerfil rol');
    res.status(201).json({ exito: true, mensaje: 'Comentario agregado.', comentario });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// PATCH /api/comentarios/:id/moderar — solo admin
const moderarComentario = async (req, res) => {
  try {
    const { razonModeracion } = req.body;
    const comentario = await Comentario.findByIdAndUpdate(
      req.params.id,
      {
        estado: ESTADOS_COMENTARIO.MODERADO,
        razonModeracion: razonModeracion || 'Contenido inapropiado',
        moderadoPor: req.usuario._id,
      },
      { new: true }
    );
    if (!comentario) return res.status(404).json({ exito: false, mensaje: 'Comentario no encontrado.' });
    res.json({ exito: true, mensaje: 'Comentario moderado.', comentario });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// DELETE /api/comentarios/:id
const eliminarComentario = async (req, res) => {
  try {
    const comentario = await Comentario.findById(req.params.id);
    if (!comentario) return res.status(404).json({ exito: false, mensaje: 'Comentario no encontrado.' });

    // Admin puede eliminar cualquiera; usuario solo el suyo
    if (
      req.usuario.rol !== 'administrador' &&
      comentario.autor.toString() !== req.usuario._id.toString()
    ) {
      return res.status(403).json({ exito: false, mensaje: 'No autorizado.' });
    }

    await comentario.deleteOne();
    res.json({ exito: true, mensaje: 'Comentario eliminado.' });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

module.exports = { listarComentarios, agregarComentario, moderarComentario, eliminarComentario };
