import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule,
    MatProgressSpinnerModule, MatSelectModule
  ],
  template: `
    <div class="auth-wrapper">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title><mat-icon color="primary">person_add</mat-icon> Crear Cuenta</mat-card-title>
          <mat-card-subtitle>Únete a la comunidad Konrad</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <div class="row-2">
              <mat-form-field>
                <mat-label>Nombre</mat-label>
                <input matInput formControlName="nombre">
                @if (f['nombre'].hasError('required') && f['nombre'].touched) {
                  <mat-error>Requerido</mat-error>
                }
              </mat-form-field>
              <mat-form-field>
                <mat-label>Apellido</mat-label>
                <input matInput formControlName="apellido">
                @if (f['apellido'].hasError('required') && f['apellido'].touched) {
                  <mat-error>Requerido</mat-error>
                }
              </mat-form-field>
            </div>

            <mat-form-field class="full-width">
              <mat-label>Correo electrónico</mat-label>
              <input matInput type="email" formControlName="email">
              <mat-icon matSuffix>email</mat-icon>
              @if (f['email'].hasError('email')) {
                <mat-error>Correo inválido</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Programa académico</mat-label>
              <input matInput formControlName="programa">
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Semestre</mat-label>
              <mat-select formControlName="semestre">
                @for (s of semestres; track s) {
                  <mat-option [value]="s">Semestre {{ s }}</mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="hidePass ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePass = !hidePass">
                <mat-icon>{{ hidePass ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (f['password'].hasError('minlength')) {
                <mat-error>Mínimo 6 caracteres</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Confirmar contraseña</mat-label>
              <input matInput type="password" formControlName="confirmar">
              @if (form.hasError('noCoincide') && f['confirmar'].touched) {
                <mat-error>Las contraseñas no coinciden</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" class="full-width submit-btn"
                    type="submit" [disabled]="form.invalid || loading">
              @if (loading) { <mat-spinner diameter="20"></mat-spinner> }
              @else { <mat-icon>how_to_reg</mat-icon> Registrarme }
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="text-center">
            ¿Ya tienes cuenta?
            <a routerLink="/auth/login" mat-button color="primary">Inicia sesión</a>
          </p>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: calc(100vh - 64px);
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #3f51b5 0%, #1a237e 100%);
      padding: 24px;
    }
    .auth-card { width: 100%; max-width: 460px; }
    mat-card-title { display: flex; align-items: center; gap: 8px; }
    .row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .submit-btn { margin-top: 8px; height: 44px; }
    .text-center { text-align: center; color: #666; font-size: 14px; }
  `]
})
export class RegisterComponent {
  form: FormGroup;
  loading = false;
  hidePass = true;
  semestres = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  get f(): { [key: string]: AbstractControl } { return this.form.controls; }

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      nombre:    ['', Validators.required],
      apellido:  ['', Validators.required],
      email:     ['', [Validators.required, Validators.email]],
      programa:  [''],
      semestre:  [null],
      password:  ['', [Validators.required, Validators.minLength(6)]],
      confirmar: ['', Validators.required],
    }, { validators: this.passwordMatch });
  }

  passwordMatch(g: AbstractControl) {
    return g.get('password')?.value === g.get('confirmar')?.value ? null : { noCoincide: true };
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    const { confirmar, ...datos } = this.form.value;
    this.auth.registro(datos).subscribe({
      next: res => {
        this.loading = false;
        if (res.exito) {
          this.snack.open('¡Cuenta creada! Inicia sesión.', '', { duration: 3000, panelClass: 'success' });
          this.router.navigate(['/auth/login']);
        }
      },
      error: err => {
        this.loading = false;
        this.snack.open(err.error?.mensaje || 'Error al registrar', 'Cerrar', { duration: 4000, panelClass: 'error' });
      }
    });
  }
}
