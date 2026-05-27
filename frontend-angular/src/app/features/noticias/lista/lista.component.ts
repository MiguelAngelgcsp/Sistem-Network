import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NoticiasService } from '../../../core/services/noticias.service';
import { CategoriasService } from '../../../core/services/categorias.service';
import { AuthService } from '../../../core/services/auth.service';
import { Noticia, Categoria } from '../../../core/models/models';

@Component({
  selector: 'app-lista-noticias',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatProgressSpinnerModule, MatPaginatorModule, MatBadgeModule,
    MatTooltipModule, MatSnackBarModule
  ],
  template: `
    <div class="page-container">
      <div class="header-row">
        <div>
          <h1><mat-icon>article</mat-icon> Noticias</h1>
          <span class="subtitle">Portal informativo — Konrad Lorenz</span>
        </div>
        @if (auth.isEditor()) {
          <a mat-raised-button color="primary" routerLink="/editor">
            <mat-icon>add</mat-icon> Nueva Noticia
          </a>
        }
      </div>

      <!-- Filtros -->
      <div class="filters-bar mat-elevation-z2">
        <mat-form-field appearance="outline">
          <mat-label>Buscar</mat-label>
          <input matInput [formControl]="buscarCtrl" placeholder="Título, contenido...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Categoría</mat-label>
          <mat-select [formControl]="catCtrl">
            <mat-option value="">Todas</mat-option>
            @for (cat of categorias; track cat._id) {
              <mat-option [value]="cat._id">
                <span class="color-dot" [style.background]="cat.color || '#999'"></span>
                {{ cat.nombre }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        @if (auth.isEditor()) {
          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select [formControl]="estadoCtrl">
              <mat-option value="">Todos</mat-option>
              <mat-option value="borrador">Borrador</mat-option>
              <mat-option value="publicada">Publicada</mat-option>
              <mat-option value="archivada">Archivada</mat-option>
            </mat-select>
          </mat-form-field>
        }
      </div>

      <!-- Grid noticias -->
      @if (loading) {
        <div class="spinner-center"><mat-spinner></mat-spinner></div>
      } @else if (noticias.length === 0) {
        <div class="empty-state">
          <mat-icon>inbox</mat-icon>
          <p>No hay noticias disponibles.</p>
        </div>
      } @else {
        <div class="noticias-grid">
          @for (n of noticias; track n._id) {
            <mat-card class="noticia-card" [class.destacada]="n.destacada">
              @if (n.destacada) {
                <div class="badge-destacada"><mat-icon>star</mat-icon> Destacada</div>
              }
              @if (n.imagen) {
                <img mat-card-image [src]="n.imagen" [alt]="n.titulo" class="card-img">
              } @else {
                <div class="card-img-placeholder">
                  <mat-icon>article</mat-icon>
                </div>
              }
              <mat-card-header>
                @if (n.categoria) {
                  <mat-chip class="cat-chip" [style.background]="n.categoria.color || '#3f51b5'">
                    {{ n.categoria.nombre }}
                  </mat-chip>
                }
                <mat-card-title>{{ n.titulo }}</mat-card-title>
                <mat-card-subtitle>
                  <mat-icon style="font-size:14px">person</mat-icon>
                  {{ n.autor?.nombre }} {{ n.autor?.apellido }} ·
                  {{ n.fechaPublicacion | date:'d MMM y':'':'es' }}
                </mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p class="resumen">{{ n.resumen || (n.contenido | slice:0:140) }}...</p>
              </mat-card-content>
              <mat-card-actions>
                <a mat-button color="primary" [routerLink]="['/noticias', n._id]">
                  <mat-icon>open_in_new</mat-icon> Leer más
                </a>
                <div class="card-actions-right">
                  <span class="meta-views">
                    <mat-icon>visibility</mat-icon> {{ n.vistas }}
                    <mat-icon style="margin-left:8px">comment</mat-icon> {{ n.numComentarios || 0 }}
                  </span>
                  @if (auth.isEditor()) {
                    <a mat-icon-button color="accent"
                       [routerLink]="['/editor', n._id]"
                       matTooltip="Editar noticia">
                      <mat-icon>edit</mat-icon>
                    </a>
                  }
                  @if (auth.isAdmin()) {
                    <button mat-icon-button color="warn"
                            matTooltip="Eliminar noticia"
                            (click)="eliminar(n)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  }
                </div>
              </mat-card-actions>
            </mat-card>
          }
        </div>

        <mat-paginator
          [length]="total"
          [pageSize]="limite"
          [pageSizeOptions]="[6, 12, 24]"
          (page)="onPage($event)"
          showFirstLastButtons>
        </mat-paginator>
      }
    </div>
  `,
  styles: [`
    .header-row { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
    .header-row h1 { display: flex; align-items: center; gap: 8px; font-size: 28px; color: #3f51b5; margin: 0; }
    .subtitle { color: #888; font-size: 14px; }
    .filters-bar {
      display: flex; gap: 16px; flex-wrap: wrap;
      background: #fff; padding: 16px; border-radius: 8px; margin-bottom: 24px;
      mat-form-field { flex: 1; min-width: 200px; }
    }
    .noticias-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px; margin-bottom: 16px;
    }
    .noticia-card { position: relative; overflow: hidden; transition: transform .2s, box-shadow .2s; }
    .noticia-card:hover { transform: translateY(-4px); box-shadow: 0 8px 24px rgba(0,0,0,0.12); }
    .noticia-card.destacada { border-top: 3px solid #ff9800; }
    .badge-destacada {
      position: absolute; top: 8px; right: 8px;
      background: #ff9800; color: #fff;
      padding: 3px 10px; border-radius: 12px; font-size: 11px;
      display: flex; align-items: center; gap: 4px;
    }
    .card-img { height: 180px; object-fit: cover; width: 100%; }
    .card-img-placeholder {
      height: 140px; background: #e8eaf6;
      display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 48px; color: #9fa8da; }
    }
    .cat-chip { font-size: 11px; color: #fff; margin-bottom: 8px; }
    .resumen { color: #555; font-size: 14px; line-height: 1.6; }
    mat-card-actions { display: flex; align-items: center; justify-content: space-between; padding: 4px 8px; }
    .card-actions-right { display: flex; align-items: center; gap: 2px; }
    .meta-views { font-size: 12px; color: #999; display: flex; align-items: center; gap: 4px; }
    .spinner-center { display: flex; justify-content: center; padding: 60px; }
    .empty-state { text-align: center; padding: 60px; color: #999; mat-icon { font-size: 64px; display: block; margin-bottom: 16px; } }
  `]
})
export class ListaNoticiasComponent implements OnInit {
  noticias: Noticia[] = [];
  categorias: Categoria[] = [];
  total = 0;
  pagina = 1;
  limite = 6;
  loading = false;

