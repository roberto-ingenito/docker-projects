export interface Account {
    accountId: number;
    accountName: string;
    currentBalance: number;
    currency: string;
    createdAt: string;
}

export interface AccountCreateDto {
    accountName: string;
    initialBalance: number;
}

export interface AccountUpdateDto {
    accountName?: string;
}

export interface AccountsState {
    accounts: Account[];
    selectedAccount: Account | null;
    isLoading: boolean;
    error: string | null;
}
