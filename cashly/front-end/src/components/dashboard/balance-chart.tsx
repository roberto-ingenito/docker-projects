'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface BalanceChartProps {
    className?: string;
}

export function BalanceChart({ className }: BalanceChartProps) {
    // Mock data - in real app this would come from transactions
    const data = [
        { month: 'Jan', balance: 12000 },
        { month: 'Feb', balance: 13500 },
        { month: 'Mar', balance: 12800 },
        { month: 'Apr', balance: 14200 },
        { month: 'May', balance: 15600 },
        { month: 'Jun', balance: 16800 },
    ];

    return (
        <Card className={cn('', className)}>
            <CardHeader>
                <CardTitle>Balance Trend</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data}>
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
                        <Tooltip />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}