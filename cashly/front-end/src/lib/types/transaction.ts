import { Category } from "./category";

export enum TransactionType {
    Income = 'income',
    Expense = 'expense'
}

export interface Transaction {
    transactionId: number;
    amount: number;
    type: TransactionType;
    transactionDate: string;
    description?: string;
    accountId: number;
    category?: Category;
}

export interface TransactionCreateDto {
    amount: number;
    type: TransactionType;
    categoryId?: number;
    transactionDate?: string;
    description?: string;
}

export interface TransactionsState {
    transactions: Transaction[];
    isLoading: boolean;
    error: string | null;
    filters: {
        accountId?: number;
        type?: TransactionType;
        categoryId?: number;
        dateFrom?: string;
        dateTo?: string;
    };
}
