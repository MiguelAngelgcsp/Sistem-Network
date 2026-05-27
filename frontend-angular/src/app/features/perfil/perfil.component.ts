import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSelectModule,
    MatDividerModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="page-container" style="max-width:640px">
      <h1><mat-icon>account_circle</mat-icon> Mi Perfil</h1>

      <mat-card class="perfil-card">
        <!-- Avatar -->
        <div class="avatar-section">
          <div class="avatar">
            <mat-icon>person</mat-icon>
          </div>
          <div>
            <h2>{{ auth.usuario()?.nombre }} {{ auth.usuario()?.apellido }}</h2>
            <span class="badge-rol {{ auth.usuario()?.rol }}">{{ auth.usuario()?.rol }}</span>
            <p class="email">{{ auth.usuario()?.email }}</p>
          </div>
        </div>

        <mat-divider style="margin:20px 0"></mat-divider>

        <mat-card-content>
          <h3>Editar información</h3>
          <form [formGroup]="form" (ngSubmit)="onSubmit()" style="margin-top:16px">
            <div class="row-2">
              <mat-form-field appearance="outline">
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="nombre">
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="apellido">
              </mat-form-field>
            </div>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Programa académico</mat-label>
              <input matInput formControlName="programa">
              <mat-icon matSuffix>school</mat-icon>
            </mat-form-field>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>Semestre</mat-label>
              <mat-select formControlName="semestre">
                @for (s of semestres; track s) {
                  <mat-option [value]="s">Semestre {{ s }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field class="full-width" appearance="outline">
              <mat-label>URL foto de perfil</mat-label>
              <input matInput formControlName="fotoPerfil" placeholder="https://...">
              <mat-icon matSuffix>photo_camera</mat-icon>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit"
                    [disabled]="form.invalid || guardando" class="full-width">
              @if (guardando) { <mat-spinner diameter="20"></mat-spinner> }
              @else { <mat-icon>save</mat-icon> Guardar Cambios }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    h1 { display: flex; align-items: center; gap: 8px; font-size: 26px; color: #3f51b5; margin-bottom: 20px; }
    .avatar-section { display: flex; align-items: center; gap: 20px; padding: 20px; }
    .avatar {
      width: 80px; height: 80px; border-radius: 50%;
      background: #e8eaf6; display: flex; align-items: center; justify-content: center;
      mat-icon { font-size: 48px; color: #9fa8da; }
    }
    .avatar-section h2 { font-size: 22px; margin-bottom: 4px; }
    .email { color: #888; font-size: 14px; margin-top: 4px; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  `]
})
export class PerfilComponent implements OnInit {
  form!: FormGroup;
  guardando = false;
  semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private snack: MatSnackBar
  ) {}

  ngOnInit(): void {
    const u = this.auth.usuario();
    this.form = this.fb.group({
      nombre:     [u?.nombre || '', Validators.required],
      apellido:   [u?.apellido || '', Validators.required],
      programa:   [u?.programa || ''],
      semestre:   [u?.semestre || null],
      fotoPerfil: [u?.fotoPerfil || ''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.guardando = true;
    this.auth.actualizarPerfil(this.form.value).subscribe({
      next: res => {
        this.guardando = false;
        if (res.exito) {
          this.snack.open('Perfil actualizado ', '', { duration: 2500, panelClass: 'success' });
        }
      },
      error: err => {
        this.guardando = false;
        this.snack.open(err.error?.mensaje || 'Error al guardar', 'Cerrar', { duration: 4000, panelClass: 'error' });
      }
    });
  }
}
