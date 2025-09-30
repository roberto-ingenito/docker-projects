'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchAccounts, selectAccount } from '@/lib/redux/slices/accountsSlice';
import { fetchTransactions } from '@/lib/redux/slices/transactionsSlice';
import { fetchCategories } from '@/lib/redux/slices/categoriesSlice';
import { TransactionList } from '@/components/transactions/transaction-list';
import { TransactionForm } from '@/components/transactions/transaction-form';
import { TransactionFilter } from '@/components/transactions/transaction-filter';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function TransactionsPage() {
    const dispatch = useAppDispatch();
    const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
    const { transactions, isLoading } = useAppSelector((state) => state.transactions);
    const [formOpen, setFormOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchAccounts());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (accounts.length > 0 && !selectedAccount) {
            dispatch(selectAccount(accounts[0]));
        }
    }, [accounts, selectedAccount, dispatch]);

    useEffect(() => {
        if (selectedAccount) {
            dispatch(fetchTransactions(selectedAccount.accountId));
        }
    }, [selectedAccount, dispatch]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
                    <p className="text-muted-foreground">
                        Track your income and expenses
                    </p>
                </div>
                <Button onClick={() => setFormOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Transaction
                </Button>
            </div>

            <TransactionFilter />

            <TransactionList
                transactions={transactions}
                isLoading={isLoading}
                accountId={selectedAccount?.accountId}
            />

            <TransactionForm
                open={formOpen}
                onOpenChange={setFormOpen}
                accountId={selectedAccount?.accountId}
            />
        </div>
    );
}