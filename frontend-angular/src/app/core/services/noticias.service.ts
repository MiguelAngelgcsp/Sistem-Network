import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Noticia, ListaNoticias, Reporte } from '../models/models';

export interface FiltrosNoticias {
  estado?: string;
  categoria?: string;
  buscar?: string;
  pagina?: number;
  limite?: number;
  destacada?: boolean;
}

@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private readonly API = `${environment.apiUrl}/noticias`;

  constructor(private http: HttpClient) {}

  listar(filtros: FiltrosNoticias = {}): Observable<ListaNoticias> {
    let params = new HttpParams();
    Object.entries(filtros).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        params = params.set(k, String(v));
      }
    });
    return this.http.get<ListaNoticias>(this.API, { params });
  }

  obtener(id: string): Observable<{ exito: boolean; noticia: Noticia }> {
    return this.http.get<{ exito: boolean; noticia: Noticia }>(`${this.API}/${id}`);
  }

  crear(datos: Partial<Noticia>): Observable<{ exito: boolean; mensaje: string; noticia: Noticia }> {
    return this.http.post<{ exito: boolean; mensaje: string; noticia: Noticia }>(this.API, datos);
  }

  editar(id: string, datos: Partial<Noticia>): Observable<{ exito: boolean; mensaje: string; noticia: Noticia }> {
    return this.http.put<{ exito: boolean; mensaje: string; noticia: Noticia }>(`${this.API}/${id}`, datos);
  }

  publicar(id: string): Observable<{ exito: boolean; mensaje: string }> {
    return this.http.patch<{ exito: boolean; mensaje: string }>(`${this.API}/${id}/publicar`, {});
  }

  archivar(id: string): Observable<{ exito: boolean; mensaje: string }> {
    return this.http.patch<{ exito: boolean; mensaje: string }>(`${this.API}/${id}/archivar`, {});
  }

  eliminar(id: string): Observable<{ exito: boolean; mensaje: string }> {
    return this.http.delete<{ exito: boolean; mensaje: string }>(`${this.API}/${id}`);
  }

  reporte(): Observable<{ exito: boolean; reporte: Reporte }> {
    return this.http.get<{ exito: boolean; reporte: Reporte }>(`${this.API}/reporte/estadisticas`);
  }

  comentarios(noticiaId: string): Observable<{ exito: boolean; comentarios: any[] }> {
    return this.http.get<{ exito: boolean; comentarios: any[] }>(`${environment.apiUrl}/noticias/${noticiaId}/comentarios`);
  }

  comentar(noticiaId: string, texto: string): Observable<{ exito: boolean; comentario: any }> {
    return this.http.post<{ exito: boolean; comentario: any }>(`${environment.apiUrl}/noticias/${noticiaId}/comentarios`, { contenido: texto });
  }

  eliminarComentario(id: string): Observable<{ exito: boolean; mensaje: string }> {
    return this.http.delete<{ exito: boolean; mensaje: string }>(`${environment.apiUrl}/comentarios/${id}`);
  }
}
