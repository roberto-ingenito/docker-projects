import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

interface WeekdayExpense {
  day: string;
  spese: number;
}

interface WeekdayExpensesChartProps {
  data: WeekdayExpense[];
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

export default function WeekdayExpensesChart({ data, height = 300 }: WeekdayExpensesChartProps) {
  const { theme } = useTheme();

  if (!data.some((d) => d.spese > 0)) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-default-400">Nessuna spesa registrata</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
        <XAxis dataKey="day" stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={11} />
        <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }} />
        <Bar dataKey="spese" name="Spese" fill={theme === "light" ? "#b0b0b0" : "#e0e0e0"} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
