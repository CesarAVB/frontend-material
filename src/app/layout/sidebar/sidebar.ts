// src/app/layout/sidebar/sidebar.component.ts
import { Component, inject, signal, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth';

interface MenuItem {
  route: string;
  icon: string;
  label: string;
}

interface UsuarioInfo {
  id: number;
  username: string;
  nome: string;
  email: string;
  iniciais: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  @Output() toggleSidebar = new EventEmitter<void>();

  usuario = signal<UsuarioInfo>({
    id: 0,
    username: '',
    nome: 'Carregando...',
    email: '',
    iniciais: '??'
  });

  menuItems: MenuItem[] = [
    { route: '/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { route: '/clientes', icon: 'people', label: 'Clientes' },
    { route: '/usuarios', icon: 'admin_panel_settings', label: 'Usuários' }
  ];

  ngOnInit(): void {
    this.loadUserInfo();
  }

  loadUserInfo(): void {
    const decodedToken = this.authService.getDecodedToken();
    if (decodedToken) {
      const username = decodedToken.sub ?? 'user';
      const nomeCompleto = username;
      const iniciais = username.substring(0, 2).toUpperCase();
      const emailDerivado = `${username}@syscadastro.com`;

      this.usuario.set({
        id: 1,
        username,
        nome: nomeCompleto,
        email: emailDerivado,
        iniciais
      });
    }
  }

  onToggle(): void {
    this.toggleSidebar.emit();
  }

  sair(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}