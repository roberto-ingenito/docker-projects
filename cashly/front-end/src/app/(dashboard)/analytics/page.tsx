'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { fetchAccounts } from '@/lib/redux/slices/accountsSlice';
import { fetchCategories } from '@/lib/redux/slices/categoriesSlice';
import { fetchTransactions } from '@/lib/redux/slices/transactionsSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ExpensesByCategoryChart } from '@/components/analytics/expenses-by-category';
import { IncomeVsExpensesChart } from '@/components/analytics/income-vs-expenses';
import { MonthlyTrendChart } from '@/components/analytics/monthly-trend';
import { CashFlowChart } from '@/components/analytics/cash-flow';
import { TopExpensesTable } from '@/components/analytics/top-expenses';
import { DATE_RANGES } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

export default function AnalyticsPage() {
    const dispatch = useAppDispatch();
    const { accounts, isLoading: accountsLoading } = useAppSelector((state) => state.accounts);
    const { transactions, isLoading: transactionsLoading } = useAppSelector((state) => state.transactions);
    const [selectedAccount, setSelectedAccount] = useState<string>('all');
    const [dateRange, setDateRange] = useState<string>('last30days');

    useEffect(() => {
        dispatch(fetchAccounts());
        dispatch(fetchCategories());
    }, [dispatch]);

    useEffect(() => {
        if (selectedAccount !== 'all') {
            dispatch(fetchTransactions(Number(selectedAccount)));
        }
    }, [selectedAccount, dispatch]);

    if (accountsLoading || transactionsLoading) {
        return <AnalyticsSkeleton />;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                    <p className="text-muted-foreground">
                        Detailed insights into your financial data
                    </p>
                </div>
                <div className="flex gap-2">
                    <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select account" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Accounts</SelectItem>
                            {accounts.map((account) => (
                                <SelectItem key={account.accountId} value={account.accountId.toString()}>
                                    {account.accountName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select range" />
                        </SelectTrigger>
                        <SelectContent>
                            {DATE_RANGES.map((range) => (
                                <SelectItem key={range.value} value={range.value}>
                                    {range.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="income">Income</TabsTrigger>
                    <TabsTrigger value="expenses">Expenses</TabsTrigger>
                    <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <IncomeVsExpensesChart />
                        <ExpensesByCategoryChart />
                    </div>
                    <MonthlyTrendChart />
                </TabsContent>

                <TabsContent value="income" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Income Sources</CardTitle>
                                <CardDescription>Breakdown of your income by source</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <IncomeSourcesChart />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Income Growth</CardTitle>
                                <CardDescription>Month over month income growth</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <IncomeGrowthChart />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="expenses" className="space-y-4">
                    <div className="grid gap-4 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <ExpensesByCategoryChart />
                        </div>
                        <TopExpensesTable />
                    </div>
                </TabsContent>

                <TabsContent value="cashflow" className="space-y-4">
                    <CashFlowChart />
                </TabsContent>
            </Tabs>
        </div>
    );
}

function AnalyticsSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-8 w-32" />
                <Skeleton className="mt-2 h-4 w-64" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
                <Skeleton className="h-80" />
                <Skeleton className="h-80" />
            </div>
            <Skeleton className="h-96" />
        </div>
    );
}

// Placeholder components - these would be implemented separately
function IncomeSourcesChart() {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">Income Sources Chart</div>;
}

function IncomeGrowthChart() {
    return <div className="h-64 flex items-center justify-center text-muted-foreground">Income Growth Chart</div>;
}
