'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchAccount } from '@/lib/redux/slices/accountsSlice';
import { fetchTransactions } from '@/lib/redux/slices/transactionsSlice';
import { AccountDetails } from '@/components/accounts/account-details';
import { TransactionList } from '@/components/transactions/transaction-list';
import { Skeleton } from '@/components/ui/skeleton';

export default function AccountDetailsPage() {
    const params = useParams();
    const dispatch = useAppDispatch();
    const accountId = Number(params.id);

    const { selectedAccount } = useAppSelector((state) => state.accounts);
    const { transactions, isLoading } = useAppSelector((state) => state.transactions);

    useEffect(() => {
        if (accountId) {
            dispatch(fetchAccount(accountId));
            dispatch(fetchTransactions(accountId));
        }
    }, [dispatch, accountId]);

    if (!selectedAccount) {
        return <AccountDetailsSkeleton />;
    }

    return (
        <div className="space-y-6">
            <AccountDetails account={selectedAccount} />
            <TransactionList
                transactions={transactions}
                isLoading={isLoading}
                accountId={accountId}
            />
        </div>
    );
}

function AccountDetailsSkeleton() {
    return (
        <div className="space-y-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-96" />
        </div>
    );
}