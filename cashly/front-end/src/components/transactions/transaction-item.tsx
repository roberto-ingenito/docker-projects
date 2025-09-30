import { Transaction, TransactionType } from '@/lib/types/transaction';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils/formatters';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface TransactionItemProps {
    transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
    const isIncome = transaction.type === TransactionType.Income;

    return (
        <div className="flex items-center justify-between p-4 hover:bg-accent/50 transition-colors">
            <div className="flex items-center space-x-4">
                <div className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full',
                    isIncome ? 'bg-green-100' : 'bg-red-100'
                )}>
                    {isIncome ? (
                        <ArrowUpIcon className="h-5 w-5 text-green-600" />
                    ) : (
                        <ArrowDownIcon className="h-5 w-5 text-red-600" />
                    )}
                </div>
                <div>
                    <p className="font-medium">
                        {transaction.description || (isIncome ? 'Income' : 'Expense')}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                        {transaction.category && (
                            <Badge
                                variant="outline"
                                className="text-xs"
                                style={{
                                    borderColor: transaction.category.colorHex || undefined,
                                    color: transaction.category.colorHex || undefined
                                }}
                            >
                                {transaction.category.categoryName}
                            </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                            {new Date(transaction.transactionDate).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>
                </div>
            </div>
            <span className={cn(
                'text-lg font-semibold',
                isIncome ? 'text-green-600' : 'text-red-600'
            )}>
                {isIncome ? '+' : '-'}
                {formatCurrency(transaction.amount)}
            </span>
        </div>
    );
}
