// src/app/pages/cadastro/cadastro.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup, FormArray } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { TipoPessoa } from '../../enums/tipo-pessoa.enum';
import { HeaderComponent } from '../../layout/header/header';
import { ClienteService } from '../../services/cliente';
import { Cliente } from '../../models/cliente.model';

// Importações para máscaras (ngx-mask)
// Certifique-se de ter instalado: npm install ngx-mask
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatCardModule,
    NgxMaskDirective,
    HeaderComponent
  ],
  providers: [provideNgxMask()],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss'
})
export class CadastroComponent implements OnInit {
  formDadosPessoais!: FormGroup;
  formEnderecos!: FormGroup;
  formContatos!: FormGroup;
  tipoPessoa = signal<TipoPessoa>(TipoPessoa.FISICA);
  clienteId: number | null = null;
  modoEdicao = false;

  // EXPOR O ENUM PARA O TEMPLATE HTML
  public TipoPessoa = TipoPessoa;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService
  ) {}

  ngOnInit(): void {
    this.initForms();
    
    // Verificar se há ID na rota (modo edição)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.clienteId = Number(id);
      this.modoEdicao = true;
      this.carregarCliente(this.clienteId);
    }
  }

  initForms(): void {
    this.formDadosPessoais = this.fb.group({
      nome: ['', Validators.required],
      cpfCnpj: ['', Validators.required],
      rg: [''],
      dataNascimento: ['', Validators.required],
      genero: ['', Validators.required],
    });

    this.formEnderecos = this.fb.group({
      enderecos: this.fb.array([this.criarEndereco()])
    });

    this.formContatos = this.fb.group({
      contatos: this.fb.array([this.criarEmailContato(), this.criarTelefoneContato()])
    });
  }

  criarEndereco(): FormGroup {
    return this.fb.group({
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required],
    });
  }

  criarEmailContato(): FormGroup {
    return this.fb.group({
      tipo: ['EMAIL'],
      valor: ['', [Validators.required, Validators.email]]
    });
  }

  criarTelefoneContato(): FormGroup {
    return this.fb.group({
      tipo: ['TELEFONE'],
      valor: ['', Validators.required]
    });
  }

  get enderecos(): FormArray {
    return this.formEnderecos.get('enderecos') as FormArray;
  }

  get contatos(): FormArray {
    return this.formContatos.get('contatos') as FormArray;
  }

  adicionarEndereco(): void {
    this.enderecos.push(this.criarEndereco());
  }

  removerEndereco(index: number): void {
    if (this.enderecos.length > 1) {
      this.enderecos.removeAt(index);
    } else {
      alert('É necessário ter pelo menos um endereço.');
    }
  }

  adicionarContato(tipo: 'EMAIL' | 'TELEFONE'): void {
    if (tipo === 'EMAIL') {
      this.contatos.push(this.criarEmailContato());
    } else {
      this.contatos.push(this.criarTelefoneContato());
    }
  }

  removerContato(index: number): void {
    if (this.contatos.length > 1) {
      this.contatos.removeAt(index);
    } else {
      alert('É necessário ter pelo menos um contato.');
    }
  }

  selecionarTipoPessoa(tipo: TipoPessoa): void {
    this.tipoPessoa.set(tipo);
  }

  carregarCliente(id: number): void {
    this.clienteService.obterPorId(id).subscribe({
      next: (cliente: Cliente) => {
        // Definir tipo de pessoa
        this.tipoPessoa.set(cliente.tipoPessoa);
        
        // Preencher formulário de dados pessoais
        this.formDadosPessoais.patchValue({
          nome: cliente.nome,
          cpfCnpj: cliente.cpfCnpj,
          rg: cliente.rg || '',
          dataNascimento: cliente.dataNascimento,
          genero: cliente.genero
        });

        // Limpar e preencher endereços
        this.enderecos.clear();
        if (cliente.enderecos && cliente.enderecos.length > 0) {
          cliente.enderecos.forEach(endereco => {
            this.enderecos.push(this.fb.group({
              cep: [endereco.cep, Validators.required],
              logradouro: [endereco.logradouro, Validators.required],
              numero: [endereco.numero, Validators.required],
              complemento: [endereco.complemento || ''],
              bairro: [endereco.bairro, Validators.required],
              cidade: [endereco.cidade, Validators.required],
              uf: [endereco.uf, Validators.required]
            }));
          });
        } else {
          this.enderecos.push(this.criarEndereco());
        }

        // Limpar e preencher contatos
        this.contatos.clear();
        if (cliente.contatos && cliente.contatos.length > 0) {
          cliente.contatos.forEach(contato => {
            this.contatos.push(this.fb.group({
              tipo: [contato.tipo],
              valor: [contato.valor, contato.tipo === 'EMAIL' ? [Validators.required, Validators.email] : Validators.required]
            }));
          });
        } else {
          this.contatos.push(this.criarEmailContato());
          this.contatos.push(this.criarTelefoneContato());
        }
      },
      error: (err) => {
        console.error('Erro ao carregar cliente:', err);
        alert('Erro ao carregar dados do cliente. Redirecionando...');
        this.router.navigate(['/clientes']);
      }
    });
  }

  buscarCep(index: number = 0): void {
    const endereco = this.enderecos.at(index) as FormGroup;
    const cep = endereco.get('cep')?.value?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      fetch(`https://viacep.com.br/ws/${cep}/json/`)
        .then(response => response.json())
        .then(data => {
          if (!data.erro) {
            endereco.patchValue({
              logradouro: data.logradouro,
              bairro: data.bairro,
              cidade: data.localidade,
              uf: data.uf,
            });
          } else {
            alert('CEP não encontrado!');
          }
        })
        .catch(error => {
          console.error('Erro ao buscar CEP:', error);
          alert('Erro ao buscar CEP. Tente novamente.');
        });
    }
  }

  submitCadastro(): void {
    if (this.formDadosPessoais.valid && this.formEnderecos.valid && this.formContatos.valid) {
      const dadosCompletos = {
        ...this.formDadosPessoais.value,
        tipoPessoa: this.tipoPessoa(),
        enderecos: this.enderecos.value,
        contatos: this.contatos.value
      };

      if (this.modoEdicao && this.clienteId) {
        // Modo edição - atualizar cliente existente
        this.clienteService.atualizar(this.clienteId, dadosCompletos).subscribe({
          next: () => {
            alert('Cliente atualizado com sucesso!');
            this.router.navigate(['/clientes']);
          },
          error: (err) => {
            console.error('Erro ao atualizar cliente:', err);
            alert('Erro ao atualizar cliente. Tente novamente.');
          }
        });
      } else {
        // Modo criação - criar novo cliente
        this.clienteService.criar(dadosCompletos).subscribe({
          next: () => {
            alert('Cliente cadastrado com sucesso!');
            this.router.navigate(['/clientes']);
          },
          error: (err) => {
            console.error('Erro ao cadastrar cliente:', err);
            alert('Erro ao cadastrar cliente. Tente novamente.');
          }
        });
      }
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
      this.marcarCamposComoTocados();
    }
  }

  private marcarCamposComoTocados(): void {
    Object.keys(this.formDadosPessoais.controls).forEach(key => {
      this.formDadosPessoais.get(key)?.markAsTouched();
    });
    Object.keys(this.formEnderecos.controls).forEach(key => {
      this.formEnderecos.get(key)?.markAsTouched();
    });
    Object.keys(this.formContatos.controls).forEach(key => {
      this.formContatos.get(key)?.markAsTouched();
    });
  }
}
