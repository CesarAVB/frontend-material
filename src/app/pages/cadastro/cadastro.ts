import { Component, OnInit } from '@angular/core'; // 👈 Adicionei OnInit aqui!
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, FormArray, FormGroup } from '@angular/forms'; // 👈 Adicionei FormGroup aqui!
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// ... seus imports de services, models, enums

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, // 👈 Essencial para formulários reativos
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './cadastro.html',
  styleUrl: './cadastro.scss'
})
export class CadastroComponent implements OnInit { // 👈 Implementamos OnInit para usar o ngOnInIt

  // 🌟 DECLARAÇÃO DAS PROPRIEDADES FORMGROUP
  // O '!' é o non-null assertion operator, dizendo ao TypeScript que essas propriedades
  // serão inicializadas no ngOnInit.
  formDadosPessoais!: FormGroup;
  formEnderecos!: FormGroup;
  formContatos!: FormGroup;

  // 🚀 Injetamos o FormBuilder no construtor
  constructor(private _formBuilder: FormBuilder) {}

  // ✨ MÉTODO DE INICIALIZAÇÃO DO COMPONENTE
  ngOnInit(): void {
    // 📝 Inicializamos o FormGroup para Dados Pessoais
    this.formDadosPessoais = this._formBuilder.group({
      nome: ['', Validators.required], // 'nome' é o formControlName que você usou no HTML
      // Adicione outros campos de dados pessoais aqui, se precisar
      // exemplo: sobrenome: ['', Validators.required],
      // exemplo: dataNascimento: ['', Validators.required],
    });

    // 🏠 Inicializamos o FormGroup para Endereços
    this.formEnderecos = this._formBuilder.group({
      // Adicione campos de endereço aqui
      // exemplo: logradouro: ['', Validators.required],
      // exemplo: numero: ['', Validators.required],
      // exemplo: cep: ['', [Validators.required, Validators.pattern(/^\d{5}-\d{3}$/)]],
    });

    // 📞 Inicializamos o FormGroup para Contatos
    this.formContatos = this._formBuilder.group({
      // Adicione campos de contato aqui
      // exemplo: email: ['', [Validators.required, Validators.email]],
      // exemplo: telefone: ['', [Validators.required, Validators.pattern(/^|$\d{2}$|\s\d{4,5}-\d{4}$/)]],
    });
  }

  // Método para lidar com a submissão final do formulário
  submitCadastro(): void {
    if (this.formDadosPessoais.valid && this.formEnderecos.valid && this.formContatos.valid) {
      const dadosCompletos = {
        dadosPessoais: this.formDadosPessoais.value,
        enderecos: this.formEnderecos.value,
        contatos: this.formContatos.value
      };
      console.log('Dados do cadastro:', dadosCompletos);
      alert('Cadastro realizado com sucesso! Verifique o console para os dados.');
      // Aqui você chamaria um serviço para enviar esses dados para o backend
    } else {
      alert('Por favor, preencha todos os campos obrigatórios.');
    }
  }
}
