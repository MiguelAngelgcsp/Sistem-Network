import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Categoria, ListaCategorias } from '../models/models';

@Injectable({ providedIn: 'root' })
export class CategoriasService {
  private readonly API = `${environment.apiUrl}/categorias`;

  constructor(private http: HttpClient) {}

  listar(soloActivas = false): Observable<ListaCategorias> {
    const params = soloActivas ? '?activa=true' : '';
    return this.http.get<ListaCategorias>(`${this.API}${params}`);
  }

  obtener(id: string): Observable<{ exito: boolean; categoria: Categoria }> {
    return this.http.get<{ exito: boolean; categoria: Categoria }>(`${this.API}/${id}`);
  }

  crear(datos: Partial<Categoria>): Observable<{ exito: boolean; mensaje: string; categoria: Categoria }> {
    return this.http.post<{ exito: boolean; mensaje: string; categoria: Categoria }>(this.API, datos);
  }

  editar(id: string, datos: Partial<Categoria>): Observable<{ exito: boolean; mensaje: string; categoria: Categoria }> {
    return this.http.put<{ exito: boolean; mensaje: string; categoria: Categoria }>(`${this.API}/${id}`, datos);
  }

  eliminar(id: string): Observable<{ exito: boolean; mensaje: string }> {
    return this.http.delete<{ exito: boolean; mensaje: string }>(`${this.API}/${id}`);
  }
}
