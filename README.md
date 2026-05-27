# Sistem Network — CKN Cable Konrad Network

> Plataforma digital universitaria para gestión de noticias, eventos y avisos institucionales.

##  Equipo CKN

| Usuario GitHub | Integrante | Rol |
|---|---|---|
| `BriyidTatiana` | Briyid Tatiana Bautista | Líder de proyecto / Full Stack — Módulo de Usuarios y Autenticación |
| `MiguelGomez` | Miguel Angel Gomez Cruz | Desarrollador Backend — Módulo de Noticias y BD |
| `DavidSandoval` | David Santiago Sandoval Barreto | Desarrollador Frontend — Módulo de Categorías y Comentarios |

##  Stack Tecnológico

- **Backend:** Node.js · Express.js · MongoDB Atlas (Mongoose)
- **Autenticación:** JWT (jsonwebtoken) · Bcrypt (bcryptjs)
- **Frontend:** HTML5 · CSS3 · JavaScript vanilla (sin frameworks)

##  Estructura del Proyecto

```
sistem-network/
├── backend/
│   ├── config/
│   │   └── db.js              # Conexión a MongoDB Atlas
│   ├── controllers/
│   │   ├── authController.js      # Registro, login, perfil
│   │   ├── usuarioController.js   # CRUD usuarios (admin)
│   │   ├── noticiaController.js   # CRUD noticias + reportes
│   │   ├── categoriaController.js # CRUD categorías
│   │   └── comentarioController.js# CRUD comentarios
│   ├── middleware/
│   │   └── auth.js            # proteger, restringirA, requierePermiso
│   ├── models/
│   │   ├── Usuario.js         # Modelo + roles + permisos
│   │   ├── Noticia.js         # Modelo noticias
│   │   ├── Categoria.js       # Modelo categorías
│   │   └── Comentario.js      # Modelo comentarios
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── usuarioRoutes.js
│   │   ├── noticiaRoutes.js
│   │   ├── categoriaRoutes.js
│   │   └── comentarioRoutes.js
│   ├── .env                   # Variables de entorno
│   ├── package.json
│   └── server.js              # Punto de entrada
└── frontend/
    ├── index.html             # Redirección raíz
    ├── public/
    │   ├── css/styles.css     # Estilos globales
    │   └── js/api.js          # Helper de API + funciones compartidas
    └── pages/
        ├── login.html         # Login y Registro
        ├── noticias.html      # Listado público de noticias
        ├── editor.html        # Panel del editor
        ├── admin.html         # Panel de administrador
        └── perfil.html        # Perfil de usuario
```

##  Roles y Permisos

| Permiso | Estudiante | Editor | Administrador |
|---|:---:|:---:|:---:|
| Leer noticias publicadas |  |  |  |
| Agregar comentarios |  |  |  |
| Crear / publicar noticias |  |  |  |
| Editar noticias propias |  |  |  |
| Eliminar noticias |  |  |  |
| Crear categorías |  |  |  |
| Editar / eliminar categorías |  |  |  |
| Moderar / eliminar comentarios |  |  |  |
| Gestionar usuarios |  |  |  |
| Asignar roles |  |  |  |
| Generar reportes PDF |  |  |  |

##  Instalación

```bash
cd backend
npm install
```

Configurar `.env`:
```env
PORT=3000
MONGO_URI=mongodb+srv://BriyidTatiana:<password>@cluster0.k1scrqf.mongodb.net/Sistem_Network
JWT_SECRET=SistemNetworkCKN_SuperSecretKey_2024
JWT_EXPIRES_IN=7d
```

```bash
npm run dev  # desarrollo (nodemon)
npm start    # producción
```

##  Endpoints de la API

### Autenticación
| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/registro` | Crear cuenta (estudiante por defecto) |
| POST | `/api/auth/login` | Iniciar sesión → retorna JWT |
| GET | `/api/auth/perfil` | Ver perfil propio  |
| PUT | `/api/auth/perfil` | Actualizar perfil  |

### Usuarios ( Admin)
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/usuarios` | Listar usuarios |
| GET | `/api/usuarios/:id` | Ver usuario |
| PUT | `/api/usuarios/:id` | Editar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |
| PATCH | `/api/usuarios/:id/rol` | Asignar rol |

### Noticias
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/noticias` | Listar (público: solo publicadas) |
| GET | `/api/noticias/:id` | Ver detalle |
| POST | `/api/noticias` | Crear  Editor/Admin |
| PUT | `/api/noticias/:id` | Editar  |
| PATCH | `/api/noticias/:id/publicar` | Publicar  |
| PATCH | `/api/noticias/:id/archivar` | Archivar  |
| DELETE | `/api/noticias/:id` | Eliminar  Admin |
| GET | `/api/noticias/reporte/estadisticas` | Reporte  Admin |

### Categorías
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/categorias` | Listar (público) |
| GET | `/api/categorias/:id` | Ver |
| POST | `/api/categorias` | Crear  Editor/Admin |
| PUT | `/api/categorias/:id` | Editar  Admin |
| DELETE | `/api/categorias/:id` | Eliminar  Admin |

### Comentarios
| Método | Ruta | Descripción |
|---|---|---|
| GET | `/api/noticias/:id/comentarios` | Ver comentarios |
| POST | `/api/noticias/:id/comentarios` | Comentar  |
| PATCH | `/api/comentarios/:id/moderar` | Moderar  Admin |
| DELETE | `/api/comentarios/:id` | Eliminar  |

##  Ramas Git

- `BriyidTatiana` — Líder / Auth / Usuarios
- `MiguelGomezCruz` — Noticias / BD / Backend
- `DavidSandovalBarreto` — Frontend / Categorías / Comentarios
