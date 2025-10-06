
export interface User {
    userId: number;
    email: string;
    createdAt: string;
}

export interface UserCreateDto {
    email: string;
    password: string;
}

export interface UserLoginDto {
    email: string;
    password: string;
}

export interface UserLoginResponseDto {
    token: string;
    user: User;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}