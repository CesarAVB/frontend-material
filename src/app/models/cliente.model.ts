// src/app/models/cliente.model.ts
import { TipoPessoa } from '../enums/tipo-pessoa.enum';
import { Genero } from '../enums/genero.enum';
import { Endereco } from './endereco.model';
import { Contato } from './contato.model';

export interface Cliente {
  id: number;
  nome: string;
  dataNascimento: string;
  tipoPessoa: TipoPessoa;
  cpfCnpj: string;
  rg: string;
  genero: Genero;
  enderecos: Endereco[];
  contatos: Contato[];
  login: string;
  senha: string;
}