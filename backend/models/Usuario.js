const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ROLES = {
  ESTUDIANTE: 'estudiante',
  EDITOR: 'editor',
  ADMINISTRADOR: 'administrador',
};

const PERMISOS = {
  estudiante: [
    'leer_noticias',
    'agregar_comentario',
    'consultar_comentarios',
    'editar_perfil_propio',
    'votar_propuesta',
  ],
  editor: [
    'leer_noticias',
    'crear_noticia',
    'editar_noticia_propia',
    'publicar_noticia',
    'archivar_noticia',
    'agregar_comentario',
    'consultar_comentarios',
    'editar_perfil_propio',
    'crear_categoria',
    'consultar_categoria',
  ],
  administrador: [
    'leer_noticias',
    'crear_noticia',
    'editar_noticia',
    'eliminar_noticia',
    'publicar_noticia',
    'archivar_noticia',
    'agregar_comentario',
    'consultar_comentarios',
    'moderar_comentario',
    'eliminar_comentario',
    'editar_perfil_propio',
    'editar_usuario',
    'eliminar_usuario',
    'asignar_rol',
    'crear_categoria',
    'editar_categoria',
    'eliminar_categoria',
    'consultar_categoria',
    'generar_reporte_pdf',
  ],
};

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
    },
    apellido: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Formato de email inválido'],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false,
    },
    rol: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.ESTUDIANTE,
    },
    activo: {
      type: Boolean,
      default: true,
    },
    fotoPerfil: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
      maxlength: [300, 'La bio no puede exceder 300 caracteres'],
    },
    ultimoAcceso: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Virtual: permisos según rol
usuarioSchema.virtual('permisos').get(function () {
  return PERMISOS[this.rol] || [];
});
