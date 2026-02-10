import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useTheme } from "next-themes";
import { themeConfig } from "@/tailwind.config";
import { useAppSelector } from "@/lib/redux/hooks";
import { TransactionType } from "@/lib/types/transaction";
import { useMemo } from "react";

interface CumulativeBalance {
  date: string;
  saldo: number;
}

interface CumulativeBalanceChartProps {
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

export default function CumulativeBalanceChart({ height }: CumulativeBalanceChartProps) {
  const { theme } = useTheme();
  const transactions = useAppSelector((state) => state.transactions).transactions;

  const primary =
    theme === "light" //
      ? themeConfig.themes!.light.colors!.primary![500]!
      : themeConfig.themes!.dark.colors!.primary![500]!;

  const data = useMemo((): CumulativeBalance[] => {
    if (!transactions.length) return [];

    // 1. Ordiniamo una sola volta
    const sorted = [...transactions].sort((a, b) => new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime());

    let runningBalance = 0;
    const result: CumulativeBalance[] = [];

    // Utilizziamo una mappa per raggruppare mantenendo l'ordine cronologico
    const dailyTotals = new Map<string, number>();

    sorted.forEach((t) => {
      const dateKey = new Date(t.transactionDate).toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "short",
      });

      const amount = t.type === TransactionType.Income ? t.amount : -t.amount;
      dailyTotals.set(dateKey, (dailyTotals.get(dateKey) || 0) + amount);
    });

    // 2. Trasformiamo la Map nel risultato finale con il saldo cumulativo
    dailyTotals.forEach((dayAmount, date) => {
      runningBalance += dayAmount;
      result.push({
        date,
        saldo: Math.round(runningBalance * 100) / 100, // Più veloce di Number(toFixed(2))
      });
    });

    return result;
  }, [transactions]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-default-400">Nessuna transazione disponibile</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
        <XAxis
          dataKey="date"
          stroke={theme === "light" ? "#000000aa" : "#ffffffaa"}
          fontSize={10}
          angle={-45}
          textAnchor="end"
          height={80}
          accumulate="sum"
        />
        <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }} />
        <ReferenceLine y={0} stroke={theme === "light" ? "#000" : "#fff"} strokeDasharray="6 6" />
        <Line type="monotone" dataKey="saldo" name="Saldo" stroke={primary} strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
