import { Transaction } from '@/lib/types/transaction';
import { TransactionItem } from './transaction-item';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface TransactionListProps {
    transactions: Transaction[];
    isLoading: boolean;
    accountId?: number;
}

export function TransactionList({ transactions, isLoading, accountId }: TransactionListProps) {
    if (isLoading) {
        return (
            <Card className="p-6">
                <div className="space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-16" />
                    ))}
                </div>
            </Card>
        );
    }

    if (!accountId) {
        return (
            <Card className="p-12 text-center">
                <p className="text-muted-foreground">Please select an account first</p>
            </Card>
        );
    }

    if (transactions.length === 0) {
        return (
            <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No transactions yet</p>
                <p className="text-sm text-muted-foreground">
                    Add your first transaction to start tracking
                </p>
            </Card>
        );
    }

    // Group transactions by date
    const groupedTransactions = transactions.reduce((groups, transaction) => {
        const date = new Date(transaction.transactionDate).toDateString();
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(transaction);
        return groups;
    }, {} as Record<string, Transaction[]>);

    return (
        <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
                <div key={date}>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground">
                        {new Date(date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </h3>
                    <Card>
                        <div className="divide-y">
                            {dayTransactions.map((transaction) => (
                                <TransactionItem key={transaction.transactionId} transaction={transaction} />
                            ))}
                        </div>
                    </Card>
                </div>
            ))}
        </div>
    );
}
