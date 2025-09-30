import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface RecentTransactionsProps {
    className?: string;
}

export function RecentTransactions({ className }: RecentTransactionsProps) {
    // Mock data - in real app this would come from state
    const transactions = [
        {
            id: 1,
            description: 'Grocery Store',
            amount: -85.50,
            type: 'expense',
            category: 'Food',
            date: new Date('2024-01-15'),
        },
        {
            id: 2,
            description: 'Salary',
            amount: 3500,
            type: 'income',
            category: 'Work',
            date: new Date('2024-01-14'),
        },
        {
            id: 3,
            description: 'Netflix Subscription',
            amount: -15.99,
            type: 'expense',
            category: 'Entertainment',
            date: new Date('2024-01-13'),
        },
        {
            id: 4,
            description: 'Freelance Project',
            amount: 1200,
            type: 'income',
            category: 'Work',
            date: new Date('2024-01-12'),
        },
        {
            id: 5,
            description: 'Electric Bill',
            amount: -120,
            type: 'expense',
            category: 'Bills',
            date: new Date('2024-01-11'),
        },
    ];

    return (
        <Card className={cn('', className)}>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className={cn(
                                    'flex h-8 w-8 items-center justify-center rounded-full',
                                    transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                )}>
                                    {transaction.type === 'income' ? (
                                        <ArrowUpIcon className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <ArrowDownIcon className="h-4 w-4 text-red-600" />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{transaction.description}</p>
                                    <div className="flex items-center space-x-2">
                                        <Badge variant="outline" className="text-xs">
                                            {transaction.category}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(transaction.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className={cn(
                                'font-semibold',
                                transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            )}>
                                {transaction.type === 'income' ? '+' : ''}
                                {formatCurrency(Math.abs(transaction.amount))}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}