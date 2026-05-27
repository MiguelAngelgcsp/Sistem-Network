import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, AuthResponse } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API = environment.apiUrl;

  // Signal-based reactive state
  private _usuario = signal<Usuario | null>(this.loadUser());
  private _token = signal<string | null>(localStorage.getItem('sn_token'));

  readonly usuario = this._usuario.asReadonly();
  readonly token   = this._token.asReadonly();

  readonly isLoggedIn = computed(() => !!this._token());
  readonly isAdmin    = computed(() => this._usuario()?.rol === 'administrador');
  readonly isEditor   = computed(() => this._usuario()?.rol === 'editor' || this.isAdmin());

  constructor(private http: HttpClient, private router: Router) {}

  private loadUser(): Usuario | null {
    try { return JSON.parse(localStorage.getItem('sn_user') || 'null'); }
    catch { return null; }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/login`, { email, password }).pipe(
      tap(res => {
        if (res.exito) {
          localStorage.setItem('sn_token', res.token);
          localStorage.setItem('sn_user', JSON.stringify(res.usuario));
          this._token.set(res.token);
          this._usuario.set(res.usuario);
        }
      })
    );
  }

  registro(datos: Partial<Usuario> & { password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API}/auth/registro`, datos);
  }

  logout(): void {
    localStorage.removeItem('sn_token');
    localStorage.removeItem('sn_user');
    this._token.set(null);
    this._usuario.set(null);
    this.router.navigate(['/auth/login']);
  }

  actualizarPerfil(datos: Partial<Usuario>): Observable<{ exito: boolean; usuario: Usuario }> {
    return this.http.put<{ exito: boolean; usuario: Usuario }>(`${this.API}/auth/perfil`, datos).pipe(
      tap(res => {
        if (res.exito) {
          localStorage.setItem('sn_user', JSON.stringify(res.usuario));
          this._usuario.set(res.usuario);
        }
      })
    );
  }
}
