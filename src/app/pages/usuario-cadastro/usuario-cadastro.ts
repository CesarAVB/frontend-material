// src/app/pages/usuario-cadastro/usuario-cadastro.ts
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

import { HeaderComponent } from '../../layout/header/header';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { Permission } from '../../models/permission.model';

@Component({
  selector: 'app-usuario-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    HeaderComponent
  ],
  templateUrl: './usuario-cadastro.html',
  styleUrl: './usuario-cadastro.scss'
})
export class UsuarioCadastroComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuarioService = inject(UsuarioService);

  formUsuario = this.fb.group({
    nome: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: [''],
    confirmPassword: [''],
    fotoPerfil: [''],
    tema: ['light', Validators.required],
    enabled: [true],
    accountNonExpired: [true],
    accountNonLocked: [true],
    credentialsNonExpired: [true],
    permissions: [[] as Permission[], Validators.required]
  }, { validators: this.passwordMatchValidator });

  usuarioId: number | null = null;
  modoEdicao = false;
  salvando = signal(false);
  previewFoto = signal<string | null>(null);
  permissoesDisponiveis = signal<Permission[]>([]);
  mostrarSenha = signal(false);
  mostrarConfirmaSenha = signal(false);

  ngOnInit(): void {
    this.carregarPermissoes();
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.usuarioId = Number(id);
      this.modoEdicao = true;
      this.carregarUsuario(this.usuarioId);
    } else {
      // Modo criação - senha é obrigatória
      this.formUsuario.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.formUsuario.get('confirmPassword')?.setValidators([Validators.required]);
      this.formUsuario.updateValueAndValidity();
    }
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  carregarPermissoes(): void {
    this.usuarioService.obterPermissoes().subscribe({
      next: (permissoes) => {
        this.permissoesDisponiveis.set(permissoes);
      },
      error: (err) => {
        console.error('Erro ao carregar permissões:', err);
        alert('Erro ao carregar permissões');
      }
    });
  }

  carregarUsuario(id: number): void {
    this.usuarioService.obterPorId(id).subscribe({
      next: (usuario) => {
        this.formUsuario.patchValue({
          nome: usuario.nome,
          username: usuario.username,
          email: usuario.email,
          fotoPerfil: usuario.fotoPerfil,
          tema: usuario.tema,
          enabled: usuario.enabled,
          accountNonExpired: usuario.accountNonExpired,
          accountNonLocked: usuario.accountNonLocked,
          credentialsNonExpired: usuario.credentialsNonExpired,
          permissions: usuario.permissions ?? []
        });
      },
      error: (err) => {
        console.error('Erro ao carregar usuário:', err);
        alert('Erro ao carregar usuário. Redirecionando...');
        this.router.navigate(['/usuarios']);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validar tamanho (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Apenas imagens são permitidas');
        return;
      }

      this.usuarioService.uploadFotoPerfil(file).subscribe({
        next: (base64) => {
          this.previewFoto.set(base64);
          this.formUsuario.patchValue({ fotoPerfil: base64 });
        },
        error: (err) => {
          console.error('Erro ao fazer upload da foto:', err);
          alert('Erro ao fazer upload da foto');
        }
      });
    }
  }

  removerFoto(): void {
    this.previewFoto.set(null);
    this.formUsuario.patchValue({ fotoPerfil: '' });
  }

  toggleMostrarSenha(): void {
    this.mostrarSenha.update(v => !v);
  }

  toggleMostrarConfirmaSenha(): void {
    this.mostrarConfirmaSenha.update(v => !v);
  }

  salvar(): void {
    if (this.formUsuario.invalid) {
      this.formUsuario.markAllAsTouched();
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    this.salvando.set(true);

    const dados = this.formUsuario.value;
    
    // Remove confirmPassword antes de enviar
    const { confirmPassword, ...dadosUsuario } = dados;

    // Se estiver editando e não forneceu senha, remove o campo password
    if (this.modoEdicao && !dadosUsuario.password) {
      delete dadosUsuario.password;
    }

    if (this.modoEdicao && this.usuarioId) {
      // Atualizar
      this.usuarioService.atualizar(this.usuarioId, dadosUsuario).subscribe({
        next: () => {
          alert('Usuário atualizado com sucesso!');
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.error('Erro ao atualizar usuário:', err);
          alert('Erro ao atualizar usuário. Tente novamente.');
          this.salvando.set(false);
        }
      });
    } else {
      // Criar
      this.usuarioService.criar(dadosUsuario).subscribe({
        next: () => {
          alert('Usuário cadastrado com sucesso!');
          this.router.navigate(['/usuarios']);
        },
        error: (err) => {
          console.error('Erro ao cadastrar usuário:', err);
          alert('Erro ao cadastrar usuário. Tente novamente.');
          this.salvando.set(false);
        }
      });
    }
  }
}