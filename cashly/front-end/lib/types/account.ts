export interface Account {
    accountId: number;
    accountName: string;
    initialBalance: number;
    currentBalance: number;
    currency: string | null;
    createdAt: string; // ISO date string
    userId: number;
}

export interface AccountCreateDto {
    accountName: string;
    initialBalance: number;
}

export interface AccountUpdateDto {
    accountName?: string | null;
}

export interface AccountResponseDto {
    accountId: number;
    accountName: string | null;
    currentBalance: number;
    currency: string | null;
    createdAt: string; // ISO date string
}