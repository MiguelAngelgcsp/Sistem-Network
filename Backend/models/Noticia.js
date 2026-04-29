const mongoose = require('mongoose');

const ESTADOS = {
  BORRADOR: 'borrador',
  PUBLICADA: 'publicada',
  ARCHIVADA: 'archivada',
};

const noticiaSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true,
      minlength: [5, 'El título debe tener al menos 5 caracteres'],
      maxlength: [150, 'El título no puede exceder 150 caracteres'],
    },
    contenido: {
      type: String,
      required: [true, 'El contenido es obligatorio'],
      minlength: [20, 'El contenido debe tener al menos 20 caracteres'],
    },
    resumen: {
      type: String,
      maxlength: [300, 'El resumen no puede exceder 300 caracteres'],
      default: '',
    },
    imagen: {
      type: String,
      default: '',
    },
    estado: {
      type: String,
      enum: Object.values(ESTADOS),
      default: ESTADOS.BORRADOR,
    },
    categoria: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Categoria',
      required: [true, 'La categoría es obligatoria'],
    },
    autor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
    fechaPublicacion: {
      type: Date,
      default: null,
    },
    vistas: {
      type: Number,
      default: 0,
    },
    destacada: {
      type: Boolean,
      default: false,
    },
    etiquetas: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual: número de comentarios
noticiaSchema.virtual('numComentarios', {
  ref: 'Comentario',
  localField: '_id',
  foreignField: 'noticia',
  count: true,
});

// Índice para búsqueda de texto
noticiaSchema.index({ titulo: 'text', contenido: 'text', etiquetas: 'text' });

const Noticia = mongoose.model('Noticia', noticiaSchema);
module.exports = { Noticia, ESTADOS };
