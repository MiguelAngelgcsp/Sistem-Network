import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterLink,
    MatCardModule, MatFormFieldModule, MatInputModule,
    MatButtonModule, MatIconModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-wrapper">
      <mat-card class="auth-card">
        <mat-card-header>
          <mat-card-title>
            <mat-icon color="primary">wifi</mat-icon>
            Sistem Network
          </mat-card-title>
          <mat-card-subtitle>Iniciar Sesión — CKN Cable Konrad Network</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width">
              <mat-label>Correo electrónico</mat-label>
              <input matInput type="email" formControlName="email" placeholder="usuario@konrad.edu.co">
              <mat-icon matSuffix>email</mat-icon>
              @if (form.get('email')?.hasError('required') && form.get('email')?.touched) {
                <mat-error>El correo es requerido</mat-error>
              }
              @if (form.get('email')?.hasError('email')) {
                <mat-error>Correo inválido</mat-error>
              }
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Contraseña</mat-label>
              <input matInput [type]="hidePass ? 'password' : 'text'" formControlName="password">
              <button mat-icon-button matSuffix type="button" (click)="hidePass = !hidePass">
                <mat-icon>{{ hidePass ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (form.get('password')?.hasError('required') && form.get('password')?.touched) {
                <mat-error>La contraseña es requerida</mat-error>
              }
            </mat-form-field>

            <button mat-raised-button color="primary" class="full-width submit-btn"
                    type="submit" [disabled]="form.invalid || loading">
              @if (loading) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                <mat-icon>login</mat-icon> Ingresar
              }
            </button>
          </form>
        </mat-card-content>

        <mat-card-actions>
          <p class="text-center">
            ¿No tienes cuenta?
            <a routerLink="/auth/registro" mat-button color="primary">Regístrate</a>
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
    .auth-card {
      width: 100%; max-width: 420px;
      mat-card-header { margin-bottom: 16px; }
      mat-card-title { display: flex; align-items: center; gap: 8px; font-size: 22px; }
    }
    .submit-btn { margin-top: 8px; height: 44px; }
    .text-center { text-align: center; color: #666; font-size: 14px; }
    mat-spinner { display: inline-block; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  hidePass = true;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private snack: MatSnackBar
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    // Redirect if already logged in
    if (this.auth.isLoggedIn()) this.router.navigate(['/noticias']);
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;

    const { email, password } = this.form.value;
    this.auth.login(email, password).subscribe({
      next: res => {
        this.loading = false;
        if (res.exito) {
          this.snack.open(`¡Bienvenido/a ${res.usuario.nombre}!`, '', { duration: 3000, panelClass: 'success' });
          this.router.navigate(['/noticias']);
        }
      },
      error: err => {
        this.loading = false;
        const msg = err.error?.mensaje || 'Error al iniciar sesión';
        this.snack.open(msg, 'Cerrar', { duration: 4000, panelClass: 'error' });
      }
    });
  }
}
