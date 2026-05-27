// ========== MODELS — Módulo 4 ==========

export interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'estudiante' | 'editor' | 'administrador';
  activo: boolean;
  fotoPerfil?: string;
  programa?: string;
  semestre?: number;
  createdAt?: string;
}

export interface Categoria {
  _id: string;
  nombre: string;
  descripcion?: string;
  color?: string;
  activa: boolean;
  creadoPor?: Partial<Usuario>;
  createdAt?: string;
}

export interface Noticia {
  _id: string;
  titulo: string;
  contenido: string;
  resumen?: string;
  imagen?: string;
  estado: 'borrador' | 'publicada' | 'archivada';
  destacada: boolean;
  etiquetas?: string[];
  autor?: Partial<Usuario>;
  categoria?: Categoria;
  vistas: number;
  numComentarios?: number;
  fechaPublicacion?: string;
  createdAt?: string;
}

export interface Comentario {
  _id: string;
  texto: string;
  autor: Partial<Usuario>;
  noticia: string;
  moderado: boolean;
  createdAt?: string;
}

export interface AuthResponse {
  exito: boolean;
  token: string;
  usuario: Usuario;
  mensaje?: string;
}

export interface ApiResponse<T> {
  exito: boolean;
  mensaje?: string;
  data?: T;
}

export interface ListaNoticias {
  exito: boolean;
  total: number;
  paginas: number;
  noticias: Noticia[];
}

export interface ListaCategorias {
  exito: boolean;
  total: number;
  categorias: Categoria[];
}

export interface ListaUsuarios {
  exito: boolean;
  total: number;
  usuarios: Usuario[];
}

export interface Reporte {
  total: number;
  porEstado: { _id: string; cantidad: number }[];
  porCategoria: { _id: string; nombre: string; cantidad: number }[];
  masVistas: { _id: string; titulo: string; vistas: number }[];
  generadoEl: string;
}
