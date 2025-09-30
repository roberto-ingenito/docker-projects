import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Account } from '@/lib/types/account';
import { formatCurrency } from '@/lib/utils/formatters';
import { TrendingUp, TrendingDown, Wallet, PiggyBank } from 'lucide-react';

interface StatsCardsProps {
    accounts: Account[];
}

export function StatsCards({ accounts }: StatsCardsProps) {
    const totalBalance = accounts.reduce((sum, acc) => sum + acc.currentBalance, 0);
    const totalAccounts = accounts.length;

    // These would be calculated from transactions in a real app
    const monthlyIncome = 5000;
    const monthlyExpenses = 3200;

    const stats = [
        {
            title: 'Total Balance',
            value: formatCurrency(totalBalance),
            icon: <Wallet className="h-4 w-4 text-muted-foreground" />,
            change: '+12.5%',
            trend: 'up',
        },
        {
            title: 'Monthly Income',
            value: formatCurrency(monthlyIncome),
            icon: <TrendingUp className="h-4 w-4 text-green-500" />,
            change: '+8.2%',
            trend: 'up',
        },
        {
            title: 'Monthly Expenses',
            value: formatCurrency(monthlyExpenses),
            icon: <TrendingDown className="h-4 w-4 text-red-500" />,
            change: '-3.4%',
            trend: 'down',
        },
        {
            title: 'Savings Rate',
            value: `${((monthlyIncome - monthlyExpenses) / monthlyIncome * 100).toFixed(1)}%`,
            icon: <PiggyBank className="h-4 w-4 text-purple-500" />,
            change: '+15.3%',
            trend: 'up',
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        {stat.icon}
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                        <p className="text-xs text-muted-foreground">
                            <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                                {stat.change}
                            </span>{' '}
                            from last month
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}