import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { NoticiasService } from '../../../core/services/noticias.service';
import { Reporte } from '../../../core/models/models';

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    CommonModule, RouterLink,
    MatCardModule, MatButtonModule, MatIconModule, MatListModule,
    MatProgressBarModule, MatDividerModule, MatProgressSpinnerModule, MatChipsModule
  ],
  template: `
    <div class="page-container">
      <div class="page-header">
        <a mat-button routerLink="/admin"><mat-icon>arrow_back</mat-icon></a>
        <div>
          <h1><mat-icon>bar_chart</mat-icon> Reportes y Estadísticas</h1>
          @if (reporte) {
            <small class="subtitle">Generado: {{ reporte.generadoEl | date:'d/M/yyyy, H:mm':'':'es' }}</small>
          }
        </div>
        <button mat-stroked-button (click)="cargar()"><mat-icon>refresh</mat-icon> Actualizar</button>
      </div>

      @if (loading) {
        <div class="spinner-center"><mat-spinner></mat-spinner></div>
      } @else if (reporte) {
        <!-- Total noticias -->
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-content>
              <mat-icon class="stat-icon">article</mat-icon>
              <div class="stat-number">{{ reporte.total }}</div>
              <div class="stat-label">Total Noticias</div>
            </mat-card-content>
          </mat-card>

          @for (e of reporte.porEstado; track e._id) {
            <mat-card class="stat-card {{ e._id }}">
              <mat-card-content>
                <mat-icon class="stat-icon">{{ estadoIcon(e._id) }}</mat-icon>
                <div class="stat-number">{{ e.cantidad }}</div>
                <div class="stat-label">{{ e._id | titlecase }}</div>
              </mat-card-content>
            </mat-card>
          }
        </div>

        <div class="charts-grid">
          <!-- Por categoría -->
          <mat-card>
            <mat-card-header>
              <mat-card-title><mat-icon>category</mat-icon> Noticias por Categoría</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              @for (cat of reporte.porCategoria; track cat._id) {
                <div class="bar-item">
                  <span class="bar-label">{{ cat.nombre || 'Sin categoría' }}</span>
                  <mat-progress-bar mode="determinate"
                    [value]="(cat.cantidad / reporte.total) * 100">
                  </mat-progress-bar>
                  <span class="bar-count">{{ cat.cantidad }}</span>
                </div>
              }
              @if (!reporte.porCategoria.length) {
                <p style="color:#999;text-align:center;padding:24px">Sin datos</p>
              }
            </mat-card-content>
          </mat-card>

          <!-- Más vistas -->
          <mat-card>
            <mat-card-header>
              <mat-card-title><mat-icon>trending_up</mat-icon> Top 5 — Más Vistas</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <mat-list>
                @for (n of reporte.masVistas; track n._id; let i = $index) {
                  <mat-list-item>
                    <span matListItemIcon class="rank">{{ i + 1 }}</span>
                    <span matListItemTitle>{{ n.titulo }}</span>
                    <span matListItemLine style="display:flex;align-items:center;gap:4px">
                      <mat-icon style="font-size:16px">visibility</mat-icon> {{ n.vistas }} vistas
                    </span>
                  </mat-list-item>
                  <mat-divider></mat-divider>
                }
                @if (!reporte.masVistas.length) {
                  <p style="color:#999;text-align:center;padding:24px">Sin datos</p>
                }
              </mat-list>
            </mat-card-content>
          </mat-card>
        </div>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; flex-wrap: wrap; }
    .page-header h1 { display: flex; align-items: center; gap: 8px; font-size: 24px; color: #3f51b5; margin: 0; }
    .subtitle { color: #888; font-size: 12px; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; margin-bottom: 24px; }
    .stat-card { text-align: center; }
    .stat-card.publicada  { border-top: 3px solid #4caf50; }
    .stat-card.borrador   { border-top: 3px solid #9e9e9e; }
    .stat-card.archivada  { border-top: 3px solid #ff5722; }
    .stat-icon { font-size: 36px; width: 36px; height: 36px; color: #3f51b5; margin: 8px 0; display: block; }
    .stat-number { font-size: 36px; font-weight: 700; color: #3f51b5; }
    .stat-label { color: #666; font-size: 14px; margin-top: 4px; }
    .charts-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .bar-item { display: flex; align-items: center; gap: 10px; margin: 10px 0; }
    .bar-label { min-width: 120px; font-size: 13px; color: #555; }
    .bar-count { min-width: 30px; text-align: right; font-weight: 600; color: #3f51b5; }
    mat-progress-bar { flex: 1; }
    .rank { font-weight: 700; color: #ff9800; font-size: 18px; }
    .spinner-center { display: flex; justify-content: center; padding: 60px; }
    @media (max-width: 768px) { .charts-grid { grid-template-columns: 1fr; } }
  `]
})
export class ReportesComponent implements OnInit {
  reporte: Reporte | null = null;
  loading = true;

  constructor(private noticiasService: NoticiasService) {}

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading = true;
    this.noticiasService.reporte().subscribe({
      next: res => {
        this.reporte = res.reporte;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  estadoIcon(estado: string): string {
    return { publicada: 'check_circle', borrador: 'drafts', archivada: 'archive' }[estado] || 'article';
  }
}
