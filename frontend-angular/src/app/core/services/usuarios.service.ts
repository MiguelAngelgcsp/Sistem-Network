import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Usuario, ListaUsuarios } from '../models/models';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private readonly API = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<ListaUsuarios> {
    return this.http.get<ListaUsuarios>(this.API);
  }

  obtener(id: string): Observable<{ exito: boolean; usuario: Usuario }> {
    return this.http.get<{ exito: boolean; usuario: Usuario }>(`${this.API}/${id}`);
  }

  editar(id: string, datos: Partial<Usuario>): Observable<{ exito: boolean; mensaje: string; usuario: Usuario }> {
    return this.http.put<{ exito: boolean; mensaje: string; usuario: Usuario }>(`${this.API}/${id}`, datos);
  }

  eliminar(id: string): Observable<{ exito: boolean; mensaje: string }> {
    return this.http.delete<{ exito: boolean; mensaje: string }>(`${this.API}/${id}`);
  }

  asignarRol(id: string, rol: string): Observable<{ exito: boolean; mensaje: string }> {
    return this.http.patch<{ exito: boolean; mensaje: string }>(`${this.API}/${id}/rol`, { rol });
  }
}
