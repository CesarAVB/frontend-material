// src/app/app.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Apenas RouterOutlet é necessário aqui

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.html', // Seu HTML será o simplificado acima
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'sistema-cadastro-material'; // Pode manter o título do app aqui
}
