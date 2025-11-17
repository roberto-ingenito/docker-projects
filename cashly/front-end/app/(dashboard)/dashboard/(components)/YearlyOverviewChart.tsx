import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

interface MonthlyData {
  month: string;
  entrate: number;
  uscite: number;
}

interface YearlyOverviewChartProps {
  data: MonthlyData[];
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

export default function YearlyOverviewChart({ data, height = 350 }: YearlyOverviewChartProps) {
  const { theme } = useTheme();

  if (!data.some((d) => d.entrate > 0 || d.uscite > 0)) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <p className="text-default-400">Nessun dato disponibile per quest'anno</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={theme === "light" ? "#00000033" : "#ffffff33"} />
        <XAxis dataKey="month" stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
        <YAxis stroke={theme === "light" ? "#000000aa" : "#ffffffaa"} fontSize={12} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: theme === "light" ? "#000" : "#fff", opacity: 0.1 }} />
        <Legend />
        <Bar dataKey="entrate" name="Entrate" fill="#10b981" radius={[4, 4, 0, 0]} />
        <Bar dataKey="uscite" name="Uscite" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
