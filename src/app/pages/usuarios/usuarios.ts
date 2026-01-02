// src/app/pages/usuarios/usuarios.ts
import { Component, OnInit, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Material Imports
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';

// Components
import { HeaderComponent } from '../../layout/header/header';
import { AvatarComponent } from '../../components/avatar/avatar';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge';

// Services e Models
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { ClientStatus } from '../../models/cliente-status.type';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule,
    HeaderComponent,
    AvatarComponent,
    StatusBadgeComponent
  ],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.scss'
})
export class UsuariosComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Usuario>([]);
  displayedColumns = ['nome', 'email', 'permissoes', 'tema', 'status', 'acoes'];

  carregando = signal(true);
  erro = signal<string | null>(null);
  mostrarFiltros = signal(false);

  filtroStatus = 'todos';
  filtroTema = 'todos';

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.usuarioService.obterTodos().subscribe({
      next: (usuarios) => {
        this.dataSource.data = usuarios;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.erro.set('Erro ao carregar usuários');
        this.carregando.set(false);
      }
    });
  }

  aplicarFiltro(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleFiltros(): void {
    this.mostrarFiltros.update(v => !v);
  }

  limparFiltros(): void {
    this.filtroStatus = 'todos';
    this.filtroTema = 'todos';
    this.dataSource.filter = '';
  }

  getDisplayPermissions(permissions: any[]): string[] {
    if (!permissions || permissions.length === 0) return [];
    return permissions
      .slice(0, 2)
      .map(p => p.description || p.name || p.authority || 'Sem nome');
  }

  getStatusBadge(usuario: Usuario): ClientStatus {
    if (!usuario.enabled) return 'inativo';
    if (!usuario.accountNonLocked) return 'bloqueado';
    return 'ativo';
  }

  novoUsuario(): void {
    this.router.navigate(['/usuarios/cadastro']);
  }

  visualizar(usuario: Usuario): void {
    console.log('Visualizar usuário:', usuario);
    // Implementar modal de visualização
  }

  editar(usuario: Usuario): void {
    this.router.navigate(['/usuarios/cadastro', usuario.id]);
  }

  resetarSenha(usuario: Usuario): void {
    if (confirm(`Deseja realmente resetar a senha do usuário ${usuario.nome}?`)) {
      // Implementar lógica de reset de senha
      alert('Funcionalidade de reset de senha será implementada');
    }
  }

  toggleStatus(usuario: Usuario): void {
    const acao = usuario.enabled ? 'desativar' : 'ativar';
    if (confirm(`Deseja realmente ${acao} o usuário ${usuario.nome}?`)) {
      const usuarioAtualizado = { ...usuario, enabled: !usuario.enabled };
      this.usuarioService.atualizar(usuario.id, usuarioAtualizado).subscribe({
        next: () => {
          this.carregarUsuarios();
          alert(`Usuário ${acao === 'ativar' ? 'ativado' : 'desativado'} com sucesso!`);
        },
        error: (err) => {
          console.error(`Erro ao ${acao} usuário:`, err);
          alert(`Erro ao ${acao} usuário`);
        }
      });
    }
  }

  toggleLock(usuario: Usuario): void {
    const acao = usuario.accountNonLocked ? 'bloquear' : 'desbloquear';
    if (confirm(`Deseja realmente ${acao} o usuário ${usuario.nome}?`)) {
      const usuarioAtualizado = { ...usuario, accountNonLocked: !usuario.accountNonLocked };
      this.usuarioService.atualizar(usuario.id, usuarioAtualizado).subscribe({
        next: () => {
          this.carregarUsuarios();
          alert(`Usuário ${acao === 'bloquear' ? 'bloqueado' : 'desbloqueado'} com sucesso!`);
        },
        error: (err) => {
          console.error(`Erro ao ${acao} usuário:`, err);
          alert(`Erro ao ${acao} usuário`);
        }
      });
    }
  }

  excluir(usuario: Usuario): void {
    if (confirm(`Deseja realmente excluir o usuário ${usuario.nome}? Esta ação não pode ser desfeita.`)) {
      this.usuarioService.deletar(usuario.id).subscribe({
        next: () => {
          this.carregarUsuarios();
          alert('Usuário excluído com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao excluir usuário:', err);
          alert('Erro ao excluir usuário');
        }
      });
    }
  }

  getStatusLabel(usuario: Usuario): string {
    if (!usuario.enabled) return 'Inativo';
    if (!usuario.accountNonLocked) return 'Bloqueado';
    return 'Ativo';
  }
}