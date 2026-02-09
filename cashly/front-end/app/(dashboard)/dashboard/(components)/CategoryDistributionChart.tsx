import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface CategoryExpense {
  name: string;
  value: number;
  color: string;
  percentage: number;
}

interface CategoryDistributionChartProps {
  data: CategoryExpense[];
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

export default function CategoryDistributionChart({ data, height = 300, maxCategories = 6 }: CategoryDistributionChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ height: height + 50 }}>
        <p className="text-default-400">Nessuna spesa categorizzata</p>
      </div>
    );
  }

  const displayData = data.slice(0, maxCategories);

  return (
    <div className="space-y-0 flex items-center flex-col sm:flex-row sm:gap-2">
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={displayData}
            cx="50%"
            cy="50%"
            labelLine={false}
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
      <div className="space-y-2 p-2 w-full sm:w-min ">
        {displayData.map((category, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: category.color }} />
            <span className="text-sm text-default-700 flex-1 truncate">{category.name}</span>
            <span className="text-sm font-medium text-default-900">
              {category.value.toLocaleString("it-IT", { style: "currency", currency: "EUR" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
