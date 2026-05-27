import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CategoriasService } from '../../../core/services/categorias.service';
import { Categoria } from '../../../core/models/models';

@Component({
  selector: 'app-categoria-form-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatSlideToggleModule, MatSnackBarModule
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ editMode ? 'edit' : 'add_circle' }}</mat-icon>
      {{ editMode ? 'Editar' : 'Nueva' }} Categoría
    </h2>
    <mat-dialog-content>
      <form [formGroup]="form" id="catForm">
        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Nombre *</mat-label>
          <input matInput formControlName="nombre">
          @if (f['nombre'].hasError('required') && f['nombre'].touched) {
            <mat-error>El nombre es requerido</mat-error>
          }
        </mat-form-field>

        <mat-form-field class="full-width" appearance="outline">
          <mat-label>Descripción</mat-label>
          <textarea matInput formControlName="descripcion" rows="3"></textarea>
        </mat-form-field>

        <div class="color-row">
          <mat-form-field appearance="outline" style="flex:1">
            <mat-label>Color (hex)</mat-label>
            <input matInput formControlName="color" placeholder="#3f51b5">
          </mat-form-field>
          <div class="color-preview" [style.background]="form.get('color')?.value || '#999'"></div>
        </div>

        @if (editMode) {
          <mat-slide-toggle formControlName="activa" color="primary">
            Categoría activa
          </mat-slide-toggle>
        }
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary"
              [disabled]="form.invalid || guardando"
              (click)="guardar()">
        <mat-icon>save</mat-icon> Guardar
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .color-row { display: flex; align-items: center; gap: 12px; }
    .color-preview { width: 40px; height: 40px; border-radius: 50%; border: 2px solid rgba(0,0,0,.15); flex-shrink: 0; }
    form { display: flex; flex-direction: column; gap: 4px; padding-top: 8px; }
  `]
})
export class CategoriaFormDialogComponent implements OnInit {
  form!: FormGroup;
  editMode = false;
  guardando = false;
  get f() { return this.form.controls; }

  constructor(
    private fb: FormBuilder,
    private service: CategoriasService,
    private snack: MatSnackBar,
    private dialogRef: MatDialogRef<CategoriaFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Categoria | null
  ) {}

  ngOnInit(): void {
    this.editMode = !!this.data;
    this.form = this.fb.group({
      nombre:      [this.data?.nombre || '', Validators.required],
      descripcion: [this.data?.descripcion || ''],
      color:       [this.data?.color || '#3f51b5'],
      activa:      [this.data?.activa ?? true],
    });
  }

  guardar(): void {
    if (this.form.invalid) return;
    this.guardando = true;
    const op = this.editMode
      ? this.service.editar(this.data!._id, this.form.value)
      : this.service.crear(this.form.value);

    op.subscribe({
      next: res => {
        this.guardando = false;
        if (res.exito) {
          this.snack.open(res.mensaje, '', { duration: 2500, panelClass: 'success' });
          this.dialogRef.close(true);
        }
      },
      error: err => {
        this.guardando = false;
        this.snack.open(err.error?.mensaje || 'Error', 'Cerrar', { duration: 4000, panelClass: 'error' });
      }
    });
  }
}
