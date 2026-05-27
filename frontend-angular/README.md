# Módulo 4 — Frontend Angular (Sistem Network)

> Angular 17 · Angular Material · TypeScript · Standalone Components · Signals

##  Módulo implementado por: Equipo CKN

---

##  Estructura del Módulo Angular

```
frontend-angular/
├── src/
│   ├── main.ts                          # Bootstrap standalone
│   ├── index.html
│   ├── styles.scss                      # Tema Angular Material + estilos globales
│   ├── environments/
│   │   └── environment.ts              # URL de API
│   └── app/
│       ├── app.component.ts            # Componente raíz + Toolbar de navegación
│       ├── app.config.ts               # Configuración (providers, interceptors, router)
│       ├── app.routes.ts               # Rutas con lazy loading
│       │
│       ├── core/
│       │   ├── models/
│       │   │   └── models.ts           # Interfaces TypeScript (Usuario, Noticia, Categoria, etc.)
│       │   ├── services/
│       │   │   ├── auth.service.ts     # Login, registro, perfil (con Signals)
│       │   │   ├── noticias.service.ts # CRUD noticias + comentarios
│       │   │   ├── categorias.service.ts # CRUD categorías
│       │   │   └── usuarios.service.ts # CRUD usuarios (admin)
│       │   ├── guards/
│       │   │   └── auth.guard.ts       # authGuard, adminGuard, editorGuard
│       │   └── interceptors/
│       │       └── auth.interceptor.ts # Inyección JWT + manejo 401
│       │
│       └── features/
│           ├── auth/
│           │   ├── login/              # LoginComponent
│           │   └── register/           # RegisterComponent
│           ├── noticias/
│           │   ├── lista/              # ListaNoticiasComponent (grid + filtros + paginación)
│           │   ├── detalle/            # DetalleNoticiaComponent (vista + comentarios)
│           │   └── formulario/         # FormularioNoticiaComponent (crear/editar)
│           ├── categorias/
│           │   └── lista/              # ListaCategoriasComponent (tabla + dialog CRUD)
│           ├── admin/
│           │   ├── dashboard/          # DashboardComponent
│           │   ├── usuarios/           # UsuariosComponent (tabla paginada + rol dialog)
│           │   └── reportes/           # ReportesComponent (estadísticas + barras)
│           └── perfil/
│               └── perfil.component.ts # Edición de perfil propio
│
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
└── proxy.conf.json                     # Proxy → backend :3000
```

---

##  Características del Módulo 4

###  Componentes Angular
- **17 componentes standalone** (sin NgModules)
- Lazy loading en todas las rutas
- Angular Signals para estado reactivo del usuario autenticado
- Template syntax moderna (`@if`, `@for`, `@else`)

###  Consumo de API (CRUD completo)
| Entidad | C | R | U | D |
|---------|---|---|---|---|
| Noticias |  |  |  |  |
| Categorías |  |  |  |  |
| Usuarios | — |  |  |  |
| Comentarios |  |  | — |  |
| Perfil | — |  |  | — |

###  Angular Material
Componentes utilizados:
- `MatToolbar`, `MatCard`, `MatButton`, `MatIcon`
- `MatTable` + `MatSort` + `MatPaginator`
- `MatFormField`, `MatInput`, `MatSelect`, `MatCheckbox`, `MatSlideToggle`
- `MatDialog` (formularios modales)
- `MatSnackBar` (notificaciones)
- `MatChips`, `MatProgressBar`, `MatProgressSpinner`
- `MatMenu`, `MatDivider`, `MatList`
- `MatTooltip`

###  TypeScript
- Interfaces tipadas para todos los modelos
- Servicios con tipos genéricos
- Guards funcionales tipados
- Interceptor HTTP funcional
- FormGroups con validaciones

###  Seguridad
- `authGuard` → rutas protegidas por autenticación
- `adminGuard` → solo administradores
- `editorGuard` → editores y administradores
- JWT inyectado automáticamente en todos los requests
- Redirección automática al expirar token (401)

---

##  Instalación y Ejecución

### Prerrequisitos
- Node.js ≥ 18
- Angular CLI: `npm install -g @angular/cli`

### Pasos

```bash
# 1. Instalar dependencias
cd frontend-angular
npm install

# 2. Asegúrate de que el backend esté corriendo en :3000
cd ../backend && npm run dev

# 3. Iniciar Angular (con proxy al backend)
cd ../frontend-angular
npm start
# → http://localhost:4200
```

### Build de producción
```bash
npm run build
# Salida en: dist/sistem-network-angular/
```

---

##  Rutas de la Aplicación

| Ruta | Componente | Protección |
|------|-----------|-----------|
| `/` | → `/noticias` | — |
| `/auth/login` | LoginComponent | — |
| `/auth/registro` | RegisterComponent | — |
| `/noticias` | ListaNoticiasComponent | — |
| `/noticias/:id` | DetalleNoticiaComponent | — |
| `/editor` | FormularioNoticiaComponent | Editor/Admin |
| `/editor/:id` | FormularioNoticiaComponent | Editor/Admin |
| `/categorias` | ListaCategoriasComponent | Editor/Admin |
| `/admin` | DashboardComponent | Admin |
| `/admin/usuarios` | UsuariosComponent | Admin |
| `/admin/reportes` | ReportesComponent | Admin |
| `/perfil` | PerfilComponent | Autenticado |

---

##  Notas técnicas

- El proxy (`proxy.conf.json`) redirige `/api/*` → `http://localhost:3000/api/*` en desarrollo.
- En producción, copiar el build a `backend/public/` o configurar nginx para servir el SPA.
- El estado del usuario utiliza **Angular Signals** (API estable en Angular 17).
