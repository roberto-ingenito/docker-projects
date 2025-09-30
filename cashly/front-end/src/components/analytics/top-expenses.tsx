'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { ArrowDownIcon } from 'lucide-react';

export function TopExpensesTable() {
    // Mock data
    const expenses = [
        { id: 1, description: 'Rent Payment', amount: 1200, category: 'Bills', date: new Date('2024-01-01') },
        { id: 2, description: 'Supermarket', amount: 285.50, category: 'Food', date: new Date('2024-01-05') },
        { id: 3, description: 'Gas Station', amount: 180, category: 'Transport', date: new Date('2024-01-08') },
        { id: 4, description: 'Electric Bill', amount: 120, category: 'Bills', date: new Date('2024-01-10') },
        { id: 5, description: 'Restaurant', amount: 85, category: 'Food', date: new Date('2024-01-12') },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top Expenses</CardTitle>
                <CardDescription>Your largest expenses this month</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {expenses.map((expense, index) => (
                        <div key={expense.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-medium">{expense.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs">
                                            {expense.category}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(expense.date)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <span className="text-red-600 font-semibold">
                                -{formatCurrency(expense.amount)}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}