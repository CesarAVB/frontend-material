// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HeaderComponent } from '../../layout/header/header';
import { StatsCardComponent } from '../../components/stats-card/stats-card';
import { AvatarComponent } from '../../components/avatar/avatar';
import { StatusBadgeComponent } from '../../components/status-badge/status-badge';
import { DashboardService } from '../../services/dashboard';
import { Cliente } from '../../models/cliente.model';
import { MetricaDashboard } from '../../models/metrica-dashboard.model';
import { StatsChange } from '../../models/stats-change.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    StatsCardComponent,
    AvatarComponent,
    StatusBadgeComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private router = inject(Router);

  metricas = signal<MetricaDashboard | null>(null);
  clientesRecentes = signal<Cliente[]>([]);
  carregando = signal(true);
  erro = signal<string | null>(null);

  displayedColumns = ['nome', 'email', 'status', 'data', 'acoes'];

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.dashboardService.obterMetricas().subscribe({
      next: (metricas) => this.metricas.set(metricas),
      error: (err) => {
        console.error('Erro ao carregar métricas:', err);
        this.metricas.set({
          totalClientes: 6,
          variacao: 2.5,
          novosHoje: 2,
          mediaDiaria: 3,
          clientesAtivos: 3,
          percentualAtivos: 1.2
        });
      }
    });

    this.dashboardService.obterClientesRecentes(4).subscribe({
      next: (clientes) => {
        this.clientesRecentes.set(clientes);
        this.carregando.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar clientes recentes:', err);
        this.clientesRecentes.set([]);
        this.carregando.set(false);
      }
    });
  }

  getStatsChange(value: number): StatsChange {
    return {
      value: `${Math.abs(value)}%`,
      positive: value >= 0
    };
  }

  navegarPara(route: string): void {
    this.router.navigate([route]);
  }

  novoCliente(): void {
    this.router.navigate(['/cadastro']);
  }

  getEmail(cliente: Cliente): string {
    const emailContato = cliente.contatos.find(c => c.tipo === 'EMAIL');
    return emailContato?.valor || '-';
  }
}