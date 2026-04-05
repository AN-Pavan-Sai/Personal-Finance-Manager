import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { CategoryBreakdown } from '../../types';

interface CategoryPieChartProps {
  data: CategoryBreakdown[];
}

const COLORS = [
  '#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e',
  '#8b5cf6', '#0ea5e9', '#ec4899', '#14b8a6', '#a3a3a3',
];

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="glass rounded-xl px-4 py-3 shadow-xl">
        <p className="text-white text-sm font-medium">{payload[0].name}</p>
        <p className="text-lg font-bold mt-1" style={{ color: payload[0].payload.fill }}>
          ₹{parseFloat(payload[0].value).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </p>
        <p className="text-dark-400 text-xs mt-0.5">
          {payload[0].payload.count} transactions
        </p>
      </div>
    );
  }
  return null;
}

function CustomLegend({ payload }: any) {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {payload?.map((entry: any, index: number) => (
        <div key={index} className="flex items-center gap-1.5">
          <div
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-dark-400 text-xs">{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function CategoryPieChart({ data }: CategoryPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="glass-light rounded-2xl p-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
      <h3 className="text-lg font-semibold text-white mb-1">Category Breakdown</h3>
      <p className="text-dark-400 text-sm mb-6">Where your money goes</p>

      {data.length === 0 ? (
        <div className="flex items-center justify-center h-64 text-dark-500 text-sm">
          No data available
        </div>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={3}
                dataKey="total"
                nameKey="category"
                animationBegin={100}
                animationDuration={1000}
              >
                {data.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="transparent"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="text-center mt-2">
            <p className="text-dark-400 text-xs">Total Spent</p>
            <p className="text-2xl font-bold text-white">
              ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
