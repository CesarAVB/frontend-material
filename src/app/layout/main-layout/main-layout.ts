// src/app/main-layout/main-layout.component.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SidebarComponent } from '../sidebar/sidebar';
import { AuthService } from './../../services/auth';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent
  ],
  template: `
    <mat-sidenav-container class="main-layout-container">
      <mat-sidenav mode="side" [opened]="sidebarOpened()" class="app-sidebar">
        <app-sidebar (toggleSidebar)="onSidebarToggle()"></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content class="main-content-area">
        <!-- Botão para colapsar/expandir o sidebar -->
        <button mat-icon-button (click)="onSidebarToggle()" class="sidebar-toggle-button">
          <mat-icon>menu</mat-icon>
        </button>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .main-layout-container {
      height: 100vh;
    }
    .app-sidebar {
      width: 250px;
      background-color: #0D47A1; /* $blue-900 */
      color: white;
      box-shadow: 2px 0 5px rgba(0,0,0,0.2); /* Sombra para destacar */
    }
    .main-content-area {
      padding: 20px;
      /* Adicione flexbox ou grid se precisar de um layout mais complexo aqui */
    }
    .sidebar-toggle-button {
      margin-bottom: 15px; /* Espaçamento do botão */
    }
  `]
})
export class MainLayoutComponent {
  authService = inject(AuthService);
  private router = inject(Router);

  sidebarOpened = signal(true);
  isAuthenticated = computed(() => this.authService.isAuthenticated());

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.authService.checkAuthenticationStatus();
      });
  }

  onSidebarToggle(): void {
    this.sidebarOpened.update(v => !v);
  }
}
