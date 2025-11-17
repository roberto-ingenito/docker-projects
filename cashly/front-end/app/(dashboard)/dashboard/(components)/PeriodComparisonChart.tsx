import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

interface ComparisonData {
  period: string;
  corrente: number;
  precedente: number;
}

interface PeriodComparisonChartProps {
  data: ComparisonData[];
  height?: number;
  currentLabel?: string;
  previousLabel?: string;
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

export default function PeriodComparisonChart({
  data,
  height = 350,
  currentLabel = "Mese Corrente",
  previousLabel = "Mese Precedente",
}: PeriodComparisonChartProps) {
  const { theme } = useTheme();

  if (!data.some((d) => d.corrente > 0 || d.precedente > 0)) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-default-400">Dati insufficienti per il confronto</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
        <XAxis dataKey="period" stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
        <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }} />
        <Legend />
        <Line type="monotone" dataKey="corrente" name={currentLabel} stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
        <Line type="monotone" dataKey="precedente" name={previousLabel} stroke="#9ca3af" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
