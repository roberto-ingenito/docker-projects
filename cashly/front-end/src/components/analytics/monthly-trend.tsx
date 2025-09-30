'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';

export function MonthlyTrendChart() {
    // Mock data
    const data = [
        { month: 'Jan', income: 5000, expenses: 3200, savings: 1800 },
        { month: 'Feb', income: 5200, expenses: 3400, savings: 1800 },
        { month: 'Mar', income: 4800, expenses: 3100, savings: 1700 },
        { month: 'Apr', income: 5500, expenses: 3300, savings: 2200 },
        { month: 'May', income: 5300, expenses: 3600, savings: 1700 },
        { month: 'Jun', income: 5800, expenses: 3500, savings: 2300 },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Monthly Financial Trend</CardTitle>
                <CardDescription>Income, expenses and savings over time</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                            </linearGradient>
                        </defs>
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
                        <Area
                            type="monotone"
                            dataKey="income"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#colorIncome)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="expenses"
                            stroke="#ef4444"
                            fillOpacity={1}
                            fill="url(#colorExpenses)"
                            strokeWidth={2}
                        />
                        <Area
                            type="monotone"
                            dataKey="savings"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorSavings)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
