'use client';

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { selectAccount } from '@/lib/redux/slices/accountsSlice';
import { setFilters } from '@/lib/redux/slices/transactionsSlice';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

export function TransactionFilter() {
    const dispatch = useAppDispatch();
    const { accounts, selectedAccount } = useAppSelector((state) => state.accounts);
    const { categories } = useAppSelector((state) => state.categories);
    const { filters } = useAppSelector((state) => state.transactions);

    const handleAccountChange = (accountId: string) => {
        const account = accounts.find(a => a.accountId === Number(accountId));
        if (account) {
            dispatch(selectAccount(account));
        }
    };

    return (
        <Card className="p-4">
            <div className="flex flex-wrap gap-4">
                <Select
                    value={selectedAccount?.accountId.toString()}
                    onValueChange={handleAccountChange}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select Account" />
                    </SelectTrigger>
                    <SelectContent>
                        {accounts.map((account) => (
                            <SelectItem key={account.accountId} value={account.accountId.toString()}>
                                {account.accountName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select
                    value={filters.type}
                    onValueChange={(value) => dispatch(setFilters({ ...filters, type: value as any }))}
                >
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all" >All Types</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                        <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filters.categoryId?.toString()}
                    onValueChange={(value) => dispatch(setFilters({
                        ...filters,
                        categoryId: value === 'all' ? undefined : Number(value)
                    }))}
                >
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                                {category.categoryName}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {Object.keys(filters).length > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => dispatch(setFilters({}))}
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>
        </Card>
    );
}