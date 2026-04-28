const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre de la categoría es obligatorio'],
      unique: true,
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    descripcion: {
      type: String,
      default: '',
      maxlength: [200, 'La descripción no puede exceder 200 caracteres'],
    },
    color: {
      type: String,
      default: '#6B21A8',
      match: [/^#[0-9A-Fa-f]{6}$/, 'Color debe ser un hexadecimal válido'],
    },
    activa: {
      type: Boolean,
      default: true,
    },
    creadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Categoria = mongoose.model('Categoria', categoriaSchema);
module.exports = Categoria;
