import { apiClient } from './client';
import { Transaction, TransactionCreateDto } from '@/lib/types/transaction';

export const getTransactions = async (accountId: number): Promise<Transaction[]> => {
    return apiClient.get<Transaction[]>(`/api/Accounts/${accountId}/Transactions`);
};

export const createTransaction = async (
    accountId: number,
    data: TransactionCreateDto
): Promise<Transaction> => {
    return apiClient.post<Transaction>(`/api/Accounts/${accountId}/Transactions`, data);
};
