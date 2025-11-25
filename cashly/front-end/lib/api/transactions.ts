import { apiClient } from './client';
import { Transaction, TransactionCreateDto, TransactionUpdateDto } from '@/lib/types/transaction';

export const getTransactions = async (): Promise<Transaction[]> => {
    return apiClient.get<Transaction[]>(`/Transactions`);
};

export const createTransaction = async (data: TransactionCreateDto): Promise<Transaction> => {
    return apiClient.post<Transaction>(`/Transactions`, data);
};

export const deleteTransaction = async (transactionId: number): Promise<void> => {
    return apiClient.delete(`/Transactions/${transactionId}`);
};

export function updateTransaction({ transactionId, data }: { transactionId: number; data: TransactionUpdateDto }) {
    return apiClient.put<Transaction>(`/Transactions/${transactionId}`, data);
}

