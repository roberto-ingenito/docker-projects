import {
  ComposedChart, // <--- Usiamo ComposedChart invece di AreaChart
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";
import { TransactionType } from "@/lib/types/transaction";
import { useMemo } from "react";
import { useAppSelector } from "@/lib/redux/hooks";
import { subDays, startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from "date-fns";

interface DailyData {
  day: string;
  entrate: number;
  uscite: number;
  mediaMobile: number;
}

interface DailyTrendChartProps {
  selectedTime: Date;
  height?: number;
  windowSize?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-content1 border border-divider rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-default-700 mb-2">Giorno {label}</p>
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

export default function DailyTrendChart({ selectedTime, height, windowSize = 7 }: DailyTrendChartProps) {
  const { theme } = useTheme();
  const transactions = useAppSelector((state) => state.transactions).transactions;

  const data = useMemo((): DailyData[] => {
    const startOfSelectedMonth = startOfMonth(selectedTime);
    const endOfSelectedMonth = endOfMonth(selectedTime);

    // 1. Calcolo intervallo esteso (Buffer giorni precedenti)
    const startOfBuffer = subDays(startOfSelectedMonth, windowSize - 1);
    const extendedDays = eachDayOfInterval({ start: startOfBuffer, end: endOfSelectedMonth });

    const dailyTotals = extendedDays.map((date) => {
      const dayTransactions = transactions.filter((t) => isSameDay(new Date(t.transactionDate), date));

      const income = dayTransactions.filter((t) => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);

      const expenses = dayTransactions.filter((t) => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);

      return { date, income, expenses };
    });

    // 2. Costruzione dataset finale
    const result: DailyData[] = [];

    dailyTotals.forEach((dayData, index) => {
      if (dayData.date >= startOfSelectedMonth) {
        // Calcolo Media Mobile (sulle USCITE)
        const windowSlice = dailyTotals.slice(Math.max(0, index - (windowSize - 1)), index + 1);
        const sumExpenses = windowSlice.reduce((acc, curr) => acc + curr.expenses, 0);
        const movingAverage = sumExpenses / windowSlice.length;

        result.push({
          day: format(dayData.date, "d"),
          entrate: Number(dayData.income.toFixed(2)),
          uscite: Number(dayData.expenses.toFixed(2)),
          mediaMobile: Number(movingAverage.toFixed(2)),
        });
      }
    });

    return result;
  }, [transactions, selectedTime, windowSize]);

  if (!data.some((d) => d.entrate > 0 || d.uscite > 0)) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-default-400">Nessuna transazione in questo mese</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {/* ComposedChart permette di mixare Bar e Line */}
      <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000015" : "#ffffff15"} vertical={false} />

        <XAxis
          stroke={theme === "light" ? "#000000aa" : "#ffffffaa"}
          dataKey="day"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          // Ho rimosso il domain manuale che avevi inserito, lascia che Recharts gestisca i giorni
        />

        <YAxis
          stroke={theme === "light" ? "#000000aa" : "#ffffffaa"}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `€${value}`}
        />

        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#0000000a" : "#ffffff0a" }} />
        <Legend verticalAlign="top" height={36} />
        {/* <Bar dataKey="entrate" name="Entrate" fill="#10b981" radius={[4, 4, 0, 0]} /> */}
        <Bar dataKey="uscite" name="Uscite" fill="#ef4444" radius={[4, 4, 0, 0]} />
        <Line type="monotone" dataKey="mediaMobile" name={`Media Mobile Uscite (${windowSize}gg)`} stroke="#3b82f6" strokeWidth={2} dot={false} />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
