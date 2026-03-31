import { computed, Injectable, signal } from '@angular/core';

export interface User {
  id: string;
  email: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  currentUser = signal<User | null>(null);
  isLoggedIn = computed(() => this.currentUser() !== null);

  login(user: User) {
    this.currentUser.set(user);
  }

  logout() {
    this.currentUser.set(null);
  }
}
