import { apiClient } from './client';
import { Transaction, TransactionCreateDto } from '@/lib/types/transaction';

export const getTransactions = async (): Promise<Transaction[]> => {
    return apiClient.get<Transaction[]>(`/Transactions`);
};

export const createTransaction = async (data: TransactionCreateDto): Promise<Transaction> => {
    return apiClient.post<Transaction>(`/Transactions`, data);
};
