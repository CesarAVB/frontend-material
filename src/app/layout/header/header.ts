// src/app/layout/header/header.component.ts
import { Component, Input } from '@angular/core';
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

  constructor(private router: Router) {}

  novoCliente(): void {
    this.router.navigate(['/cadastro']);
  }
}