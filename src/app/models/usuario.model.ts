// src/app/models/usuario.model.ts
import { Permission } from './permission.model';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  username: string;
  password: string;
  fotoPerfil?: string;
  tema: 'light' | 'dark';
  accountNonExpired: boolean;
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;
  enabled: boolean;
  permissions: Permission[];
}