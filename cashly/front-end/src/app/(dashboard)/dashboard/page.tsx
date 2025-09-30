'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchAccounts } from '@/lib/redux/slices/accountsSlice';
import { fetchCategories } from '@/lib/redux/slices/categoriesSlice';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { BalanceChart } from '@/components/dashboard/balance-chart';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
    const dispatch = useAppDispatch();
    const { accounts, isLoading: accountsLoading } = useAppSelector((state) => state.accounts);
    const { categories } = useAppSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchAccounts());
        dispatch(fetchCategories());
    }, [dispatch]);

    if (accountsLoading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your financial activities
                </p>
            </div>

            <StatsCards accounts={accounts} />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <BalanceChart className="col-span-4" />
                <RecentTransactions className="col-span-3" />
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="mt-2 h-4 w-64" />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                ))}
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Skeleton className="col-span-4 h-80" />
                <Skeleton className="col-span-3 h-80" />
            </div>
        </div>
    );
}