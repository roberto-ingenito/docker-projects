'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/lib/utils/formatters';

export function ExpensesByCategoryChart() {
    // Mock data - would come from actual transactions
    const data = [
        { name: 'Food & Dining', value: 1200, color: '#3B82F6' },
        { name: 'Transport', value: 800, color: '#10B981' },
        { name: 'Shopping', value: 600, color: '#F59E0B' },
        { name: 'Bills', value: 1500, color: '#EF4444' },
        { name: 'Entertainment', value: 400, color: '#8B5CF6' },
        { name: 'Others', value: 300, color: '#6B7280' },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg bg-background p-3 shadow-lg border">
                    <p className="font-semibold">{payload[0].name}</p>
                    <p className="text-sm">{formatCurrency(payload[0].value)}</p>
                    <p className="text-xs text-muted-foreground">
                        {((payload[0].value / data.reduce((a, b) => a + b.value, 0)) * 100).toFixed(1)}%
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>Breakdown of your spending</CardDescription>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
