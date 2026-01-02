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
      <mat-sidenav mode="side" [opened]="true" class="app-sidebar" [class.collapsed]="!sidebarOpened()">
        <app-sidebar (toggleSidebar)="onSidebarToggle()" [class.collapsed]="!sidebarOpened()"></app-sidebar>
      </mat-sidenav>

      <mat-sidenav-content class="main-content-area">
        <button
          mat-icon-button
          class="sidebar-collapse-btn"
          [ngClass]="sidebarOpened() ? 'open' : 'closed'"
          (click)="onSidebarToggle()">
          <mat-icon>{{ sidebarOpened() ? 'chevron_left' : 'chevron_right' }}</mat-icon>
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
    .app-sidebar.collapsed {
      width: 72px !important;
      overflow: hidden;
    }
    .main-content-area {
      padding: 0;
      position: relative;
      /* Adicione flexbox ou grid se precisar de um layout mais complexo aqui */
    }
    .sidebar-collapse-btn {
      position: fixed;
      left: calc(250px - 10px);
      top: 76px;
      transform: translateY(0);
      z-index: 2000;
      background: linear-gradient(180deg, #42a5f5 0%, #1e88e5 100%);
      border: 1.5px solid rgba(255, 255, 255, 0.95);
      transition: all 0.25s ease;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 64px;
      padding: 0;
      box-shadow: 0 6px 14px rgba(33, 150, 243, 0.45);
      pointer-events: auto;
    }
    .sidebar-collapse-btn mat-icon {
      color: white;
      font-size: 20px;
      width: 20px;
      height: 20px;
      line-height: 20px;
    }
    .sidebar-collapse-btn.closed {
      left: calc(72px - 12px);
    }
    .sidebar-collapse-btn:hover {
      background: linear-gradient(180deg, #64b5f6 0%, #2196f3 100%);
      border-color: white;
      box-shadow: 0 8px 18px rgba(33, 150, 243, 0.55);
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
