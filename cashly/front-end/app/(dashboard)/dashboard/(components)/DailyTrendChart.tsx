import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import { TransactionType } from "@/lib/types/transaction";
import { useMemo } from "react";
import { useAppSelector } from "@/lib/redux/hooks";

interface DailyData {
  day: string;
  entrate: number;
  uscite: number;
}

interface DailyTrendChartProps {
  selectedTime: Date;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-content1 border border-divider rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-default-700 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-sm" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function DailyTrendChart({ selectedTime, height = 350 }: DailyTrendChartProps) {
  const { theme } = useTheme();

  const transactions = useAppSelector((state) => state.transactions).transactions;

  const data = useMemo((): DailyData[] => {
    const month = selectedTime.getMonth();
    const year = selectedTime.getFullYear();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result: DailyData[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayTransactions = transactions.filter((t) => {
        const tDate = new Date(t.transactionDate);
        return tDate.getDate() === day && tDate.getMonth() === month && tDate.getFullYear() === year;
      });

      const income = dayTransactions.filter((t) => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
      const expenses = dayTransactions.filter((t) => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);

      result.push({
        day: day.toString(),
        entrate: Number(income.toFixed(2)),
        uscite: Number(expenses.toFixed(2)),
      });
    }

    return result;
  }, [transactions, selectedTime]);

  if (!data.some((d) => d.entrate > 0 || d.uscite > 0)) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-default-400">Nessuna transazione in questo mese</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{
          top: 0,
          right: 10,
          left: 0,
          bottom: 0,
        }}>
        <defs>
          <linearGradient id="colorEntrate" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorUscite" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
        <XAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} dataKey="day" fontSize={12} />
        <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area type="monotone" dataKey="entrate" name="Entrate" stroke="#10b981" fillOpacity={1} fill="url(#colorEntrate)" strokeWidth={2} />
        <Area type="monotone" dataKey="uscite" name="Uscite" stroke="#ef4444" fillOpacity={1} fill="url(#colorUscite)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
