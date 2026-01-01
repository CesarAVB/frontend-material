// src/app/pages/clientes/clientes.component.ts
import { Component, OnInit, inject, signal, computed, ViewChild } from '@angular/core';
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

// Components
import { HeaderComponent } from '../../layout/header/header';
import { AvatarComponent } from '../../components/avatar/avatar';
import { StatusBadgeComponent, ClientStatus } from '../../components/status-badge/status-badge';

// Services e Models
import { ClienteService } from '../../services/cliente';
import { Cliente } from '../../models/cliente.model';
import { TipoPessoa } from '../../enums/tipo-pessoa.enum';

@Component({
  selector: 'app-clientes',
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
    HeaderComponent,
    AvatarComponent,
    StatusBadgeComponent,
    MatDividerModule
  ],
  templateUrl: './clientes.html',
  styleUrl: './clientes.scss'
})
export class ClientesComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private router = inject(Router);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<Cliente>([]);
  displayedColumns = ['nome', 'cpfCnpj', 'email', 'telefone', 'status', 'acoes'];

  carregando = signal(true);
  erro = signal<string | null>(null);
  mostrarFiltros = signal(false);

  filtroStatus = signal<ClientStatus | 'todos'>('todos');
  filtroTipoPessoa = signal<TipoPessoa | 'todos'>('todos');

  ngOnInit(): void {
    this.carregarClientes();
  }

  carregarClientes(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.clienteService.obterTodos().subscribe({
      next: (clientes) => {
        this.dataSource.data = clientes;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        this.erro.set('Erro ao carregar clientes');
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

  novoCliente(): void {
    this.router.navigate(['/cadastro']);
  }

  visualizar(cliente: Cliente): void {
    console.log('Visualizar cliente:', cliente);
  }

  editar(cliente: Cliente): void {
    this.router.navigate(['/cadastro', cliente.id]);
  }

  excluir(cliente: Cliente): void {
    if (confirm(`Deseja realmente excluir o cliente ${cliente.nome}?`)) {
      this.clienteService.deletar(cliente.id).subscribe({
        next: () => {
          this.carregarClientes();
          alert('Cliente excluído com sucesso!');
        },
        error: (err) => {
          console.error('Erro ao excluir cliente:', err);
          alert('Erro ao excluir cliente');
        }
      });
    }
  }

  getStatus(cliente: Cliente): ClientStatus {
    return 'ativo';
  }

  getEmail(cliente: Cliente): string {
    const emailContato = cliente.contatos.find(c => c.tipo === 'EMAIL');
    return emailContato?.valor || '-';
  }

  getTelefone(cliente: Cliente): string {
    const telefoneContato = cliente.contatos.find(c => c.tipo === 'TELEFONE');
    return telefoneContato?.valor || '-';
  }

  formatarCpfCnpj(cpfCnpj: string): string {
    if (!cpfCnpj) return '-';
    const numeros = cpfCnpj.replace(/\D/g, '');
    
    if (numeros.length === 11) {
      return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    
    if (numeros.length === 14) {
      return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }
    
    return cpfCnpj;
  }
}