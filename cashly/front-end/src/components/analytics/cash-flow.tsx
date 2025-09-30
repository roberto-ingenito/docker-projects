'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, ReferenceLine } from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';

export function CashFlowChart() {
    // Mock data
    const data = [
        { date: '01', balance: 12000, projected: 12000 },
        { date: '05', balance: 13500, projected: 13200 },
        { date: '10', balance: 12800, projected: 12900 },
        { date: '15', balance: 14200, projected: 14000 },
        { date: '20', balance: 13600, projected: 13800 },
        { date: '25', balance: 15100, projected: 15000 },
        { date: '30', balance: 16800, projected: 16500 },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cash Flow Analysis</CardTitle>
                <CardDescription>Actual vs projected cash flow for the current month</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={data}>
                        <XAxis
                            dataKey="date"
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
                        <ReferenceLine y={14000} stroke="#888" strokeDasharray="3 3" />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="#3b82f6"
                            strokeWidth={3}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                            name="Actual"
                        />
                        <Line
                            type="monotone"
                            dataKey="projected"
                            stroke="#888"
                            strokeWidth={2}
                            strokeDasharray="5 5"
                            dot={{ r: 3 }}
                            name="Projected"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
