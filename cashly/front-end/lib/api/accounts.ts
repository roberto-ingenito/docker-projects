import { apiClient } from './client';
import { Account, AccountCreateDto, AccountUpdateDto } from '@/lib/types/account';

export const getAccounts = async (): Promise<Account[]> => {
    return apiClient.get<Account[]>('/api/Accounts');
};

export const getAccount = async (accountId: number): Promise<Account> => {
    return apiClient.get<Account>(`/api/Accounts/${accountId}`);
};

export const createAccount = async (data: AccountCreateDto): Promise<Account> => {
    return apiClient.post<Account>('/api/Accounts', data);
};

export const updateAccount = async (accountId: number, data: AccountUpdateDto): Promise<void> => {
    return apiClient.put(`/api/Accounts/${accountId}`, data);
};

export const deleteAccount = async (accountId: number): Promise<void> => {
    return apiClient.delete(`/api/Accounts/${accountId}`);
};
