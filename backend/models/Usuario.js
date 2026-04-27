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