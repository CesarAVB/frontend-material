import { TipoContato } from '../enums/tipo-contato.enum';

export interface Contato {
  id: number;
  tipo: TipoContato;
  valor: string;
}