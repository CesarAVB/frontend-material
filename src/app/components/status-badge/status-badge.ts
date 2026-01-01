// src/app/components/status-badge/status-badge.component.ts
import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';

export type ClientStatus = 'ativo' | 'pendente' | 'inativo' | 'bloqueado';

interface StatusConfig {
  label: string;
  color: 'primary' | 'accent' | 'warn' | undefined;
}

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule, MatChipsModule],
  template: `
    <mat-chip-set>
      <mat-chip [color]="config().color" highlighted>
        {{ config().label }}
      </mat-chip>
    </mat-chip-set>
  `,
  styles: [`
    mat-chip-set {
      display: inline-flex;
    }
  `]
})
export class StatusBadgeComponent {
  @Input() set status(value: ClientStatus) {
    this.statusSignal.set(value);
  }

  private statusSignal = signal<ClientStatus>('ativo');

  private statusConfig: Record<ClientStatus, StatusConfig> = {
    ativo: { label: 'Ativo', color: 'primary' },
    pendente: { label: 'Pendente', color: 'accent' },
    inativo: { label: 'Inativo', color: undefined },
    bloqueado: { label: 'Bloqueado', color: 'warn' }
  };

  config = computed(() => this.statusConfig[this.statusSignal()]);
}