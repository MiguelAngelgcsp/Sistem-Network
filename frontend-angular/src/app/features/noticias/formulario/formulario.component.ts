import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { NoticiasService } from '../../../core/services/noticias.service';
import { CategoriasService } from '../../../core/services/categorias.service';
import { AuthService } from '../../../core/services/auth.service';
import { Categoria } from '../../../core/models/models';

@Component({
  selector: 'app-formulario-noticia',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatCheckboxModule, MatChipsModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatDividerModule
  ],
  template: `
    <div class="page-container" style="max-width:800px">
      <div class="page-header">
        <a mat-button routerLink="/noticias"><mat-icon>arrow_back</mat-icon></a>
        <h1>{{ editMode ? 'Editar Noticia' : 'Nueva Noticia' }}</h1>
      </div>

      @if (loadingNoticia) {
        <div class="spinner-center"><mat-spinner></mat-spinner></div>
      } @else {
        <mat-card>
          <mat-card-content>
            <form [formGroup]="form" (ngSubmit)="onSubmit()">
              <!-- Estado actual (solo edición) -->
              @if (editMode && estadoActual) {
                <div class="estado-bar">
                  <span>Estado actual: </span>
                  <span class="status-chip {{ estadoActual }}">{{ estadoActual }}</span>
                  @if (auth.isEditor() && estadoActual === 'borrador') {
                    <button mat-stroked-button color="primary" type="button" (click)="publicar()">
                      <mat-icon>publish</mat-icon> Publicar
                    </button>
                  }
                  @if (auth.isAdmin() && estadoActual === 'publicada') {
                    <button mat-stroked-button color="warn" type="button" (click)="archivar()">
                      <mat-icon>archive</mat-icon> Archivar
                    </button>
                  }
                </div>
              }

              <mat-form-field class="full-width" appearance="outline">
                <mat-label>Título *</mat-label>
                <input matInput formControlName="titulo">
                @if (f['titulo'].hasError('required') && f['titulo'].touched) {
                  <mat-error>El título es requerido</mat-error>
                }
              </mat-form-field>

              <mat-form-field class="full-width" appearance="outline">
                <mat-label>Resumen</mat-label>
                <textarea matInput formControlName="resumen" rows="2"
                          placeholder="Breve descripción para la vista previa"></textarea>
              </mat-form-field>

              <mat-form-field class="full-width" appearance="outline">
                <mat-label>Contenido *</mat-label>
                <textarea matInput formControlName="contenido" rows="10"></textarea>
                @if (f['contenido'].hasError('required') && f['contenido'].touched) {
                  <mat-error>El contenido es requerido</mat-error>
                }
              </mat-form-field>

              <div class="row-2">
                <mat-form-field appearance="outline">
                  <mat-label>Categoría *</mat-label>
                  <mat-select formControlName="categoria">
                    @for (cat of categorias; track cat._id) {
                      <mat-option [value]="cat._id">
                        <span class="color-dot" [style.background]="cat.color || '#999'"></span>
                        {{ cat.nombre }}
                      </mat-option>
                    }
                  </mat-select>
                  @if (f['categoria'].hasError('required') && f['categoria'].touched) {
                    <mat-error>Selecciona una categoría</mat-error>
                  }
                </mat-form-field>

                <mat-form-field appearance="outline">
                  <mat-label>URL de imagen</mat-label>
                  <input matInput formControlName="imagen" placeholder="https://...">
                  <mat-icon matSuffix>image</mat-icon>
                </mat-form-field>
              </div>

              <mat-form-field class="full-width" appearance="outline">
                <mat-label>Etiquetas (separadas por coma)</mat-label>
                <input matInput formControlName="etiquetasRaw" placeholder="angular, backend, evento">
                <mat-icon matSuffix>local_offer</mat-icon>
              </mat-form-field>

              <mat-checkbox formControlName="destacada" color="primary">
                <mat-icon>star</mat-icon> Marcar como destacada
              </mat-checkbox>

              <mat-divider style="margin:20px 0"></mat-divider>

              <div class="actions-row">
                <button mat-raised-button color="primary" type="submit"
                        [disabled]="form.invalid || guardando">
                  @if (guardando) { <mat-spinner diameter="20"></mat-spinner> }
                  @else { <mat-icon>save</mat-icon> {{ editMode ? 'Guardar Cambios' : 'Crear Noticia' }} }
                </button>
                <a mat-stroked-button routerLink="/noticias">Cancelar</a>
              </div>
            </form>
          </mat-card-content>
        </mat-card>
      }
    </div>
  `,
  styles: [`
    .page-header { display: flex; align-items: center; gap: 8px; margin-bottom: 20px; h1 { font-size: 24px; } }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
    .estado-bar { display: flex; align-items: center; gap: 12px; margin-bottom: 16px; padding: 10px 14px; background: #f5f5f5; border-radius: 6px; }
    .spinner-center { display: flex; justify-content: center; padding: 60px; }
    mat-checkbox { margin-bottom: 8px; }
  `]
})
export class FormularioNoticiaComponent implements OnInit {
  form!: FormGroup;
  categorias: Categoria[] = [];
  editMode = false;
  noticiaId: string | null = null;
  estadoActual = '';
  guardando = false;
  loadingNoticia = false;

