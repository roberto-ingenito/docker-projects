import { computed, Injectable, signal } from '@angular/core';
import { User, UserLoginDto, UserLoginResponseDto } from '../../../lib/types/user';

export interface AuthState {
  user: Omit<User, 'password'>;
  token: string;
  refreshToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  state = signal<AuthState | null>(null);
  isLoggedIn = computed(() => this.state() !== null);

  constructor() {
    const stored = localStorage.getItem('user_data');
    if (stored) {
      try {
        this.state.set(JSON.parse(stored) as UserLoginResponseDto);
      } catch {
        localStorage.removeItem('user_data');
      }
    }
  }

  login(dto: UserLoginDto) {
    // TODO: chiamata API

    const newState: AuthState = {
      user: {
        createdAt: new Date().toISOString(),
        currency: 'EUR',
        email: dto.email,
        userId: 1,
      },
      token: 'token',
      refreshToken: 'refreshToken',
    };

    localStorage.setItem('user_data', JSON.stringify(newState));
    this.state.set(newState);
  }

  logout() {
    localStorage.removeItem('user_data');
    this.state.set(null);
  }
}
