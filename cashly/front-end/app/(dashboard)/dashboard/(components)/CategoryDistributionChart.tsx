import { useAppSelector } from "@/lib/redux/hooks";
import { TransactionType } from "@/lib/types/transaction";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CategoryExpense {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface CategoryDistributionChartProps {
  selectedTime: Date;
  height?: number;
  maxCategories?: number;
}

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-content1 border border-divider rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-default-700">{payload[0].name}</p>
        <p className="text-sm text-default-600">{payload[0].value.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}</p>
        <p className="text-xs text-default-500">{payload[0].payload.percentage.toFixed(1)}%</p>
      </div>
    );
  }
  return null;
};

export default function CategoryDistributionChart({ selectedTime, height = 350, maxCategories = 6 }: CategoryDistributionChartProps) {
  const transactions = useAppSelector((state) => state.transactions).transactions;
  const categories = useAppSelector((state) => state.categories.categories);

  function getTransactionCategory(categoryId: number | null) {
    return categories.find((x) => x.categoryId === categoryId);
  }

  const data = useMemo((): CategoryExpense[] => {
    const month = selectedTime.getMonth();
    const year = selectedTime.getFullYear();

    const categoryMap = new Map<number, { name: string; value: number; color: string }>();
    const expenseTransactions = transactions.filter((t) => {
      const tDate = new Date(t.transactionDate);
      return t.type === TransactionType.Expense && tDate.getMonth() === month && tDate.getFullYear() === year;
    });
    const totalExpenses = expenseTransactions.reduce((sum, t) => sum + t.amount, 0);

    expenseTransactions.forEach((t) => {
      const categoryId = t.categoryId ?? -1;
      const existing = categoryMap.get(categoryId);

      if (existing) {
        existing.value += t.amount;
      } else {
        categoryMap.set(categoryId, {
          name: getTransactionCategory(t.categoryId)?.categoryName ?? "Senza categoria",
          value: t.amount,
          color: getTransactionCategory(t.categoryId)?.colorHex || "#9ca3af",
        });
      }
    });

    return Array.from(categoryMap.values())
      .map((item) => ({
        ...item,
        percentage: totalExpenses > 0 ? (item.value / totalExpenses) * 100 : 0,
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, categories, selectedTime]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: height }}>
        <p className="text-default-400">Nessuna spesa categorizzata</p>
      </div>
    );
  }

  const displayData = data.slice(0, maxCategories);

  return (
    <div className="w-full h-full space-y-0 flex items-center flex-col sm:flex-row sm:gap-2">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            labelLine={false}
            isAnimationActive={false}
            label={({ percentage }) => `${percentage.toFixed(0)}%`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value">
            {displayData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<PieTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      <div className="p-2 w-full flex flex-wrap gap-x-6 gap-y-2 sm:w-min sm:flex-col">
        {displayData.map((category, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
            <span className="text-sm text-default-700 flex-1 truncate">{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
