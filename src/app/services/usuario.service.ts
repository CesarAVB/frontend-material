// src/app/services/usuario.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { Permission } from '../models/permission.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/usuario';

  obterTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obterPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  criar(usuario: any): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  atualizar(id: number, usuario: any): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obterPermissoes(): Observable<Permission[]> {
    return this.http.get<Permission[]>(`${this.apiUrl}/permissoes`);
  }

  resetarSenha(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/resetar-senha`, {});
  }

  alterarStatus(id: number, enabled: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/status`, { enabled });
  }

  alterarBloqueio(id: number, accountNonLocked: boolean): Observable<Usuario> {
    return this.http.patch<Usuario>(`${this.apiUrl}/${id}/bloqueio`, { accountNonLocked });
  }

  uploadFoto(id: number, foto: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('foto', foto);
    return this.http.post<{ url: string }>(`${this.apiUrl}/${id}/foto`, formData);
  }

  removerFoto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/foto`);
  }

  uploadFotoPerfil(file: File): Observable<string> {
  const formData = new FormData();
  formData.append('file', file);
  return this.http
    .post<{ base64: string }>(`${this.apiUrl}/usuarios/upload-foto`, formData)
    .pipe(map(res => res.base64));
}
}
