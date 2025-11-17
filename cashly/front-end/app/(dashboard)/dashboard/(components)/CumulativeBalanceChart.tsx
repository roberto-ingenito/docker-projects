import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useTheme } from "next-themes";

interface CumulativeBalance {
  date: string;
  saldo: number;
}

interface CumulativeBalanceChartProps {
  data: CumulativeBalance[];
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

export default function CumulativeBalanceChart({ data, height = 300 }: CumulativeBalanceChartProps) {
  const { theme } = useTheme();

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-default-400">Nessuna transazione disponibile</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
        <XAxis dataKey="date" stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={10} angle={-45} textAnchor="end" height={80} />
        <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }} />
        <ReferenceLine y={0} stroke={theme === "light" ? "#000" : "#fff"} strokeDasharray="6 6" />
        <Line type="monotone" dataKey="saldo" name="Saldo" stroke={theme === "light" ? "#000" : "#fff"} strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
