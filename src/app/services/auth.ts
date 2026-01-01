// src/app/services/auth.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

interface JwtPayload {
  sub: string;
  roles: string[];
  exp: number;
  iat: number;
  iss: string;
}

interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.apiUrl;

  isAuthenticated = signal(false);

  constructor() {
    this.checkAuthenticationStatus();
  }

  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap((response: LoginResponse) => {
        if (response && response.accessToken) {
          localStorage.setItem('accessToken', response.accessToken);
          this.isAuthenticated.set(true);
          this.router.navigate(['/dashboard']);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Erro no login:', error);
        this.isAuthenticated.set(false);
        const errorMessage = error.status === 403 
          ? 'Usuário ou senha inválidos.' 
          : 'Ocorreu um erro inesperado. Tente novamente.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

  checkAuthenticationStatus() {
    const token = localStorage.getItem('accessToken');
    if (token && !this.isTokenExpired(token)) {
      this.isAuthenticated.set(true);
    } else {
      this.isAuthenticated.set(false);
      localStorage.removeItem('accessToken');
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: JwtPayload = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  getDecodedToken(): JwtPayload | null {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded: JwtPayload = jwtDecode(token);
        return decoded;
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
        return null;
      }
    }
    return null;
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}