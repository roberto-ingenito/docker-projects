import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";
import config, { themeConfig } from "@/tailwind.config";

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

  const primary =
    theme === "light" //
      ? themeConfig.themes!.light.colors!.primary![500]!
      : themeConfig.themes!.dark.colors!.primary![500]!;

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
        <Tooltip
          content={<CustomTooltip />}
          cursor={{
            fill: primary,
            opacity: 0.1,
          }}
        />
        <Bar dataKey="spese" name="Spese" fill={primary} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
