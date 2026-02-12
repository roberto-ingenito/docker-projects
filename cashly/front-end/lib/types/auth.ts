export interface User {
  userId: number;
  email: string;
  password: string;
  createdAt: string;
  currency: string;
}

export type UserCreateDto = Pick<User, "email" | "password">;

export type UserLoginDto = Pick<User, "email" | "password">;

export interface UserLoginResponseDto {
  token: string;
  user: Omit<User, "password">;
}

export interface AuthState {
  user: Omit<User, "password"> | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
