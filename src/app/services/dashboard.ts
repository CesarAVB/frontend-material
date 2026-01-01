// src/app/services/dashboard.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Cliente } from '../models/cliente.model';
import { MetricaDashboard } from '../models/metrica-dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  obterMetricas(): Observable<MetricaDashboard> {
    return this.http.get<MetricaDashboard>(`${this.apiUrl}/cliente/metricas`).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Erro ao buscar métricas:', err);
        let errorMessage = 'Ocorreu um erro ao carregar as métricas do dashboard.';
        if (err.status === 404) {
          errorMessage = 'Endpoint de métricas não encontrado.';
        } else if (err.status === 403) {
          errorMessage = 'Você não tem permissão para ver as métricas.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  obterClientesRecentes(limite: number = 4): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${this.apiUrl}/cliente/recentes?limite=${limite}`).pipe(
      catchError((err: HttpErrorResponse) => {
        console.error('Erro ao buscar clientes recentes:', err);
        let errorMessage = 'Ocorreu um erro ao carregar os clientes recentes.';
        if (err.status === 404) {
          errorMessage = 'Endpoint de clientes recentes não encontrado.';
        } else if (err.status === 403) {
          errorMessage = 'Você não tem permissão para ver os clientes recentes.';
        }
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}