  buscarCtrl = new FormControl('');
  catCtrl    = new FormControl('');
  estadoCtrl = new FormControl('');

  constructor(
    private noticiasService: NoticiasService,
    private categoriasService: CategoriasService,
    public auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarNoticias();

    this.buscarCtrl.valueChanges.pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => { this.pagina = 1; this.cargarNoticias(); });

    this.catCtrl.valueChanges
      .subscribe(() => { this.pagina = 1; this.cargarNoticias(); });

    this.estadoCtrl.valueChanges
      .subscribe(() => { this.pagina = 1; this.cargarNoticias(); });
  }

  cargarCategorias(): void {
    this.categoriasService.listar(true).subscribe(res => {
      if (res.exito) this.categorias = res.categorias;
    });
  }

  cargarNoticias(): void {
    this.loading = true;
    this.noticiasService.listar({
      pagina: this.pagina,
      limite: this.limite,
      buscar: this.buscarCtrl.value || undefined,
      categoria: this.catCtrl.value || undefined,
      estado: this.estadoCtrl.value || undefined,
    }).subscribe({
      next: res => {
        this.noticias = res.noticias;
        this.total    = res.total;
        this.loading  = false;
      },
      error: () => { this.loading = false; }
    });
  }

  eliminar(n: Noticia): void {
    if (!confirm(`¿Eliminar la noticia "${n.titulo}"? Esta acción no se puede deshacer.`)) return;
    this.noticiasService.eliminar(n._id).subscribe({
      next: res => {
        if (res.exito) {
          this.snack.open('Noticia eliminada', '', { duration: 2500 });
          this.cargarNoticias();
        }
      },
      error: err => this.snack.open(err.error?.mensaje || 'Error al eliminar', 'Cerrar', { duration: 4000, panelClass: 'error' })
    });
  }

  onPage(e: PageEvent): void {
    this.pagina = e.pageIndex + 1;
    this.limite = e.pageSize;
    this.cargarNoticias();
  }
}
