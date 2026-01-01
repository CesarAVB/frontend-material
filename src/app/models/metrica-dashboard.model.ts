// src/app/models/metrica-dashboard.model.ts
export interface MetricaDashboard {
  totalClientes: number;
  variacao: number;
  novosHoje: number;
  mediaDiaria: number;
  clientesAtivos: number;
  percentualAtivos: number;
}