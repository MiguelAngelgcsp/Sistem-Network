import { Component, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, RouterLink, RouterLinkActive, CommonModule,
    MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDividerModule
  ],
  template: `
    <mat-toolbar color="primary" class="app-toolbar">
      <a routerLink="/noticias" class="brand">
        <img src="assets/logo.png" alt="Sistem Network" class="brand-logo">
      </a>

      <span class="toolbar-spacer"></span>

      <nav class="nav-links">
        <a mat-button routerLink="/noticias" routerLinkActive="active-link">
          <mat-icon>article</mat-icon> Noticias
        </a>

        @if (auth.isEditor()) {
          <a mat-button routerLink="/editor" routerLinkActive="active-link">
            <mat-icon>edit</mat-icon> Editor
          </a>
          <a mat-button routerLink="/categorias" routerLinkActive="active-link">
            <mat-icon>category</mat-icon> Categorías
          </a>
        }

        @if (auth.isAdmin()) {
          <a mat-button routerLink="/admin" routerLinkActive="active-link">
            <mat-icon>admin_panel_settings</mat-icon> Admin
          </a>
        }
      </nav>

      @if (auth.isLoggedIn()) {
        <button mat-button [matMenuTriggerFor]="userMenu">
          <mat-icon>account_circle</mat-icon>
          {{ auth.usuario()?.nombre }}
          <span class="badge-rol {{ auth.usuario()?.rol }}">{{ auth.usuario()?.rol }}</span>
        </button>
        <mat-menu #userMenu="matMenu">
          <a mat-menu-item routerLink="/perfil"><mat-icon>person</mat-icon> Mi Perfil</a>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="auth.logout()"><mat-icon>logout</mat-icon> Cerrar sesión</button>
        </mat-menu>
      } @else {
        <a mat-raised-button color="accent" routerLink="/auth/login">Ingresar</a>
      }
    </mat-toolbar>

    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .app-toolbar { position: sticky; top: 0; z-index: 100; }
    .brand { display: flex; align-items: center; text-decoration: none; }
    .brand-logo { height: 48px; width: auto; object-fit: contain; }
    .nav-links { display: flex; align-items: center; }
    .active-link { background: rgba(255,255,255,0.15); border-radius: 4px; }
    .badge-rol { margin-left: 6px; font-size: 10px; padding: 2px 6px; border-radius: 8px; }
    .badge-rol.administrador { background: #fff; color: #3f51b5; }
    .badge-rol.editor { background: #ff9800; color: #fff; }
    .badge-rol.estudiante { background: #4caf50; color: #fff; }
    main { min-height: calc(100vh - 64px); }
  `]
})
export class AppComponent {
  constructor(public auth: AuthService) {}
}
