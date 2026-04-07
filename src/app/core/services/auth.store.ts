import { computed, Injectable, signal } from '@angular/core';
import { User, UserCreateDto, UserLoginDto, UserLoginResponseDto } from '../../../lib/types/user';
import * as auth from '../../../lib/api/auth';

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
    const stored = localStorage.getItem('auth_state');
    if (stored) {
      try {
        this.state.set(JSON.parse(stored) as UserLoginResponseDto);
      } catch {
        this.deleteSavedState();
      }
    }
  }

  async signup(dto: UserCreateDto) {
    const responseDto = await auth.signup(dto);
    const newState: AuthState = responseDto;
    localStorage.setItem('auth_state', JSON.stringify(newState));
    this.state.set(newState);
  }

  async login(dto: UserLoginDto) {
    const responseDto = await auth.login(dto);
    const newState: AuthState = responseDto;
    localStorage.setItem('auth_state', JSON.stringify(newState));
    this.state.set(newState);
  }

  logout() {
    localStorage.removeItem('auth_state');
    this.state.set(null);
  }

  private getSavedState() {
    const userData = localStorage.getItem('auth_state');

    if (userData) {
      return JSON.parse(userData) as AuthState;
    }

    return null;
  }

  getJwtToken = () => this.getSavedState()?.token;
  getRefreshToken = () => this.getSavedState()?.refreshToken;

  saveJwtToken(newToken: string) {
    const currentState = this.state();
    if (!currentState) return;

    const newState: AuthState = {
      ...currentState,
      token: newToken,
    };

    this.state.set(newState);
  }

  saveRefreshToken(newToken: string) {
    const currentState = this.state();
    if (!currentState) return;

    const newState: AuthState = {
      ...currentState,
      refreshToken: newToken,
    };

    this.state.set(newState);
  }

  deleteSavedState = () => localStorage.removeItem('auth_state');
}