  get f() { return this.form.controls; }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private noticiasService: NoticiasService,
    private categoriasService: CategoriasService,
    public auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo:      ['', Validators.required],
      resumen:     [''],
      contenido:   ['', Validators.required],
      categoria:   ['', Validators.required],
      imagen:      [''],
      etiquetasRaw:[''],
      destacada:   [false],
    });

    this.categoriasService.listar(true).subscribe(res => {
      if (res.exito) this.categorias = res.categorias;
    });

    this.noticiaId = this.route.snapshot.paramMap.get('id');
    if (this.noticiaId) {
      this.editMode = true;
      this.loadingNoticia = true;
      this.noticiasService.obtener(this.noticiaId).subscribe(res => {
        const n = res.noticia;
        this.estadoActual = n.estado;
        this.form.patchValue({
          titulo:       n.titulo,
          resumen:      n.resumen,
          contenido:    n.contenido,
          categoria:    typeof n.categoria === 'object' ? n.categoria?._id : n.categoria,
          imagen:       n.imagen,
          etiquetasRaw: n.etiquetas?.join(', '),
          destacada:    n.destacada,
        });
        this.loadingNoticia = false;
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.guardando = true;
    const { etiquetasRaw, ...rest } = this.form.value;
    const datos = {
      ...rest,
      etiquetas: etiquetasRaw ? etiquetasRaw.split(',').map((t: string) => t.trim()).filter(Boolean) : []
    };

    const op = this.editMode
      ? this.noticiasService.editar(this.noticiaId!, datos)
      : this.noticiasService.crear(datos);

    op.subscribe({
      next: res => {
        this.guardando = false;
        if (res.exito) {
          this.snack.open(res.mensaje, '', { duration: 3000, panelClass: 'success' });
          this.router.navigate(['/noticias', res.noticia._id]);
        }
      },
      error: err => {
        this.guardando = false;
        this.snack.open(err.error?.mensaje || 'Error al guardar', 'Cerrar', { duration: 4000, panelClass: 'error' });
      }
    });
  }

  publicar(): void {
    this.noticiasService.publicar(this.noticiaId!).subscribe(res => {
      if (res.exito) {
        this.estadoActual = 'publicada';
        this.snack.open('Noticia publicada ', '', { duration: 2500, panelClass: 'success' });
      }
    });
  }

  archivar(): void {
    this.noticiasService.archivar(this.noticiaId!).subscribe(res => {
      if (res.exito) {
        this.estadoActual = 'archivada';
        this.snack.open('Noticia archivada', '', { duration: 2500 });
      }
    });
  }
}
