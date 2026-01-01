// src/app/pages/login/login.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  formLogin = this.fb.nonNullable.group({
    username: ['', Validators.required],
    senha: ['', Validators.required]
  });

  carregando = signal(false);
  erro = signal<string | null>(null);
  lembrarMe = signal(false);
  mostrarSenha = signal(false);

  constructor() {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      this.formLogin.controls.username.setValue(savedUsername);
      this.lembrarMe.set(true);
    }
  }

  toggleLembrarMe() {
    this.lembrarMe.update(v => !v);
    if (!this.lembrarMe()) {
      localStorage.removeItem('rememberedUsername');
    }
  }

  toggleMostrarSenha() {
    this.mostrarSenha.update(v => !v);
  }

  entrar() {
    this.erro.set(null);
    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      this.erro.set('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    this.carregando.set(true);
    const { username, senha } = this.formLogin.getRawValue();

    this.authService.login(username, senha).subscribe({
      next: () => {
        if (this.lembrarMe()) {
          localStorage.setItem('rememberedUsername', username);
        }
        this.carregando.set(false);
      },
      error: (err: Error) => {
        this.erro.set(err.message || 'Ocorreu um erro inesperado. Tente novamente.');
        this.carregando.set(false);
      }
    });
  }

  esqueceuSenha() {
    alert('Funcionalidade "Esqueceu a senha?" ainda não implementada.');
  }

  entrarEmContato() {
    alert('Funcionalidade "Entrar em contato" ainda não implementada.');
  }
}