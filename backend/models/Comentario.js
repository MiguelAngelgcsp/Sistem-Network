const mongoose = require('mongoose');

const ESTADOS_COMENTARIO = {
  ACTIVO: 'activo',
  MODERADO: 'moderado',
  ELIMINADO: 'eliminado',
};

const comentarioSchema = new mongoose.Schema(
  {
    contenido: {
      type: String,
      required: [true, 'El contenido del comentario es obligatorio'],
      trim: true,
      minlength: [2, 'El comentario debe tener al menos 2 caracteres'],
      maxlength: [500, 'El comentario no puede exceder 500 caracteres'],
    },
    noticia: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Noticia',
      required: [true, 'La noticia es obligatoria'],
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: [true, 'El autor es obligatorio'],
    },
    estado: {
      type: String,
      enum: Object.values(ESTADOS_COMENTARIO),
      default: ESTADOS_COMENTARIO.ACTIVO,
    },
    razonModeracion: {
      type: String,
      default: '',
    },
    moderadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Comentario = mongoose.model('Comentario', comentarioSchema);
module.exports = { Comentario, ESTADOS_COMENTARIO };
