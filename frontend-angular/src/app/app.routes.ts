import { Routes } from '@angular/router';
import { authGuard, adminGuard, editorGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'noticias', pathMatch: 'full' },

  // Auth
  {
    path: 'auth',
    children: [
      { path: 'login',    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
      { path: 'registro', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
    ]
  },

  // Noticias (público)
  {
    path: 'noticias',
    children: [
      { path: '', loadComponent: () => import('./features/noticias/lista/lista.component').then(m => m.ListaNoticiasComponent) },
      { path: ':id', loadComponent: () => import('./features/noticias/detalle/detalle.component').then(m => m.DetalleNoticiaComponent) },
    ]
  },

  // Editor / Admin — gestión noticias
  {
    path: 'editor',
    canActivate: [authGuard, editorGuard],
    children: [
      { path: '', loadComponent: () => import('./features/noticias/formulario/formulario.component').then(m => m.FormularioNoticiaComponent) },
      { path: ':id', loadComponent: () => import('./features/noticias/formulario/formulario.component').then(m => m.FormularioNoticiaComponent) },
    ]
  },

  // Categorías
  {
    path: 'categorias',
    canActivate: [authGuard, editorGuard],
    children: [
      { path: '', loadComponent: () => import('./features/categorias/lista/lista-categorias.component').then(m => m.ListaCategoriasComponent) },
    ]
  },

  // Admin
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    children: [
      { path: '', loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'usuarios', loadComponent: () => import('./features/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
      { path: 'reportes', loadComponent: () => import('./features/admin/reportes/reportes.component').then(m => m.ReportesComponent) },
    ]
  },

  // Perfil
  {
    path: 'perfil',
    canActivate: [authGuard],
    loadComponent: () => import('./features/perfil/perfil.component').then(m => m.PerfilComponent)
  },

  { path: '**', redirectTo: 'noticias' }
];
