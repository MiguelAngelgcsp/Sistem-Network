const { Noticia, ESTADOS } = require('../models/Noticia');

// GET /api/noticias
const listarNoticias = async (req, res) => {
  try {
    const { estado, categoria, buscar, pagina = 1, limite = 10, destacada } = req.query;
    const filtro = {};

    // Público ve solo publicadas
    if (!req.usuario || req.usuario.rol === 'estudiante') {
      filtro.estado = ESTADOS.PUBLICADA;
    } else if (estado) {
      filtro.estado = estado;
    }

    if (categoria) filtro.categoria = categoria;
    if (destacada) filtro.destacada = destacada === 'true';
    if (buscar) filtro.$text = { $search: buscar };

    const skip = (pagina - 1) * limite;
    const [noticias, total] = await Promise.all([
      Noticia.find(filtro)
        .populate('autor', 'nombre apellido')
        .populate('categoria', 'nombre color')
        .populate('numComentarios')
        .skip(skip)
        .limit(Number(limite))
        .sort('-fechaPublicacion -createdAt'),
      Noticia.countDocuments(filtro),
    ]);

    res.json({ exito: true, total, paginas: Math.ceil(total / limite), noticias });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// GET /api/noticias/:id
const obtenerNoticia = async (req, res) => {
  try {
    const noticia = await Noticia.findById(req.params.id)
      .populate('autor', 'nombre apellido fotoPerfil')
      .populate('categoria', 'nombre color');

    if (!noticia) return res.status(404).json({ exito: false, mensaje: 'Noticia no encontrada.' });

    // Incrementar vistas si está publicada
    if (noticia.estado === ESTADOS.PUBLICADA) {
      noticia.vistas++;
      await noticia.save({ validateBeforeSave: false });
    }

    res.json({ exito: true, noticia });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// POST /api/noticias
const crearNoticia = async (req, res) => {
  try {
    const { titulo, contenido, resumen, imagen, categoria, etiquetas, destacada } = req.body;

    if (!titulo || !contenido || !categoria) {
      return res.status(400).json({ exito: false, mensaje: 'Título, contenido y categoría son obligatorios.' });
    }

    const noticia = await Noticia.create({
      titulo,
      contenido,
      resumen,
      imagen,
      categoria,
      etiquetas,
      destacada,
      autor: req.usuario._id,
      estado: ESTADOS.BORRADOR,
    });

    await noticia.populate('autor', 'nombre apellido');
    await noticia.populate('categoria', 'nombre color');

    res.status(201).json({ exito: true, mensaje: 'Noticia creada.', noticia });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// PUT /api/noticias/:id
const editarNoticia = async (req, res) => {
  try {
    const noticia = await Noticia.findById(req.params.id);
    if (!noticia) return res.status(404).json({ exito: false, mensaje: 'Noticia no encontrada.' });

    // Editores solo pueden editar sus propias noticias
    if (req.usuario.rol === 'editor' && noticia.autor.toString() !== req.usuario._id.toString()) {
      return res.status(403).json({ exito: false, mensaje: 'Solo puedes editar tus propias noticias.' });
    }

    const { titulo, contenido, resumen, imagen, categoria, etiquetas, destacada } = req.body;
    const actualizada = await Noticia.findByIdAndUpdate(
      req.params.id,
      { titulo, contenido, resumen, imagen, categoria, etiquetas, destacada },
      { new: true, runValidators: true }
    ).populate('autor', 'nombre apellido').populate('categoria', 'nombre color');

    res.json({ exito: true, mensaje: 'Noticia actualizada.', noticia: actualizada });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};

// PATCH /api/noticias/:id/publicar
const publicarNoticia = async (req, res) => {
  try {
    const noticia = await Noticia.findByIdAndUpdate(
      req.params.id,
      { estado: ESTADOS.PUBLICADA, fechaPublicacion: new Date() },
      { new: true }
    );
    if (!noticia) return res.status(404).json({ exito: false, mensaje: 'Noticia no encontrada.' });
    res.json({ exito: true, mensaje: 'Noticia publicada.', noticia });
  } catch (error) {
    res.status(500).json({ exito: false, mensaje: error.message });
  }
};