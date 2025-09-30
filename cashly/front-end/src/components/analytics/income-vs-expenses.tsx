'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';

export function IncomeVsExpensesChart() {
    // Mock data - would come from actual transactions
    const data = [
        { month: 'Jan', income: 5000, expenses: 3200 },
        { month: 'Feb', income: 5200, expenses: 3400 },
        { month: 'Mar', income: 4800, expenses: 3100 },
        { month: 'Apr', income: 5500, expenses: 3300 },
        { month: 'May', income: 5300, expenses: 3600 },
        { month: 'Jun', income: 5800, expenses: 3500 },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Monthly comparison of income and expenses</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data}>
                        <XAxis
                            dataKey="month"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `€${value / 1000}k`}
                        />
                        <Tooltip
                            formatter={(value: number) => formatCurrency(value)}
                            contentStyle={{
                                backgroundColor: 'hsl(var(--background))',
                                border: '1px solid hsl(var(--border))',
                                borderRadius: '6px',
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="income"
                            fill="#10b981"
                            radius={[8, 8, 0, 0]}
                            name="Income"
                        />
                        <Bar
                            dataKey="expenses"
                            fill="#ef4444"
                            radius={[8, 8, 0, 0]}
                            name="Expenses"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
