// src/app/services/cliente.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';
import { MetricaDashboard } from '../models/metrica-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/cliente';

  obterTodos(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  obterPorId(id: number): Observable<Cliente> {
    console.log('Obtendo cliente com ID:', `${this.apiUrl}/${id}`);
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  criar(cliente: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, cliente);
  }

  atualizar(id: number, cliente: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, cliente);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  obterMetricas(): Observable<MetricaDashboard> {
    return this.http.get<MetricaDashboard>(`${this.apiUrl}/metricas`);
  }

  obterClientesRecentes(limite: number = 4): Observable<Cliente[]> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<Cliente[]>(`${this.apiUrl}/recentes`, { params });
  }
}