import { Category } from "./category";

export enum TransactionType {
    Income = "income",
    Expense = "expense",
}

export interface Transaction {
    transactionId: number;
    amount: number;
    type: TransactionType;
    transactionDate: string;
    description?: string | null;
    category?: Category | null;
}

export interface TransactionCreateDto {
    amount: number;
    type: TransactionType;
    categoryId?: number | null;
    transactionDate: string;
    description?: string | null;
}

export interface TransactionUpdateDto {
    amount: number;
    type: TransactionType;
    categoryId?: number | null;
    transactionDate: string;
    description?: string | null;
}