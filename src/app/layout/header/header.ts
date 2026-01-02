// src/app/layout/header/header.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
  @Input() titulo: string = '';
  @Input() subtitulo: string = '';
  @Input() mostrarBotaoNovo: boolean = false;
  @Input() rotaNovo: string = '/cadastro';
  @Input() textoBotaoNovo: string = 'Novo';
  @Output() clickNovo = new EventEmitter<void>();

  constructor(private router: Router) {}

  novoCliente(): void {
    if (this.clickNovo.observers.length > 0) {
      this.clickNovo.emit();
    } else {
      this.router.navigate([this.rotaNovo]);
    }
  }
}