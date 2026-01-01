// src/app/components/avatar/avatar.component.ts
import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

type AvatarSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="avatar {{ sizeClass() }}"
      [style.background-color]="bgColor()">
      {{ initials() }}
    </div>
  `,
  styles: [`
    .avatar {
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 600;
      flex-shrink: 0;
    }

    .avatar-sm {
      width: 2rem;
      height: 2rem;
      font-size: 0.75rem;
    }

    .avatar-md {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 0.875rem;
    }

    .avatar-lg {
      width: 3rem;
      height: 3rem;
      font-size: 1rem;
    }
  `]
})
export class AvatarComponent {
  @Input() set name(value: string) {
    this.nameSignal.set(value);
  }
  @Input() size: AvatarSize = 'md';

  private nameSignal = signal('');
  private colors = ['#4F46E5', '#7C3AED', '#06B6D4', '#0EA5E9', '#3B82F6'];

  bgColor = computed(() => {
    const name = this.nameSignal();
    const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    return this.colors[charCode % this.colors.length];
  });

  initials = computed(() => {
    return this.nameSignal()
      .split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  });

  sizeClass = computed(() => {
    const sizeMap: Record<AvatarSize, string> = {
      sm: 'avatar-sm',
      md: 'avatar-md',
      lg: 'avatar-lg'
    };
    return sizeMap[this.size];
  });
}