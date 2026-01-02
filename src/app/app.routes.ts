// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { MainLayoutComponent } from './layout/main-layout/main-layout';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent)
  },
  {
    path: '', // Rota que usará o MainLayoutComponent
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent),
      },
      {
        path: 'clientes',
        loadComponent: () => import('./pages/clientes/clientes').then(m => m.ClientesComponent),
      },
      {
        path: 'cadastro',
        loadComponent: () => import('./pages/cadastro/cadastro').then(m => m.CadastroComponent),
      },
      {
        path: 'cadastro/:id',
        loadComponent: () => import('./pages/cadastro/cadastro').then(m => m.CadastroComponent),
      },
      // Rota de Listagem de Usuários
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/usuarios/usuarios').then(m => m.UsuariosComponent),
        canActivate: [authGuard]
      },

      // Rota de Cadastro de Novo Usuário
      {
        path: 'usuarios/cadastro',
        loadComponent: () => import('./pages/usuario-cadastro/usuario-cadastro').then(m => m.UsuarioCadastroComponent),
        canActivate: [authGuard]
      },

      // Rota de Edição de Usuário
      {
        path: 'usuarios/cadastro/:id',
        loadComponent: () => import('./pages/usuario-cadastro/usuario-cadastro').then(m => m.UsuarioCadastroComponent),
        canActivate: [authGuard]
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
