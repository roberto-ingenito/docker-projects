import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import { TransactionType } from "@/lib/types/transaction";
import { useMemo } from "react";
import { useAppSelector } from "@/lib/redux/hooks";

interface MonthlyData {
  month: string;
  entrate: number;
  uscite: number;
}

interface YearlyOverviewChartProps {
  selectedTime: Date;
  height?: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    // Recuperiamo i dati originali dal primo elemento del payload
    const { originalEntrate, originalUscite } = payload[0].payload;

    return (
      <div className="bg-content1 border border-divider rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-default-700 mb-2">{`${label}`}</p>
        <p className="text-sm" style={{ color: "#10b981" }}>{`Entrate: ${(originalEntrate as number).toFixed(2)}€`}</p>
        <p className="text-sm" style={{ color: "#ef4444" }}>{`Uscite: ${(originalUscite as number).toFixed(2)}€`}</p>
      </div>
    );
  }
  return null;
};

export default function YearlyOverviewChart({ selectedTime, height }: YearlyOverviewChartProps) {
  const { theme } = useTheme();
  const transactions = useAppSelector((state) => state.transactions).transactions;

  const data = useMemo((): MonthlyData[] => {
    const result: MonthlyData[] = [];

    for (let month = 0; month < 12; month++) {
      const monthTransactions = transactions.filter((t) => {
        const tDate = new Date(t.transactionDate);
        return tDate.getMonth() === month && tDate.getFullYear() === selectedTime.getFullYear();
      });

      const income = monthTransactions.filter((t) => t.type === TransactionType.Income).reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions.filter((t) => t.type === TransactionType.Expense).reduce((sum, t) => sum + t.amount, 0);

      result.push({
        month: new Date(selectedTime.getFullYear(), month).toLocaleDateString("it-IT", { month: "short" }),
        entrate: Number(income.toFixed(2)),
        uscite: Number(expenses.toFixed(2)),
      });
    }

    return result;
  }, [transactions, selectedTime]);

  if (!data.some((d) => d.entrate > 0 || d.uscite > 0)) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-default-400">Nessun dato disponibile per quest'anno</p>
      </div>
    );
  }

  const processedData = data.map((item) => ({
    ...item,
    // Il valore reale delle uscite (la base)
    usciteStack: item.uscite,
    // La differenza necessaria per arrivare al valore totale delle entrate
    // Usiamo Math.max per evitare numeri negativi se le uscite superano le entrate
    entrateDifferenza: Math.max(0, item.entrate - item.uscite),
    // Conserviamo i valori originali per il tooltip
    originalEntrate: item.entrate,
    originalUscite: item.uscite,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={processedData}
        margin={{
          top: 0,
          right: 0,
          left: 0,
          bottom: 0,
        }}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
        <XAxis dataKey="month" stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
        <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />

        {/* Passiamo i dati originali al Tooltip */}
        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }} />
        <Legend />

        {/* Barra Base (Uscite) */}
        <Bar dataKey="usciteStack" name="Uscite" stackId="a" fill="#ef4444" />

        {/* Barra Superiore (La parte mancante per arrivare alle Entrate) */}
        <Bar dataKey="entrateDifferenza" name="Entrate" stackId="a" fill="#10b981" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
