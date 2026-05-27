import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatCardModule, MatButtonModule, MatIconModule, MatListModule],
  template: `
    <div class="page-container">
      <h1><mat-icon>admin_panel_settings</mat-icon> Panel de Administración</h1>
      <p class="subtitle">Gestión completa de Sistem Network — CKN</p>

      <div class="admin-grid">
        <mat-card class="admin-tile" routerLink="/admin/usuarios">
          <mat-card-content>
            <mat-icon class="tile-icon" color="primary">group</mat-icon>
            <h2>Usuarios</h2>
            <p>Gestionar cuentas, roles y permisos</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" routerLink="/admin/usuarios">
              Ir a Usuarios <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="admin-tile" routerLink="/admin/reportes">
          <mat-card-content>
            <mat-icon class="tile-icon" style="color:#ff9800">bar_chart</mat-icon>
            <h2>Reportes</h2>
            <p>Estadísticas de noticias, vistas y actividad</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="accent" routerLink="/admin/reportes">
              Ver Reportes <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="admin-tile">
          <mat-card-content>
            <mat-icon class="tile-icon" style="color:#4caf50">article</mat-icon>
            <h2>Noticias</h2>
            <p>Crear y gestionar todas las noticias</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button routerLink="/editor">
              Ir al Editor <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>

        <mat-card class="admin-tile">
          <mat-card-content>
            <mat-icon class="tile-icon" style="color:#9c27b0">category</mat-icon>
            <h2>Categorías</h2>
            <p>Crear y organizar categorías de contenido</p>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button routerLink="/categorias">
              Categorías <mat-icon>arrow_forward</mat-icon>
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    h1 { display: flex; align-items: center; gap: 8px; font-size: 28px; color: #3f51b5; }
    .subtitle { color: #888; margin-bottom: 28px; }
    .admin-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
    .admin-tile { cursor: pointer; transition: transform .2s, box-shadow .2s; }
    .admin-tile:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .tile-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 12px; display: block; }
    mat-card-content h2 { font-size: 20px; margin-bottom: 6px; }
    mat-card-content p { color: #666; font-size: 14px; }
    mat-card-actions { padding: 8px 16px 16px; }
  `]
})
export class DashboardComponent {}
