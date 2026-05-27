import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoticiasService } from '../../../core/services/noticias.service';
import { AuthService } from '../../../core/services/auth.service';
import { Noticia } from '../../../core/models/models';

@Component({
  selector: 'app-detalle-noticia',
  standalone: true,
  imports: [
    CommonModule, RouterLink, ReactiveFormsModule,
    MatCardModule, MatButtonModule, MatIconModule, MatChipsModule,
    MatFormFieldModule, MatInputModule, MatListModule,
    MatDividerModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container" style="max-width:900px">
      @if (loading) {
        <div class="spinner-center"><mat-spinner></mat-spinner></div>
      } @else if (noticia) {

        <!-- Barra superior: volver + acciones admin -->
        <div class="top-bar">
          <a mat-button routerLink="/noticias">
            <mat-icon>arrow_back</mat-icon> Volver
          </a>

          @if (auth.isEditor() || auth.isAdmin()) {
            <div class="admin-actions">
              <span class="status-chip {{ noticia.estado }}">{{ noticia.estado }}</span>
              @if (auth.isEditor()) {
                <a mat-stroked-button color="primary" [routerLink]="['/editor', noticia._id]">
                  <mat-icon>edit</mat-icon> Editar
                </a>
              }
              @if (auth.isAdmin()) {
                <button mat-raised-button color="warn" (click)="eliminar()">
                  <mat-icon>delete</mat-icon> Eliminar
                </button>
              }
            </div>
          }
        </div>

        <!-- Contenido principal -->
        <mat-card class="main-card">
          @if (noticia.imagen) {
            <img mat-card-image [src]="noticia.imagen" [alt]="noticia.titulo" class="hero-img">
          }
          <mat-card-header>
            @if (noticia.categoria) {
              <mat-chip [style.background]="noticia.categoria.color || '#3f51b5'" style="color:#fff; margin-bottom:12px">
                {{ noticia.categoria.nombre }}
              </mat-chip>
            }
            <mat-card-title class="noticia-titulo">{{ noticia.titulo }}</mat-card-title>
            <mat-card-subtitle>
              <mat-icon>person</mat-icon>
              {{ noticia.autor?.nombre }} {{ noticia.autor?.apellido }}
              <span style="margin:0 8px">·</span>
              <mat-icon>calendar_today</mat-icon>
              {{ noticia.fechaPublicacion | date:'fullDate':'':'es' }}
              <span style="margin:0 8px">·</span>
              <mat-icon>visibility</mat-icon> {{ noticia.vistas }} vistas
            </mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            @if (noticia.etiquetas?.length) {
              <div class="etiquetas">
                @for (tag of noticia.etiquetas; track tag) {
                  <mat-chip>{{ tag }}</mat-chip>
                }
              </div>
            }
            <div class="contenido" [innerHTML]="noticia.contenido"></div>
          </mat-card-content>
        </mat-card>

        <!-- Comentarios -->
        <mat-card class="comentarios-card">
          <mat-card-header>
            <mat-card-title><mat-icon>comment</mat-icon> Comentarios ({{ comentarios.length }})</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            @if (auth.isLoggedIn()) {
              <div class="nuevo-comentario">
                <mat-form-field class="full-width" appearance="outline">
                  <mat-label>Escribe un comentario...</mat-label>
                  <textarea matInput [formControl]="textoCtrl" rows="3"></textarea>
                  @if (textoCtrl.hasError('minlength')) {
                    <mat-error>Mínimo 3 caracteres</mat-error>
                  }
                </mat-form-field>
                <button mat-raised-button color="primary"
                        [disabled]="textoCtrl.invalid || enviando"
                        (click)="enviarComentario()">
                  <mat-icon>send</mat-icon> Comentar
                </button>
              </div>
              <mat-divider></mat-divider>
            } @else {
              <p class="login-prompt">
                <a routerLink="/auth/login" mat-button color="primary">Inicia sesión</a> para comentar.
              </p>
            }

            <mat-list>
              @for (c of comentarios; track c._id) {
                <mat-list-item class="comment-item">
                  <mat-icon matListItemIcon>account_circle</mat-icon>
                  <div matListItemTitle class="comment-autor">
                    {{ c.autor?.nombre }} {{ c.autor?.apellido }}
                    <span class="comment-date">{{ c.createdAt | date:'d MMM y, H:mm':'':'es' }}</span>
                  </div>
                  <p matListItemLine class="comment-texto">{{ c.contenido }}</p>
                  @if (auth.isAdmin()) {
                    <button mat-icon-button color="warn" matListItemMeta (click)="eliminarComentario(c._id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  }
                </mat-list-item>
                <mat-divider></mat-divider>
              }
              @if (comentarios.length === 0) {
                <p class="sin-comentarios">Sé el primero en comentar.</p>
              }
            </mat-list>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .top-bar {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 16px; flex-wrap: wrap; gap: 8px;
    }
    .admin-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .main-card { margin-bottom: 24px; }
    .hero-img { max-height: 400px; object-fit: cover; }
    .noticia-titulo { font-size: 26px; line-height: 1.3; margin: 12px 0; }
    mat-card-subtitle { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; color: #666; }
    .etiquetas { display: flex; gap: 8px; flex-wrap: wrap; margin: 12px 0; }
    .contenido { font-size: 16px; line-height: 1.8; color: #333; margin-top: 16px; white-space: pre-line; }
    .nuevo-comentario { margin-bottom: 16px; }
    .comment-item { height: auto !important; padding: 12px 0; }
    .comment-autor { font-weight: 500; display: flex; justify-content: space-between; }
    .comment-date { font-size: 12px; color: #999; font-weight: 400; }
    .comment-texto { color: #555; white-space: pre-wrap; }
    .sin-comentarios { color: #999; text-align: center; padding: 24px; }
    .login-prompt { color: #666; margin-bottom: 12px; }
    .spinner-center { display: flex; justify-content: center; padding: 60px; }
    .status-chip { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase; }
    .status-chip.borrador  { background: #e0e0e0; color: #555; }
    .status-chip.publicada { background: #c8e6c9; color: #2e7d32; }
    .status-chip.archivada { background: #ffccbc; color: #bf360c; }
  `]
})
export class DetalleNoticiaComponent implements OnInit {
  noticia: Noticia | null = null;
  comentarios: any[] = [];
  loading = true;
  enviando = false;
  textoCtrl = new FormControl('', [Validators.required, Validators.minLength(3)]);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noticiasService: NoticiasService,
    public auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.noticiasService.obtener(id).subscribe({
      next: res => {
        this.noticia = res.noticia;
        this.loading = false;
        this.cargarComentarios(id);
      },
      error: () => { this.loading = false; }
    });
  }

  cargarComentarios(id: string): void {
    this.noticiasService.comentarios(id).subscribe(res => {
      if (res.exito) this.comentarios = res.comentarios;
    });
  }

  enviarComentario(): void {
    if (this.textoCtrl.invalid || !this.noticia) return;
    this.enviando = true;
    this.noticiasService.comentar(this.noticia._id, this.textoCtrl.value!).subscribe({
      next: res => {
        this.enviando = false;
        if (res.exito) {
          this.comentarios.unshift(res.comentario);
          this.textoCtrl.reset();
          this.snack.open('Comentario enviado', '', { duration: 2500, panelClass: 'success' });
        }
      },
      error: err => {
        this.enviando = false;
        this.snack.open(err.error?.mensaje || 'Error', 'Cerrar', { duration: 3000, panelClass: 'error' });
      }
    });
  }

  eliminar(): void {
    if (!this.noticia) return;
    if (!confirm(`¿Eliminar la noticia "${this.noticia.titulo}"? Esta acción no se puede deshacer.`)) return;
    this.noticiasService.eliminar(this.noticia._id).subscribe({
      next: res => {
        if (res.exito) {
          this.snack.open('Noticia eliminada', '', { duration: 2500 });
          this.router.navigate(['/noticias']);
        }
      },
      error: err => this.snack.open(err.error?.mensaje || 'Error al eliminar', 'Cerrar', { duration: 4000, panelClass: 'error' })
    });
  }

  eliminarComentario(id: string): void {
    this.noticiasService.eliminarComentario(id).subscribe(res => {
      if (res.exito) {
        this.comentarios = this.comentarios.filter(c => c._id !== id);
        this.snack.open('Comentario eliminado', '', { duration: 2000 });
      }
    });
  }
}
